const _ = require('lodash');

class Player {

  constructor(color){
    this.color = color;
    this.pieces = [];
    this.kings = [];
    this.rooks = [];
    this.pawns = [];
    this.queens = [];
    this.knights = [];
    this.bishops = [];
  }

  get kingCount(){
    return this.kings.length;
  }

  isInCheck(){
    if(this.kingCount === 0){
      return false;
    }
    const king = this.kings[0];
    return !!king.threats.length;
  }

  isInCheckMate(){
    return this.isInCheck() && this.safeKingMoves(this.kings[0]).length === 0;
  }

  get legalMoves(){
    if(!this.isInCheck()){
      if(this.kingCount !== 1){
        return this.allMoves;
      }
      const king = this.kings[0];
      return this.allMoves.filter(({piece, tile}) => {
        if(piece === king){
          return !tile.getThreatHits(this.color).length;
        }else if(piece.protectsPiece(king)){
          // Piece is between threat and king
          const xDir = Math.sign(piece.x - king.x);
          const yDir = Math.sign(piece.y - king.y);
          const oppositeTiles = piece.tile.checkDirection(xDir, yDir, 8);
          const threatTile = oppositeTiles[oppositeTiles.length - 1];
          return tile.isBetween(king.tile, threatTile) || tile === threatTile;
        }
      })
    }else{
      return this.safeKingMoves(this.kings[0]);
    }
  }

  get allMoves(){
    const moves = [];
    // Note: Moves may not be safe for the king
    this.pieces.forEach((piece) => {
      piece.moveTiles.forEach((tile) => {
        moves.push({piece, tile});
      });
    });
    return moves;
  }

  safeKingMoves(king){
    const threats = king.threats;

    const dodgeMoves = this.dodgeMoves(king);
    if(threats.length !== 1){return dodgeMoves; }

    const threat = king.threats[0];
    const threatKillMoves = this.threatKillMoves(threat, king);
    const threatBlockMoves = this.threatBlockMoves(threat, king);
    return [...dodgeMoves, ...threatKillMoves, ...threatBlockMoves];
  }
  
  dodgeMoves(piece){
    const threats = piece.threats;
    const safeTiles = piece.moveTiles.filter((tile) => {
      return tile.getThreatHits(this.color).length === 0 && _.every(threats, (threat) => {
        return !piece.tile.isBetween(tile, threat.tile) || tile === threat.tile;
      });
    });
    return safeTiles.map((tile) => ({piece, tile}));
  }

  // Moves that can be used to kill threat, without leaving the king vulnerable
  threatKillMoves(threat, king){
    const movePieces = threat.threats.filter((piece) => {
      const leavesKingVulnerable = !piece.protectsPiece(king) || piece.tile.isBetween(king.tile, threat.tile);
      const risksKing = piece === king && threat.friends.length > 0;
      return !leavesKingVulnerable && !risksKing;
    });
    return movePieces.map((piece) => ({piece, tile: threat.tile}));
  }

  // Moves that can be used to block a threat, without leaving king vulnerable
  threatBlockMoves(threat, pieceToProtect){
    // Knights can't be blocked
    if(threat.type === 'knight'){return []; }

    const moves = [];
    const tilesBetween = pieceToProtect.tile.tilesBetween(threat.tile);

    for(const tile of tilesBetween){
      const pieces = tile.getFriends(this.color).filter((piece) => {
        return !piece.protectsPiece(pieceToProtect) && piece !== pieceToProtect;
      });
      for(const piece of pieces){
        moves.push({piece, tile});
      }
    }
    return moves;
  }

  addPiece(piece){
    this.pieces.push(piece);
    this[piece.type + 's'].push(piece);
  }

  removePiece(piece){
    this.pieces = _.without(this.pieces, piece);
    const types = piece.type + 's';
    this[types] = _.without(this[types], piece);
  }

  checkMoveTiles(){
    this.pieces.forEach((piece) => {
      piece.tileCheck();
    });
  }

  // Looks if player can do castling move. Needs to be called after both players have done checkAllTiles().
  checkCastlingMoves(){
    for(let king of this.kings){
      king.castlingCheck(this.rooks);
    }
  }  

}

module.exports = Player;