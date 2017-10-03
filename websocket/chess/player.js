const _ = require('lodash');

const oppositeColor = (color) => color === 'white' ? 'black' : 'white';

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

  get isInCheck(){
    if(this.kingCount !== 0){
      return false;
    }

    const king = this.kings[0];
    return king.threats().length;
  }

  get isInCheckMate(){
    return this.isInCheck() && this.safeKingMoves(this.kings[0]).length === 0;
  }

  get possibleMoves(){
    if(!this.isInCheck){
      return this.allMoves;
    }else{
      return this.saveKingMoves(this.kings[0]);
    }

  }

  get allMoves(){
    const moves = [];
    // Note: Moves may not be safe for the king
    this.pieces.forEach((piece) => {
      piece.moveTiles((tile) => {
        moves.push({piece, tile});
      });
    });
    return moves;
  }

  safeKingMoves(king){
    const threats = king.threats();
    const kingTiles = king.moveTiles.filter((tile) => {
      return tile[oppositeColor(this.color)+'Hits'].length === 0 && _.every(threats, (threat) => {
        return !king.tile.isBetween(tile, threat.tile);
      });
    });

    const kingDodgeMoves = kingTiles.map((tile) => ({piece: king, tile}));
    if(threats.length > 1){return kingDodgeMoves; }

    const threat = threats[0];
    const threatKillMoves = this.threatKillMoves(threat, king);
    const threatBlockMoves = this.threatBlockMoves(threat, king);

    return [...kingDodgeMoves, ...threatKillMoves, ...threatBlockMoves];
  }

  // Moves that can be used to kill threat, without leaving the king vulnerable
  threatKillMoves(threat, king){
    const movePieces = threat.threats().filter((piece) => !piece.protectsPiece(king) || piece.tile.isBetween(king.tile, threat.tile));
    return movePieces.map((piece) => {piece, threat.tile});
  }

  // Moves that can be used to block a threat, without leaving king vulnerable
  threatBlockMoves(threat, king){
    // Knights can't be blocked
    if(threat.type === 'knight'){return [];}

    const moves = [];
    const tilesBetween = king.tile.tilesBetween(threat.tile);

    for(let tile of tilesBetween){
      const pieces = tile[this.colors].filter((piece) => {
        return !piece.protectsKing && piece !== king;
      });
      for(let piece of pieces){
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