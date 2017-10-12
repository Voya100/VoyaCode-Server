const uuid = require('uuid');

let sessions = {}; // sessionId: {username, socketId}
let users = {}; // username: {username, sessionId, gameId, color, isOnline, isInGame}
let games = {}; // gameId: {player1, player2, board, game, timeLimit, hasEnded}

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

    socket.on('join-lobby', ({username}) => {
      console.log('join-lobby');
      socket.sessionId = uuid.v4();
      socket.user = {username, sessionId: socket.sessionId, isOnline: true, isInGame: false}

      users[username] = socket.user;
      sessions[socket.sessionId] = { username, socketId: socket.id };
      console.log('add user', username, socket.sessionId)
      socket.emit('set-session-id', {sessionId: socket.sessionId});
      socket.broadcast.emit('user-added', username);
      socket.emit('set-users', getLobbyUsers());
    });
    
    socket.on('rejoin', ({sessionId}) => {
      if(sessions[sessionId]){
        socket.sessionId = sessionId;
        socket.user = users[sessions[sessionId].username];
        socket.user.isOnline = true;
        socket.emit('set-users', users);
        // TODO: check if player is in a game
      }
    });
    
    socket.on('get-state', function(){
      socket.emit('set-users', getLobbyUsers)
    });

    socket.on('disconnect', () => {
      console.log('disconnect start')
      socket.user.isOnline = false;
      socket.broadcast.emit('user-removed', socket.user.username);
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