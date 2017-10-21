const Piece= require('./piece');
const Tile= require('../tile');

module.exports = class King extends Piece{

  constructor(state, game){
    super("king", state, game);
    state.hasMoved = false;
  }

  get hasMoved(){ return this.state.hasMoved }
  set hasMoved(hasMoved){ this.state.hasMoved = hasMoved }

  move(x, y){
    if(Math.abs(this.x - x) === 2){
      this.castling(x,y);
    }
    super.move(x,y);
    this.hasMoved = true;
  }

  // Moves rook to the correct tile as in castling special move
  // x and y: coordinates the king tries tries to move to
  castling(x, y){
    let targetTile = this.board[y][x];
    let kingDir = x < this.x ? -1 : 1;
    let tilesInRooksDirection = targetTile.checkDirection(kingDir,0,8);
    let rookTile = tilesInRooksDirection[tilesInRooksDirection.length-1];
    if(rookTile.isEmpty() || rookTile.piece.type !== 'rook'){
      throw new Error('Invalid castling call');
    }else{
      rookTile.piece.move(x-kingDir, y);
    }
  }

  tileCheck(){
    this.clearTiles();
    this.moveTiles = this.moveTiles.concat(this.checkDirections(1,0,1,true));
    this.moveTiles = this.moveTiles.concat(this.checkDirections(0,1,1,true));
    this.moveTiles = this.moveTiles.concat(this.checkDirections(1,1,1,true));
    this.addTiles();
  }

  // Adds tiles related to castling. Must be done after all other tileChecks have been done
  castlingCheck(rooks){
    // King must not have moved and must not be in check
    if(this.hasMoved || this.threats.length !== 0){
      return;
    }
    for(let rook of rooks){
      let target = this.castlingTargetTile(rook);
      if(this.canDoCastlingWithRook(rook, target)){
        this.moveTiles.push(target);
        target.addMover(this);
      }
    }
  }

  canDoCastlingWithRook(rook, target){
    if(rook.hasMoved || rook.y !== this.y || target === null){
      return false;
    }
    let tilesBetween = this.tile.tilesBetween(rook.tile);
    let tilesWithPieces = tilesBetween.filter((tile) => !tile.isEmpty());

    let tilesInKingPath = target.tilesBetween(this.tile);
    tilesInKingPath.push(target);
    let dangerTiles = tilesInKingPath.filter((tile) => tile.getThreats(this.color).length !== 0);

    if(tilesWithPieces.length !== 0 || dangerTiles.length !== 0){
      return false;
    }
    return true;
  }

  // Tile to which king will move in castling
  castlingTargetTile(rook){
    let x = this.x + 2*(rook.x < this.x ? -1 : 1);
    if(!Tile.tileExists(x,this.y)){
      return null;
    }else{
      return this.board[this.y][x]
    }
  }

}
