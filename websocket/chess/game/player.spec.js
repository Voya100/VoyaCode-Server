const ChessGame = require('./chess-game');

const { setBoard } = require('./test-helpers');

const game = new ChessGame();

describe('#Player', function(){

  describe('isInCheck()', function(){

    it('should be in check when king is threatened', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,'BR',' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,'WX',' ' ,' ' ,' ' ]
      ])
      const player = game.whitePlayer;
      expect(player.isInCheck()).to.be.true;
    });

    it('should not be in check when king is not threatened', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,'BP',' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,'WX',' ' ,' ' ,' ' ]
      ])
      const player = game.whitePlayer;
      expect(player.isInCheck()).to.be.false;
    });

  });

  
  describe('isInCheckMate()', function(){
    
    it('should not be in check mate when king can still escape', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,'BR',' ' ,' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,'WX',' ' ,' ' ,' ' ]
      ])
      const player = game.whitePlayer;
      expect(player.isInCheckMate()).to.be.false;
    });

    it('should be in check mate when king can not escape', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,'BR','BR','BR',' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,'WX',' ' ,' ' ,' ' ]
      ])
      const player = game.whitePlayer;
      expect(player.isInCheckMate()).to.be.true;
    });
    
    it('should not be in check mate when threat can be blocked', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,'BR','BR','BR',' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,'WB','WX',' ' ,' ' ,' ' ]
      ])
      const player = game.whitePlayer;
      expect(player.isInCheckMate()).to.be.false;
    });

    
    it('should not be in check mate when threat can be eliminated', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,'BR','BR','BR',' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,'WB' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,'WX',' ' ,' ' ,' ' ]
      ])
      const player = game.whitePlayer;
      expect(player.isInCheckMate()).to.be.false;
    });
    
    it('should not be in check mate when threat can be eliminated by pieces next to the threat', function(){
      setBoard(game, [
        ['BR',' ' ,'BB','BQ','BX','BB','BK','BR'],
        [' ' ,'BP','BP','WQ','BP','BP','BP','BP'],
        ['BP','  ','  ','BP','  ','  ','  ','  '],
        ['  ','  ','WP','  ','  ','  ','  ','  '],
        ['  ','  ','  ','  ','  ','  ','  ','  '],
        ['  ','  ','  ','  ','  ','  ','  ','  '],
        ['WP',' ' ,'WP','WP','WP','WP','WP','WP'],
        ['WR','WK',' ' ,'WQ','WX','WB','WK','WR']
      ])
      const player = game.blackPlayer;
      expect(player.isInCheckMate()).to.be.false;
    });
    
    
    it('should be in check mate when threat can be blocked, but elimination would leave king vulnerable', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,'BR','BR','BR',' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,'BR','WB','WX',' ' ,' ' ,' ' ]
      ])
      const player = game.whitePlayer;
      expect(player.isInCheckMate()).to.be.true;
    });
    
    it('should be in check mate when threat can be eliminated, but elimination would leave king vulnerable', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,'BR',' ','BR',' ' ,' ' ],
        [' ' ,'  ',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,'BR' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        ['BR','WR',' ' ,' ' ,'WX',' ' ,' ' ,' ' ]
      ])
      const player = game.whitePlayer;
      expect(player.isInCheckMate()).to.be.true;
    });

    it('should be in check mate when king can eliminate threat, but would end up vulnerable again', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,'WQ',' ' ,'BX',' ' ,'BR'],
        [' ' ,' ' ,' ' ,' ' ,'WR',' ' ,' ' ,' ' ],
        ['WP',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        ['WK',' ' ,' ' ,' ' ,' ' ,' ' ,'WP',' ' ],
        [' ' ,'WP',' ' ,' ' ,' ' ,'WP',' ' ,'BQ'],
        [' ' ,'WX',' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ])
      const player = game.blackPlayer;
      expect(player.isInCheckMate()).to.be.true;
    });
  });
  
  describe('legal moves', function(){
    it('should not have legal moves in stalemate where king needs to move', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ',' ' ,'WX' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,'BX','BQ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ])
      const player = game.whitePlayer;
      expect(player.legalMoves.length).to.equal(0);
    });
  
    it('should not have legal moves in stalemate where piece protecting the king needs to move', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,'BQ',' ' ,'WP','WX'],
        [' ' ,' ' ,' ' ,' ' ,'BQ',' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ])
      const player = game.whitePlayer;
      expect(player.legalMoves.length).to.equal(0);
    });
    
    it('should have legal moves when piece can move towards potential threat', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'BX',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'BP',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,'WR','WR','WR'],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ])
      const player = game.blackPlayer;
      expect(player.legalMoves.length).to.equal(2);
    });
    
    it('should have legal moves when piece can move away from potential threat', function(){
      setBoard(game, [
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'BX' ,' '],
        [' ' ,' ' ,' ' ,' ' ,'WR' ,' ' ,' ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'BR',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,'WR','WR','WR'],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,'  ',' ' ],
        [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ]
      ])
      const player = game.blackPlayer;
      expect(player.legalMoves.length).to.equal(3);
    });
  });

});