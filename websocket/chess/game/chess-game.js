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
  bishop: Bishop,
  king: King,
  knight: Knight,
  pawn: Pawn,
  queen: Queen,
  rook: Rook
}

const minPieceTypes = {
  B: "bishop",
  X: "king",
  K: "knight",
  P: "pawn",
  Q: "queen",
  R: "rook"
}

class ChessGame {
  constructor(){
    this.board = [];
    this.pieces = {};
    this.state = {};
    this.whitePlayer = null;
    this.blackPlayer = null;
    this.idCounter = 0;
    this.latestMove = null;
  }

  get activePlayer(){ return this.state.activePlayer === 'white' ? this.whitePlayer : this.blackPlayer }
  get kingCount(){ return this.state.kingCount }

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
      if(row7Type){
        state.pieces[++this.idCounter] = {id: this.idCounter, type: row7Type, x: i, y: 7, owner: 'white'}
        state.pieces[++this.idCounter] = {id: this.idCounter, type: row7Type, x: i, y: 0, owner: 'black'}
      }
      if(row6Type){
        state.pieces[++this.idCounter] = {id: this.idCounter, type: row6Type, x: i, y: 6, owner: 'white'}
        state.pieces[++this.idCounter] = {id: this.idCounter, type: row6Type, x: i, y: 1, owner: 'black'}
      }
    }
    this.setState(state);
  }

  setState(state){
    this.state = state;
    this.whitePlayer = new Player('white');
    this.blackPlayer = new Player('black');
    this.pieces = {};
    this.fillBoard();
    this.addPieces();
    this.doTileChecks();
  }

  fillBoard(){
    this.board = _.times(8, (j) => _.times(8, (i) => new Tile(i,j, this)));
  }

  addPieces(){
    const state = this.state;
    for(let id in state.pieces){
      if (state.pieces.hasOwnProperty(id)) {
        this.addPiece(state.pieces[id]);
      }
    }
  }

  addPiece(pieceState){
    if(pieceState.id === undefined){
      pieceState.id = this.idCounter++;
    }
    const type = pieceState.type;
    const PieceClass = pieceTypes[type];
    if(PieceClass === undefined){
      throw new Error('Invalid piece type: ' + type);
    }
    const piece = new PieceClass(pieceState, this);
    this.pieces[pieceState.id] = piece;
    this.board[pieceState.y][pieceState.x].setPiece(piece);
    this[piece.color + 'Player'].addPiece(piece);
  }

  makeMove({xStart, xEnd, yStart, yEnd}){
    const piece = this.board[yStart][xStart].piece;
    const target = this.board[yEnd][xEnd];
    // TODO: Error handling
    if(piece == null){
      console.log('error: piece == null', xStart, yStart, xEnd, yEnd, this.state);
    }
    if(piece.color !== this.state.activePlayer){
      console.log('error: not your turn', xStart, yStart, xEnd, yEnd, piece.color, piece.state, this.state);
      throw new Error('not-your-turn');
    }

    const move = {xStart, yStart, xEnd, yEnd, pieceType: piece.type, target: target.piece && target.piece.type};

    this.movePiece(piece, target);
    this.latestMove = move;

    this.changeTurn();
    this.checkIfGameHasEnded();

    return move;
  }

  makeRandomMove(){
    try{
      const {piece, tile} = _.sample(this.activePlayer.legalMoves);
      console.log('random: active', this.state.activePlayer, piece.state, tile.x, tile.y)
      return this.makeMove({xStart: piece.x, xEnd: tile.x, yStart: piece.y, yEnd: tile.y});
    }catch(e){
      console.log('error');
      console.log('random: active', this.state.activePlayer)
      console.log('state', this.state);
      console.log('legal moves', this.activePlayer.legalMoves);
      throw e;
    }
  }

  movePiece(piece, target){
    if(!piece.canMove(target)){
      throw new Error('invalid-move');
    }
    piece.move(target.x, target.y);
  }

  resign(){
    this.state.winner = this.activePlayer === 'white' ? 'black' : 'white';
  }

  changeTurn(){
    this.state.activePlayer = this.state.activePlayer === 'white' ? 'black' : 'white';
    console.log('change turn', this.state.activePlayer)
    if(this.state.activePlayer === 'white'){
      this.state.round++;
    }
    this.doTileChecks();
  }

  getPiece(x, y){
    return this.board[y][x].piece;
  }

  removePiece(id){
    const piece = this.pieces[id];
    console.log('remove piece', id, piece.state);
    this.state.pieces[id] = undefined;
    this.pieces[id] = undefined;
    const player = piece.isWhite() ? this.whitePlayer : this.blackPlayer;
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

  checkIfGameHasEnded(){
    if(this.state.round > this.state.roundLimit){
      this.state.winner = 'tie';
    }else if(this.activePlayer.legalMoves.length === 0){
      if(this.activePlayer.isInCheckMate()){
        this.state.winner = this.activePlayer === 'white' ? 'black' : 'white';
      }else{
        this.state.winner = 'tie';
      }
    }else if(this.kingCount && this.activePlayer.kingCount === 0){
      this.state.winner = this.activePlayer === 'white' ? 'black' : 'white';
    }
    console.log('winner', this.state.winner)
  }

  getLatestMove(){
    return this.latestMove;
  }

}

module.exports = ChessGame;