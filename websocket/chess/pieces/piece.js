const _ = require('lodash');

const oppositeColor = {
  'white': 'black',
  'black': 'white'
}

// Abstract class
class Piece{

  constructor(type, state, game){
    this.id = state.id;
    this.state = state;
    this.game = game;
    this.moveTiles = []; 
    this.hitTiles = []; 
    this.protectsKing = false;
    this.dead = false;
    this.type = type;
  }

  get color(){ return this.state.owner }
  get x(){ return this.state.x }
  get y(){ return this.state.y }
  get board(){ return this.game.board }
  get tile(){ return this.board[this.y][this.x] }
  set tile(tile){ this.state.x = tile.x; this.state.y = tile.y; }
  
  protectsPiece(piece){ return this.tile.protectsTile(piece.tile) }

  isWhite(){ return this.color === 'white' }

  // Abstract method
  // Adds move and hit tiles (determines which tiles the piece can move to)
  tileCheck(){}

  // Returns friendlies which can move to the tile after death	
  friends(){return this.tile[this.color + "Hits"]}
  // Returns enemies that can hit the next turn
  threats(){return this.tile[oppositeColor[this.color] + "Hits"]}
    
  move(x, y){
    this.tile.piece = null;
    this.tile = this.game.board[y][x];
    if(!this.tile.isEmpty){
      this.tile.piece.die();
    }
    this.tile.setPiece(this);
  }

  canMove(tile){return this.moveTiles.indexOf(tile) !== -1;}
  
  //Checks all 4 directions
  checkDirections(x_add, y_add, count){
    let moveTiles = [];
    moveTiles = moveTiles.concat(this.checkDirection(x_add,y_add,count));
    if(x_add !== 0){
      moveTiles = moveTiles.concat(this.checkDirection(-x_add,y_add,count));
    }
    if(y_add !== 0){
      moveTiles = moveTiles.concat(this.checkDirection(x_add,-y_add,count));
    }
    if(x_add !== 0 && y_add != 0){
      moveTiles = moveTiles.concat(this.checkDirection(-x_add,-y_add,count));
    }
    return moveTiles;
  }

  // Adds tiles in 1 direction to hit/move tiles until an obstacle comes along
  checkDirection(x_add, y_add, count){
    let moveTiles = this.tile.checkDirection(x_add,y_add,count);

    for(let target of moveTiles){
      this.hitTiles.push(target);
      target.addHitter(this);
      if(target.isFriendOf(this)){
        moveTiles = _.without(moveTiles,target);
      }
    }
    return moveTiles;
  }

  // Removes information of piece's current possible move locations from player/tiles. Done before checking them again.
  clearTiles(){
    this.moveTiles = [];
    this.hitTiles = [];
  }

  // Adds piece's possible move locations to player and tiles
  addTiles(){
    for(let tile of this.moveTiles){
      tile.addMover(this);
    }
  }

  die(){
    this.tile.removePiece();
    this.game.removePiece(this.id);
  }
}

module.exports = Piece;
