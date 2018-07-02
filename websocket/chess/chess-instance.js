const uuid = require('uuid');
const ChessGame = require('./game/chess-game');

module.exports = class ChessInstance{
  constructor({whitePlayer, blackPlayer, timeLimit, roundLimit, row1, row2}, io){
    // Room identifier
    this.id = uuid.v4();
    this.io = io;
    this.whitePlayer = whitePlayer;
    this.blackPlayer = blackPlayer;
    this.timeLimit = timeLimit;
    this.roundLimit = roundLimit;
    this.row1 = row1;
    this.row2 = row2;
  }

  getOpponent(user){
    return user === this.whitePlayer ? this.blackPlayer : this.whitePlayer;
  }

  hasActivePlayers(){
    return this.whitePlayer.isOnline || this.blackPlayer.isOnline;
  }

  newGame(){
    this.game = new ChessGame();
    this.game.newGame(this.row2, this.row1, this.roundLimit);
    this.hasEnded = false;
    
    const state = {whitePlayer: this.whitePlayer.username, blackPlayer: this.blackPlayer.username, timeLimit: this.timeLimit, state: this.game.state}
    this.io.to(this.id).emit('set-state', state);
    this.timer();
  }

  sendChallenge(){
    const challenge = {username: this.whitePlayer.username, timeLimit: this.timeLimit, roundLimit: this.roundLimit, row1: this.row1, row2: this.row2};
    this.blackPlayer.socket.emit('challenge', challenge);
  }

  resign(playerColor){
    this.io.to(this.id).emit('resign', {resigner: playerColor});
    this.endGame();
  }

  endGame(){
    this.hasEnded = true;
    this.clearInterval();
  }

  makeMove({xStart, xEnd, yStart, yEnd}){
    const move = this.game.makeMove({xStart, xEnd, yStart, yEnd});
    this.io.to(this.id).emit('game-action', move);
  }

  timer(){
    let startTime = new Date(); 
    let round = this.game.state.round;
    let activePlayer = this.game.state.activePlayer;
    let game = this.game;
    let io = this.io;

    //this.timeLimit = 2; // Todo: remove this test value

    // Clear possible previous intervals (example: if a new game has been started)
    this.clearInterval();

    this.interval = setInterval(() => {
      if(game.state.winner || this.hasEnded){
        console.log('clear interval');
        this.clearInterval();
        return;
      }
      if(round !== game.state.round || activePlayer !== game.state.activePlayer){
        startTime = new Date();
        round = game.state.round;
        activePlayer = game.state.activePlayer; 
        io.to(this.id).emit('timer', this.timeLimit);
        return;
      }
      let timeSpent = Math.floor((new Date() - startTime) / 1000);
      if(timeSpent > this.timeLimit){
        // TODO: random move
        const move = game.makeRandomMove();
        move.timeout = true;
        io.to(this.id).emit('game-action', move);
        console.log('time limit exceeded, random move', move);
      }else{
        io.to(this.id).emit('timer', this.timeLimit - timeSpent);
      }

    }, 1000);
  }

  clearInterval(){
    if(this.interval){
      clearInterval(this.interval);
    }
  }
}