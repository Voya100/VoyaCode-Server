const Piece = require('./piece');

module.exports = class Bishop extends Piece{

  constructor(state, game){
    super("bishop", state, game);
  }

  // Moves diagonally
  tileCheck(){
    this.clearTiles();
    this.moveTiles = this.moveTiles.concat(this.checkDirections(1,1,8,true));
    console.log('bishop movetiles', this.moveTiles);
    this.addTiles();
  }
}
