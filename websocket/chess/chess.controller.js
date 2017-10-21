const uuid = require('uuid');
const ChessInstance = require('./chess-instance');
const ChessUser = require('./chess-user');

let sessions = {}; // sessionId: user
let users = {}; // username: {username, socket, game, isOnline, challengesReceived: {username: game}, challengeSent: game}

function chessWebsocket(io){

  io.on('connect', function(socket){

    socket.user = new ChessUser(socket);
    socket.sessionId = '';

    console.log('connected')

    // Debug
    socket.use((packet, next) => {
      console.log('packet', packet);
      next();
    })

    socket.on('join-lobby', ({username}, cb) => {
      console.log('join-lobby');
      socket.sessionId = uuid.v4();
      socket.user.setName(username);

      users[username] = socket.user;
      sessions[socket.sessionId] = socket.user;
      console.log('add user', username, socket.sessionId)
      socket.emit('set-session-id', {sessionId: socket.sessionId});
      socket.broadcast.emit('user-added', username);
      socket.emit('set-users', getLobbyUsers());
      // No errors
      callback(cb);
    });
    
    socket.on('rejoin', ({sessionId}) => {
      if(sessions[sessionId]){
        socket.sessionId = sessionId;
        socket.user = sessions[sessionId];
        socket.user.setSocket(socket.id);
        socket.user.isOnline = true;
        socket.emit('set-users', users);
        // TODO: check if player is in a game
      }
    });
    
    socket.on('challenge-player', ({username, timeLimit, maxRounds, row1, row2}, cb) => {
      console.log('challenge-player')
      const challengedUser = users[username];
      if(socket.user.challengeSent){
        console.log('challenge already sent');
        callback(cb, 'challenge-already-sent');
      }
      if(!challengedUser || !challengedUser.isOnline || challengedUser.game){
        console.log('user is unavailable', challengedUser, !challengedUser || !challengedUser.isOnline || challengedUser.game);
        callback(cb, 'user-is-unavailable');
        return;
      }
      const game = new ChessInstance({whitePlayer: socket.user, blackPlayer: challengedUser, timeLimit, roundLimit: maxRounds, row1, row2}, io);
      socket.user.challengeSent = game;
      challengedUser.challengesReceived[socket.user.username] = game;

      console.log('send challenge', challengedUser.getState());
      game.sendChallenge();
    });

    socket.on('cancel-challenge', () => {
      socket.user.cancelChallenge();
    });

    socket.on('accept-challenge', (challengerName, cb) => {
      // starts new game
      // TODO: error handling
      const user = socket.user;
      const opponent = users[challengerName];
      const challenge = user.challengesReceived[challengerName];
      if(!challenge || !opponent){
        callback(cb, 'user-unavailable');
        return;
      }
      const game = challenge;

      // Cancel all other challenges players may have received/sent
      user.challengesReceived[opponent.username] = undefined;
      user.cancelChallenge();
      user.denyChallenges();
      opponent.denyChallenges();

      socket.join(game.id);
      opponent.socket.join(game.id);

      console.log('starting new game');
      game.newGame();

      callback(cb);
      
    });
    
    socket.on('deny-challenge', (challenger) => {
      socket.user.denyChallenge(challenger);
    });
    
    socket.on('game-action', (gameMove, cb) => {
      const game = this.user.game;
      if(!game){
        callback(cb, 'game-does-not-exist');
        return;
      }
      // Todo: More error handling
      try{
        game.makeMove(gameMove);
        callback(cb);
      } catch(e) {
        console.log('game-action error');
        callback(cb, e)
      }
    });
    
    socket.on('get-state', function(cb){
      callback(cb, getLobbyUsers());
    });

    socket.on('reconnect', () => {
      console.log('reconnect', socket.user.getState());
    })

    socket.on('disconnect', () => {
      const user = socket.user;
      user.isOnline = false;
      console.log('disconnect', user.getState());
      socket.broadcast.emit('user-removed', user.username);

      user.cancelChallenge();
      user.denyChallenges();

      setTimeout(() => {
        if(socket.user !== user || !user.isOnline){
          console.log('60 s timeout, clearing user', user.getState());
          delete users[socket.user.id];
          delete sessions[socket.sessionId];
          const game = user.game;
          if(game && !game.hasActivePlayers()){
            console.log('Game has no active players, clearing')
            game.clearInterval();
          }
          // Todo: Emit something to opponent if in game?
        }
      }, 60 * 1000);
    });
    

  });
}

function getLobbyUsers(){
  const userList = [];
  for(let username in users){
    const user = users[username];
    if(!user.isOnline || user.isInGame){ continue; }
    userList.push(username);
  }
  return userList;
}

// Ensures that callback is a function before it's called
function callback(callbackFunction, error, returnValue){
  if(typeof callbackFunction === "function"){
    callbackFunction(error, returnValue);
  }
}

module.exports = chessWebsocket;