const _ = require('lodash');
const Tile = require('./tile');
const Player = require('./player');

const Bishop= require('./pieces/bishop');
const King= require('./pieces/king');
const Knight= require('./pieces/knight');
const Pawn= require('./pieces/pawn');
const Queen= require('./pieces/queen');
const Rook= require('./pieces/rook');

const pieceTypes = {
  "bishop": Bishop,
  "king": King,
  "knight": Knight,
  "pawn": Pawn,
  "queen": Queen,
  "rook": Rook
}

const minPieceTypes = {
  "B": "bishop",
  "X": "king",
  "K": "knight",
  "P": "pawn",
  "Q": "queen",
  "R": "rook"
}

class ChessGame {
  constructor(){
    this.board = [];
    this.pieces = {};
    this.state = {};
    this.whitePlayer = null;
    this.blackPlayer = null;
    this.idCounter = 0;
  }

  newGame(row6, row7, roundLimit){
    this.idCounter = 0;

    const state = {
      pieces: {},
      latestMove: null,
      round: 1,
      activePlayer: 'white',
      kingCount: 0,
      roundLimit
    }

    row6 = row6.split('').map((type) => minPieceTypes[type]);
    row7 = row7.split('').map((type) => minPieceTypes[type]);

    state.kingCount = row6.reduce((prev, type) => type === 'king' ? prev+1 : prev, 0);
    state.kingCount += row7.reduce((prev, type) => type === 'king' ? prev+1 : prev, 0);

    for(let i = 0; i < 8; i++){
      const row6Type = row6[i];
      const row7Type = row7[i];
      if(row7Type !== undefined){
        state.pieces[this.idCounter++] = {id: this.idCounter, type: row7Type, x: i, y: 7, owner: 'white'}
        state.pieces[this.idCounter++] = {id: this.idCounter, type: row7Type, x: i, y: 0, owner: 'black'}
      }
      if(row6Type !== undefined){
        state.pieces[this.idCounter++] = {id: this.idCounter, type: row6Type, x: i, y: 6, owner: 'white'}
        state.pieces[this.idCounter++] = {id: this.idCounter, type: row6Type, x: i, y: 1, owner: 'black'}
      }
    }
    this.setState(state);
  }

  setState(state){
    this.state = state;
    this.pieces = {};
    this.board = this.initBoard();
    this.whitePlayer = new Player('white');
    this.blackPlayer = new Player('black');

    for(let id in state.pieces){
      this.createPiece(state.pieces[id]);
    }
  }

  initBoard(){
    return _.times(8, (j) => _.times(8, (i) => new Tile(i,j, this)));
  }

  createPiece(pieceState){
    const type = pieceState.type;
    const PieceClass = pieceTypes[type];
    if(PieceClass == undefined){
      throw new Error('Invalid piece type: ' + type);
    }
    const piece = new PieceClass(pieceState, this);
    this.pieces[pieceState.id] = piece;
    this.board[pieceState.y][pieceState.x].setPiece(piece);
    this[piece.color + 'Player'].addPiece(piece);
  }

  makeMove({id, x, y}){
    if(this.pieces[id].color !== this.state.activePlayer){
      throw new Error('It isn\'t your turn yet.');
    }
    this.movePiece(id, x, y);
    this.checkWinningCondition
  }

  movePiece(id, x, y){
    const piece = this.pieces[id];
    const target = this.board[y][x];
    if(!piece.canMove(target)){
      throw new Error('Invalid move');
    }
    piece.move(target);
  }

  removePiece(id){
    const piece = this.pieces[id];
    this.state.pieces[id] = undefined;
    const player = piece.isWhite ? this.whitePlayer : this.blackPlayer;
    player.removePiece(piece);
  }

  doTileChecks(){
    this.clearTiles();
    this.whitePlayer.checkMoveTiles();
    this.blackPlayer.checkMoveTiles();
    // Looks all possible castling moves
    this.whitePlayer.checkCastlingMoves();
    this.blackPlayer.checkCastlingMoves();
  }

  clearTiles(){
    this.board.forEach((row) => row.forEach((tile) => tile.clear()));
  }

  checkWinner(){
    // TODO
    return null;
  }

  isInCheck(){
    // TODO
    return false;
  }

}

module.exports = ChessGame;