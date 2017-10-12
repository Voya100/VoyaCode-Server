const chessWebsocket = require('./chess/chess.controller');

function websocketRouter(io){
  addRoute(io, '/chess', chessWebsocket);
}

// Adds new websocket route
function addRoute(io, name, handler){
  const pathIo = io.of(name);
  handler(pathIo);
}

module.exports = websocketRouter;