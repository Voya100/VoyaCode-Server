const uuid = require('uuid');
const ChessGame = require('./game/chess-game');

let sessions = {}; // sessionId: user
let users = {}; // username: {username, socketId, gameId, isOnline, ?challenge}
let games = {}; // gameId: {whitePlayer, blackPlayer, game, timeLimit, hasEnded}
let challenges = {}; // username: {username, timeLimit, roundLimit, row1, row2}

function chessWebsocket(io){

  io.on('connect', function(socket){

    socket.user = {};
    socket.sessionId = '';

    console.log('connected')

    socket.emit('test', {data: 'hello player!'});

    // Debug
    socket.use((packet, next) => {
      console.log('packet', packet);
      next();
    })

    socket.on('join-lobby', ({username}, callback) => {
      console.log('join-lobby');
      socket.sessionId = uuid.v4();
      socket.user = {username, socketId: socket.id, isOnline: true, isInGame: false}

      users[username] = socket.user;
      sessions[socket.sessionId] = socket.user;
      console.log('add user', username, socket.sessionId)
      socket.emit('set-session-id', {sessionId: socket.sessionId});
      socket.broadcast.emit('user-added', username);
      socket.emit('set-users', getLobbyUsers());
      // No errors
      callback();
    });
    
    socket.on('rejoin', ({sessionId}) => {
      if(sessions[sessionId]){
        socket.sessionId = sessionId;
        socket.user = sessions[sessionId];
        socket.uset.socketId = socket.id;
        socket.user.isOnline = true;
        socket.emit('set-users', users);
        // TODO: check if player is in a game
      }
    });
    
    socket.on('challenge-player', ({username, timeLimit, maxRounds, row1, row2}, callback) => {
      console.log('challenge-player')
      const challengedUser = users[username];
      if(!challengedUser || !challengedUser.isOnline || challengedUser.isInGame || challenges[username]){
        console.log('user is unavailable', challengedUser, !challengedUser || !challengedUser.isOnline || challengedUser.isInGame || challenges[username]);
        callback('User is unavailable');
        return;
      }
      socket.user.challenge = {username, timeLimit, maxRounds, row1, row2};

      challenges[username] = {username: socket.user.username, timeLimit, maxRounds, row1, row2};
      console.log('send challenge', challengedUser);
      const opponentSocketId = challengedUser.socketId;
      socket.to(opponentSocketId).emit('challenge', challenges[username]);      
    });

    socket.on('cancel-challenge', () => {
      const challenger = users[challenges[socket.user.username].username];
      // TODO: error handling
      socket.to(challenger.socketId).emit('cancel-challenge');
    })

    socket.on('accept-challenge', () => {
      // starts new game
      // TODO: error handling
      const challenge = challenges[socket.user.username];
      const opponent = users[challenge.username];
      const gameId = uuid.v4();
      const game = new ChessGame();
      game.newGame(challenge.row2, challenge.row1, challenge.maxRounds);
      games[gameId] = {whitePlayer: opponent, blackPlayer: socket.user, game, timeLimit: challenge.timeLimit, hasEnded: false};

      socket.user.gameId = gameId;
      opponent.gameId = gameId;
      const state = {whitePlayer: opponent.username, blackPlayer: socket.user.username, timeLimit: challenge.timeLimit, state: game.state}
      socket.emit('set-state', state);
      socket.to(opponent.socketId).emit('set-state', state);

      socket.join(gameId);
      io.sockets[opponent.socketId].join(gameId);

      let startTime = new Date(); 
      let round = game.state.round;
      let activePlayer = game.state.activePlayer;
      let interval;

      challenge.timeLimit = 2; // Todo: remove this test value

      interval = setInterval(() => {
        if(games[gameId].game.state.winner){
          console.log('clear interval');
          clearInterval(interval);
        }
        if(round !== game.state.round || activePlayer !== game.state.activePlayer){
          startTime = new Date();
          round = game.state.round;
          activePlayer = game.state.activePlayer; 
          io.to(gameId).emit('timer', challenge.timeLimit);
          return;
        }
        let timeSpent = Math.floor((new Date() - startTime) / 1000);
        if(timeSpent > challenge.timeLimit){
          // TODO: random move
          const move = game.makeRandomMove();
          move.timeout = true;
          io.to(gameId).emit('game-action', move);
          console.log('time limit exceeded, random move', move);
        }else{
          io.to(gameId).emit('timer', challenge.timeLimit - timeSpent);
        }

      }, 1000);
      
    });
    
    socket.on('deny-challenge', () => {
      
    });
    
    socket.on('game-action', ({xStart, xEnd, yStart, yEnd}, callback) => {
      const gameId = socket.user.gameId;
      try{
        const gameData = games[gameId]
        const move = gameData.game.makeMove({xStart, xEnd, yStart, yEnd});
        io.to(gameId).emit('game-action', move);
        callback();
      } catch(e) {
        console.log('game-action error');
        callback(e)
      }
    });
    
    socket.on('get-state', function(){
      socket.emit('set-users', getLobbyUsers)
    });

    socket.on('disconnect', () => {
      const username = socket.user.username;
      console.log('disconnect', socket.user);
      socket.user.isOnline = false;
      socket.broadcast.emit('user-removed', socket.user.username);
      if(challenges[username]){
        delete challenges[socket.user.username];
        // TODO: cancel challenge
      }
      setTimeout(() => {
        if(socket.user && !socket.user.isOnline){
          delete users[socket.user.id];
          delete sessions[socket.sessionId];
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

module.exports = chessWebsocket;