const { testMoveTiles, setBoard, compareMoves } = require('../test-helpers');
const ChessGame = require('../chess-game');

const game = new ChessGame();

describe('#Pawn', function(){

  describe('moveTiles', function(){

    it('should have 2 tiles at start', function(){
      testMoveTiles(3,6,[
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X'  ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'WP',' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);
      testMoveTiles(3,1,[
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,'BP',' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' '  ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);
    });

    it('should have 1 tile after moving', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,'BP',' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' '  ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'WP',' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);
      const whitePawn = game.getPiece(3,6);
      const blackPawn = game.getPiece(5,1);

      game.makeMove({xStart: whitePawn.x, yStart: whitePawn.y, xEnd: 3, yEnd: 4});
      game.makeMove({xStart: blackPawn.x, yStart: blackPawn.y, xEnd: 5, yEnd: 3});

      compareMoves(3,4, game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'WP' ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);
      
      compareMoves(5,3, game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,'BP',' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,'X' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);
    });
    
    it('should be able to capture enemy pieces', function(){
      testMoveTiles(3,6, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ', ' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' '  ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,'BB',' ' ,'BB',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'WP',' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ],[
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ', ' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X'  ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,'X' ,'X' ,'X' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'WP',' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);

      testMoveTiles(3,1, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,'BP',' ' ,' ', ' ' ,' ' ],
        [' ' ,' ' ,'WB',' ' ,'WB',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' '  ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ],[
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,'BP',' ' ,' ', ' ' ,' ' ],
        [' ' ,' ' ,'X' ,'X' ,'X' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' '  ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);
    });

    
    it('should not be able to capture friendly pieces', function(){
      testMoveTiles(3,6, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ', ' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X'  ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,'WB','X' ,'WB',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'WP',' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);

      testMoveTiles(3,1, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,'BP',' ' ,' ', ' ' ,' ' ],
        [' ' ,' ' ,'BB','X' ,'BB',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' '  ,' ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);
    });
  });

  describe('en passant', function(){

    it('should work in normal situation', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,'BP',' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'WP',' ' ],
        [' ' ,' ' ,' ' ,' ' ,'BP',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'WP',' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);
      const whitePawnTarget = game.getPiece(3,6);
      const blackPawnTarget = game.getPiece(5,1);
      
      const blackPawn = game.getPiece(4,4);
      const whitePawn = game.getPiece(6,3);

      blackPawn.hasMoved = true;
      whitePawn.hasMoved = true;

      game.makeMove({xStart: whitePawnTarget.x, yStart: whitePawnTarget.y, xEnd: 3, yEnd: 4});
  
      compareMoves(4,4, game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'WP','BP',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'X' ,'X' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);

      game.makeMove({xStart: blackPawn.x, yStart: blackPawn.y, xEnd: 3, yEnd: 5});

      game.changeTurn();

      game.makeMove({xStart: blackPawnTarget.x, yStart: blackPawnTarget.y, xEnd: 5, yEnd: 3});

      compareMoves(6,3, game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,'X' ,'X' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,'BP','WP',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);

      game.makeMove({xStart: whitePawn.x, yStart: whitePawn.y, xEnd: 5, yEnd: 2});

      // Pieces should be eaten
      expect(game.getPiece(3,4)).to.be.null;
      expect(game.getPiece(5,3)).to.be.null;

    });
    
    it('should work on edge of the board', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ',' ' ,' ' ,'BP' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'WP',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ]);
      const whitePawnTarget = game.getPiece(6,6);
      const blackPawn = game.getPiece(7,4);

      blackPawn.hasMoved = true;

      game.makeMove({xStart: whitePawnTarget.x, yStart: whitePawnTarget.y, xEnd: 6, yEnd: 4});
  
      compareMoves(7,4, game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'BP'],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'X' ,'X' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ]);
    });

    it('should not work after a turn has passed since double move', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,'BP',' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'WP',' ' ],
        [' ' ,' ' ,' ' ,' ' ,'BP',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'WP',' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);
      const whitePawnTarget = game.getPiece(3,6);
      const blackPawnTarget = game.getPiece(5,1);
      
      const blackPawn = game.getPiece(4,4);
      const whitePawn = game.getPiece(6,3);

      blackPawn.hasMoved = true;
      whitePawn.hasMoved = true;

      game.makeMove({xStart: whitePawnTarget.x, yStart: whitePawnTarget.y, xEnd: 3, yEnd: 4});

      game.changeTurn();
      game.changeTurn();
  
      compareMoves(4,4, game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,'WP','BP',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,'X' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);

      game.makeMove({xStart: blackPawnTarget.x, yStart: blackPawnTarget.y, xEnd: 5, yEnd: 3});

      game.changeTurn();
      game.changeTurn();

      compareMoves(6,3, game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'X' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,'BP','WP',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ']
      ]);

    });
  });

  describe('promotion', function(){

    it('should promote white and black pawns to queens', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,'WP',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,'BP',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ]);
      const whitePawn = game.getPiece(4,1);
      const blackPawn = game.getPiece(4,6);
  
      game.makeMove({xStart: whitePawn.x, yStart: whitePawn.y, xEnd: 4, yEnd: 0});
      game.makeMove({xStart: blackPawn.x, yStart: blackPawn.y, xEnd: 4, yEnd: 7});

      const whiteQueen = game.getPiece(4, 0);
      const blackQueen = game.getPiece(4, 7);
      expect(whiteQueen.type).to.equal('queen');
      expect(blackQueen.type).to.equal('queen');
    });

  });

});

