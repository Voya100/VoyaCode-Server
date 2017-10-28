module.exports = class ChessUser{
  constructor(socket, io){
    this.io = io;
    this.username = '';
    this.socket = socket;
    this.game = null;
    this.isOnline = true;
    this.challengesReceived = {};
    this.challengeSent = null;
  }

  setName(username){
    this.username = username;
  }

  setSocket(socket){
    this.socket = socket;
  }

  // For debugging
  getState(){
    return {user: this.username, isOnline: this.isOnline, game: this.game, challengeSent: this.challengeSent, challengesReceived: this.challengesReceived}
  }

  // Cancel's challenge user has sent
  cancelChallenge(){
    const challenge = this.challengeSent;
    if(!challenge){
      return;
    }
    challenge.getOpponent(this).socket.emit('challenge-cancelled', this.username);
    this.challengeSent = null;
  }

  // Declines challenge user has received
  declineChallenge(challengerName){
    const challenge = this.challengesReceived[challengerName];
    if(!challenge){
      return;
    }
    const challenger = challenge.getOpponent(this.user);
    this.challengesReceived[challenger] = null;
    challenger.socket.emit('challenge-declined');
  }

  declineChallenges(){
    for(const challengerName in this.challengesReceived){
      this.declineChallenge(challengerName);
    }
  }
}