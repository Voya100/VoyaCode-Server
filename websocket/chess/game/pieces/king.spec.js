const { testMoveTiles, setBoard, compareMoves } = require('../test-helpers');
const ChessGame = require('../chess-game');

const game = new ChessGame();

describe('#King', function(){

  describe('moveTiles', function(){

    it('should work in center of the board', function(){
      testMoveTiles(4,3,[
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'X' ,'X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'WX','X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'X' ,'X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ' ]
      ]);
    });

    it('should work on corner of the board', function(){
      testMoveTiles(7,0,[
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'X' ,'WX'],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'X' ,'X' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' '  ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ]);
    });
    
    it('should work on edge of the board', function(){
      testMoveTiles(7,3,[
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' '  ,' ',' ' ,'X' ,'X' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'X' ,'WX' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'X' ,'X' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ']
      ]);
    });

    it('should not include friendly tiles', function(){
      testMoveTiles(4,3,[
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'X' ,'WP',' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'WX','WP',' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'X' ,'WP',' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ]);
    });
    
    it('should include enemy tiles', function(){
      testMoveTiles(4,3,[
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'X' ,'BP',' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'WX','BP',' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'X' ,'BP',' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ],[
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'X' ,'X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'WX','X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'X' ,'X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ]);
    });
  });

  describe('castling', function(){

    let blackKing, blackRook1, blackRook2;
    let whiteKing, whiteRook1, whiteRook2;

    beforeEach(function(){
      setBoard(game, [
        ['BR',' ' ,' ' ,' ' ,'BX',' ' ,' ' ,'BR'],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        ['WR',' ' ,' ' ,' ' ,'WX',' ' ,' ' ,'WR']
      ]);
      blackKing = game.getPiece(4,0);
      blackRook1 = game.getPiece(0,0);
      blackRook2 = game.getPiece(7,0);
      whiteKing = game.getPiece(4,7);
      whiteRook1 = game.getPiece(0,7);
      whiteRook2 = game.getPiece(7,7);
    });

    it('should be included in move tiles (black)', function(){
      compareMoves(4,0, game, [
        ['BR',' ' ,'X' ,'X' ,'BX','X' ,'X' ,'BR'],
        [' ' ,'  ',' ' ,'X' ,'X' ,'X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        ['WR',' ' ,' ' ,' ' ,'WX',' ' ,' ' ,'WR']
      ]);
    });

    it('should be included in move tiles (white)', function(){
      compareMoves(4,7, game, [
        ['BR',' ' ,' ' ,' ' ,'BX',' ' ,' ' ,'BR'],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'X' ,'X' ,'  ',' ' ],
        ['WR',' ' ,'X' ,'X' ,'WX','X' ,'X' ,'WR']
      ]);
    });

    it('should move king and rook correctly (left black)', function(){
      game.changeTurn();
      game.makeMove({xStart: blackKing.x, yStart: blackKing.y, xEnd: 2, yEnd: 0});
      expect(blackKing.x).to.equal(2);
      expect(blackKing.y).to.equal(0);
      expect(blackRook1.x).to.equal(3);
      expect(blackRook1.y).to.equal(0);
    });
    
    it('should move king and rook correctly (right black)', function(){
      game.changeTurn();
      game.makeMove({xStart: blackKing.x, yStart: blackKing.y, xEnd: 6, yEnd: 0});
      expect(blackKing.x).to.equal(6);
      expect(blackKing.y).to.equal(0);
      expect(blackRook2.x).to.equal(5);
      expect(blackRook2.y).to.equal(0);
    });
    
    it('should move king and rook correctly (left white)', function(){
      game.makeMove({xStart: whiteKing.x, yStart: whiteKing.y, xEnd: 2, yEnd: 7});
      expect(whiteKing.x).to.equal(2);
      expect(whiteKing.y).to.equal(7);
      expect(whiteRook1.x).to.equal(3);
      expect(whiteRook1.y).to.equal(7);
    });
    
    it('should move king and rook correctly (right white)', function(){
      game.makeMove({xStart: whiteKing.x, yStart: whiteKing.y, xEnd: 6, yEnd: 7});
      expect(whiteKing.x).to.equal(6);
      expect(whiteKing.y).to.equal(7);
      expect(whiteRook2.x).to.equal(5);
      expect(whiteRook2.y).to.equal(7);
    });

    it('shoud not work when king is in check', function(){
      testMoveTiles(4, 0, [
        ['BR',' ' ,' ' ,'X' ,'BX','X' ,' ' ,'BR'],
        [' ' ,'  ',' ' ,'X' ,'X' ,'X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,'WR',' ' ,' ' ,' ' ]
      ]);
    });

    it('should not work when tiles between king and rook would be in check', function(){
      testMoveTiles(4, 0, [
        ['BR',' ' ,'X' ,'X' ,'BX','X' ,' ' ,'BR'],
        [' ' ,'  ',' ' ,'X' ,'X' ,'X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'WR',' ' ]
      ]);
    });
    
    it('should not work when there is a friendly piece between the king and the rook', function(){
      testMoveTiles(4, 0, [
        ['BR',' ' ,' ' ,'BQ','BX','BQ',' ' ,'BR'],
        [' ' ,'  ',' ' ,'X' ,'X' ,'X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ]);
    });
    
    it('should not work if there is a friendly piece where the king should go', function(){
      testMoveTiles(4, 0, [
        ['BR',' ' ,'BP','X' ,'BX','X' ,'BP','BR'],
        [' ' ,'  ',' ' ,'X' ,'X' ,'X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ]);
    });
    
  });
});

