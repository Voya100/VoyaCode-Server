const Piece= require('./piece');

module.exports = class Knight extends Piece{

  constructor(state, game){
    super("knight", state, game);
  }
  
  tileCheck(){
    this.clearTiles();
    this.moveTiles = this.moveTiles.concat(this.checkDirections(2,1,1,true));
    this.moveTiles = this.moveTiles.concat(this.checkDirections(1,2,1,true));
    this.addTiles();
  }
}
