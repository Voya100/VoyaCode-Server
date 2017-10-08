module.exports = {
  getBoardLayout,
  setBoard,
  testMoveTiles,
  compareMoves
}

const ChessGame = require('./chess-game');


const pieceTypes = {
  "B": "bishop",
  "X": "king",
  "K": "knight",
  "P": "pawn",
  "Q": "queen",
  "R": "rook"
}

function setBoard(game, board){
  const state = {
    pieces: {},
    latestMove: null,
    round: 1,
    activePlayer: 'white',
    kingCount: 1,
    roundLimit: 100
  }

  let id = 0;
  board.forEach((row, y) => 
    row.forEach((piece, x) => {
      if(piece !== '  ' && piece.length === 2){
        const type = pieceTypes[piece[1]];
        const owner = piece[0] === 'W' ? 'white' : 'black';
        state.pieces[id] = {id, type, owner, x, y}
        id++;
      }
    })
  );

  game.setState(state);
}

function getBoardLayout(game){
  return game.board.map((row) => 
    row.map((tile) => {
      if(tile.isEmpty()){ return '  '; }
      const type = tile.piece.type === 'king' ? 'X' : tile.piece.type[0];
      return (tile.piece.color[0] + type).toUpperCase();
    })
  );
}

function testMoveTiles(x, y, board, moveTileBoard=board){
  const game = new ChessGame();
  setBoard(game, board);
  game.doTileChecks();
  compareMoves(x, y, game, moveTileBoard);
}

function compareMoves(x,y, game, moveTileBoard){
  const tiles = [];
  moveTileBoard.forEach((row, j) => {
    row.forEach((tile, i) => {
      if(tile === 'X'){
        tiles.push('(x: ' + i + ', y: ' + j + ')');
      }
    })
  });
  const piece = game.getPiece(x,y);
  const moveTiles = piece.moveTiles.map((tile) => '(x: ' + tile.x + ', y: ' + tile.y + ')');

  expect(moveTiles.sort()).to.deep.equal(tiles.sort());
}
