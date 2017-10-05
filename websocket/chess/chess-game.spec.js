const ChessGame = require('./chess-game');
const Tile = require('./tile');

const { getBoardLayout } = require('./test-helpers');

describe('#ChessGame', function(){

  let game;

  beforeEach(function(){
    game = new ChessGame();
  });

  describe('setState()', function(){
    it('should set new state', function(){
      const state = {pieces: {}};
      game.setState(state);
      expect(game.state).to.equal(state);
    });

    const state = {
      pieces: {
        0: {id: 0, type: 'pawn', x: 0, y: 1, owner: 'white'},
        1: {id: 1, type: 'rook', x: 1, y: 5, owner: 'white'},
        4: {id: 4, type: 'bishop', x: 2, y: 5, owner: 'black'},
        999: {id: 999, type: 'king', x: 5, y: 6, owner: 'black'}
      }
    }

    it('should set board', function(){
      game.setState(state);
      const board = game.board;

      expect(board).to.have.lengthOf(8);
      expect(board[0]).to.have.lengthOf(8);
      expect(board[7]).to.have.lengthOf(8);
      
      const tile = board[1][0];
      expect(tile).to.be.instanceOf(Tile);
      expect(tile.x).to.equal(0);
      expect(tile.y).to.equal(1);
      expect(tile.piece.type).to.equal('pawn');
    });

    it('should set pieces', function(){
      game.setState(state);
      const pieces = game.pieces;
      expect(pieces[0].type).to.equal('pawn');
      expect(pieces[999].type).to.equal('king');
    });
  });

  describe('newGame()', function(){
    it('should set board correctly in default case', function(){
      game.newGame('PPPPPPPP', 'RKBQXBKR', 100);
      const board = getBoardLayout(game);
      expect(board).to.deep.equal([
        ['BR','BK','BB','BQ','BX','BB','BK','BR'],
        ['BP','BP','BP','BP','BP','BP','BP','BP'],
        ['  ','  ','  ','  ','  ','  ','  ','  '],
        ['  ','  ','  ','  ','  ','  ','  ','  '],
        ['  ','  ','  ','  ','  ','  ','  ','  '],
        ['  ','  ','  ','  ','  ','  ','  ','  '],
        ['WP','WP','WP','WP','WP','WP','WP','WP'],
        ['WR','WK','WB','WQ','WX','WB','WK','WR']
      ]);
    });

    it('should set board correctly with empty spots', function(){
      game.newGame('PP PPPP ', 'R BQXB R', 100);
      const board = getBoardLayout(game);
      expect(board).to.deep.equal([
        ['BR','  ','BB','BQ','BX','BB','  ','BR'],
        ['BP','BP','  ','BP','BP','BP','BP','  '],
        ['  ','  ','  ','  ','  ','  ','  ','  '],
        ['  ','  ','  ','  ','  ','  ','  ','  '],
        ['  ','  ','  ','  ','  ','  ','  ','  '],
        ['  ','  ','  ','  ','  ','  ','  ','  '],
        ['WP','WP','  ','WP','WP','WP','WP','  '],
        ['WR','  ','WB','WQ','WX','WB','  ','WR']
      ]);
    });

    it('should set king counts correctly', function(){
      game.newGame('PPPPPPPP', 'RKBQXBKR', 100);
      expect(game.state.kingCount).to.equal(1);

      game.newGame('PPP  PPP', 'RKB  QKR', 100);
      expect(game.state.kingCount).to.equal(0);
      
      game.newGame('PPPX PPP', 'RKB  QKX', 100);
      expect(game.state.kingCount).to.equal(2);

      game.newGame('XXXXXXXX', 'XXXXXXXX', 100);
      expect(game.state.kingCount).to.equal(16);
    });

    it('should set roundLimit', function(){
      game.newGame('PPPPPPPP', 'RKBQXBKR', 100);
      expect(game.state.roundLimit).to.equal(100);

      game.newGame('PPPPPPPP', 'RKBQXBKR', 5);
      expect(game.state.roundLimit).to.equal(5);
    });

    it('should set initial state', function(){
      game.newGame('PPPPPPPP', 'RKBQXBKR', 100);

      expect(game.state.latestMove).to.equal(null);
      expect(game.state.round).to.equal(1);
      expect(game.state.activePlayer).to.equal('white');
      expect(game.state.round).to.equal(1);
    });

  });

});
