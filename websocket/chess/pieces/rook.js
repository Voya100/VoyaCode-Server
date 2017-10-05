const Piece= require('./piece');

module.exports = class Rook extends Piece{

  constructor(state, game){
    super("rook", state, game);
    state.hasMoved = false;
  }

  get hasMoved(){ return this.state.hasMoved }
  set hasMoved(hasMoved){ this.state.hasMoved = hasMoved }

  move(x, y, changeTurn = true){
    super.move(x, y, changeTurn);
    this.hasMoved = true;
  }

  tileCheck(){
    this.clearTiles();
    this.moveTiles = this.moveTiles.concat(this.checkDirections(1,0,8,true));
    this.moveTiles = this.moveTiles.concat(this.checkDirections(0,1,8,true));
    this.addTiles();
  }
}
