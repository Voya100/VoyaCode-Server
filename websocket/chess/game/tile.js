
class Tile {
  
  static tileExists(x, y){
    return 0 <= y && y < 8 && 0 <= x && x < 8;
  }

  constructor(x, y, game){
    this.x = x;
    this.y = y;
    this.game = game;
    this.piece = null;
    this.whites = [];
    this.whiteHits = [];
    this.blacks = [];
    this.blackHits = [];
  }

  get board(){ return this.game.board }
  
  isEmpty(){ return this.piece === null }

  getThreats(color){
    return color === 'white' ? this.blacks : this.whites;
  }

  getFriends(color){
    return color === 'white' ? this.whites : this.blacks;
  }

  getThreatHits(color){
    return color === 'white' ? this.blackHits : this.whiteHits;
  }

  getFriendHits(color){
    return color === 'white' ? this.whiteHits : this.blackHits;
  }

  isFriendOf(pieceOrPlayer){
    return this.piece && this.piece.color === pieceOrPlayer.color;
  }

  isEnemyOf(pieceOrPlayer){
    return this.piece && this.piece.color !== pieceOrPlayer.color;
  }

  setPiece(piece){
    this.piece = piece;
  }

  removePiece(){
    this.piece = null;
  }

  // Adds a piece that can move to this tile
  addMover(piece){
    if(piece.isWhite()){
      this.whites.push(piece);
    }else{
      this.blacks.push(piece);
    }
  }
  // Adds a piece that could hit this tile (if there is an enemy)
  addHitter(piece){
    if(piece.isWhite()){
      this.whiteHits.push(piece);
    }else{
      this.blackHits.push(piece);
    }
  }
  
  clear(){
    this.whites = [];
    this.whiteHits = [];
    this.blacks = [];
    this.blackHits = [];
  }
  // Returns tiles between the two tiles
  tilesBetween(tile){
    let x_add = 0, y_add = 0;
    // Checks that they are on same column/row or diagonal
    if(this.x !== tile.x && this.y !== tile.y && Math.abs(this.x-tile.x) !== Math.abs(this.y-tile.y)){
      return [];
    }
    if(this.x !== tile.x){
      x_add = this.x < tile.x ? 1 : -1;
    }
    if(this.y !== tile.y){
      y_add = this.y < tile.y ? 1 : -1;
    }
    let tiles = [];
    for(let x = this.x+x_add, y = this.y+y_add; y !== tile.y || x !== tile.x; x += x_add, y += y_add){
      tiles.push(this.game.board[y][x]);
    }
    return tiles;	
  }
  
  // Checks if tile is between 2 tiles
  isBetween(targetTile, enemyTile){
    const tilesBetween = targetTile.tilesBetween(enemyTile);
    return tilesBetween && tilesBetween.indexOf(this) !== -1;
  }

  //Checks all 4 directions
  checkDirections(x_add, y_add, count){
    let tiles = [];
    tiles = tiles.concat(this.checkDirection(x_add,y_add,count));
    if(x_add !== 0){
      tiles = tiles.concat(this.checkDirection(-x_add,y_add,count));
    }
    if(y_add !== 0){
      tiles = tiles.concat(this.checkDirection(x_add,-y_add,count));
    }
    if(x_add !== 0 && y_add !== 0){
      tiles = tiles.concat(this.checkDirection(-x_add,-y_add,count));
    }
    return tiles;
  }
  
  // Returns tiles in specific direction, until it meets an obstacle (end of board or piece)
  checkDirection(x_add, y_add, count){
    if(count !== 1){
      count = 8;
    }
    let tiles = [];
    let x = this.x;
    let y = this.y;
    for(let i = 1; i < count+1; i++){
      if(x + x_add*i < 8 && x + x_add*i >= 0 && y + y_add*i < 8 && y + y_add*i >= 0){
        let tile = this.board[y + y_add*i][x + x_add*i];
        tiles.push(tile);
        if(!tile.isEmpty()){
          break;
        }
      }
    }
    return tiles;
  }
  
  // Tells if piece on this tile is preventing enemy from going to target tile
  protectsTile(targetTile, pieceOrPlayer){
    // Doesn't protect if there are pieces between this and the tile
    const tilesBetween = this.tilesBetween(targetTile);
    if(tilesBetween.filter((tile) => !tile.isEmpty()).length > 0){
      return false;
    }
    
    let xDir = this.x < targetTile.x ? -1 : 1;
    let yDir = this.y < targetTile.y ? -1 : 1;
    
    if(this.x == targetTile.x){ // They are on same column, threats: rook and queen
      for(let y = this.y+yDir; 0 <= y && y < 8; y += yDir){
        let tile = this.game.board[y][this.x];
        if(tile.isEnemyOf(pieceOrPlayer) && (tile.piece.type === 'rook' || tile.piece.type === 'queen')){
          return true;
        }else if(!tile.isEmpty()){
          break;
        }
      }
    }
    if(this.y == targetTile.y){ // They are on same row, threats: rook and queen
      for(let x = this.x+xDir; 0 <= x && x < 8; x += xDir){
        let tile = this.game.board[this.y][x];
        if(tile.isEnemyOf(pieceOrPlayer) && (tile.piece.type === 'rook' || tile.piece.type === 'queen')){
          return true;
        }else if(!tile.isEmpty()){
          break;
        }
      }
    }
    if(Math.abs(this.y-targetTile.y) == Math.abs(this.x-targetTile.x)){ // They are diagonal, threats: bishop and queen
      for(let x = this.x+xDir, y = this.y+yDir;0 <= x && x < 8 && 0 <= y && y < 8; x+= xDir, y+= yDir){
        let tile = this.game.board[y][x];
        if(tile.isEnemyOf(pieceOrPlayer)  && (tile.piece.type === 'bishop' || tile.piece.type === 'queen')){
          return true;
        }else if(!tile.isEmpty()){
          break;
        }
      }
    }
    return false;
  }
}

module.exports = Tile;