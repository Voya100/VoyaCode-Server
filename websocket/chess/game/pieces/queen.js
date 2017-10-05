const Piece= require('./piece');

module.exports = class Queen extends Piece{

  constructor(state, game){
    super("queen", state, game);
  }
	
  tileCheck(){
    this.clearTiles();
    this.moveTiles = this.moveTiles.concat(this.checkDirections(1,0,8,true));
    this.moveTiles = this.moveTiles.concat(this.checkDirections(0,1,8,true));
    this.moveTiles = this.moveTiles.concat(this.checkDirections(1,1,7,true));
    this.addTiles();
  }
}
