const chai = require('chai');
const expect = chai.expect;

const auth = require('./auth.service');
const config = require('../../.config/config');

describe('#auth', function(){

  describe('encodeToken', function(){

    it('should return a token', function(){
      const results = auth.encodeToken({id: 1});
      expect(results).to.exist;
      expect(results).to.be.string;
    });

  });

  describe('decodeToken', function(){

    it('should return payload', function(){
      const token = auth.encodeToken({id: 1});
      expect(token).to.exist;
      expect(token).to.be.string;
      return auth.decodeToken(token, (err, res) => {
        expect(err).to.be.null;
        expect(res.id).to.equal(1);
      });
    });

    it('should reject invalid token', function(){
      return auth.decodeToken('fake-token', (err, res) => {
        expect(err.name).to.equal('JsonWebTokenError');
        expect(err.message).to.equal('jwt malformed');
        expect(res).to.be.null;
      });
    });

  });

  describe('login', function(){
    const correctUsername = config.users.admin.username;
    const correctPassword = config.users.admin.password;

    it('should return token on success', function(){
      return auth.login(correctUsername, correctPassword).then((token) => {
        expect(token).to.exist;
      });
    });

    it('should throw error if username does not exist', function(){
      var throwsError = false;
      return auth.login('fake-user', correctPassword).catch(() => {
        throwsError = true;
      }).finally(() => {
        expect(throwsError).to.be.true;
      });
    });
    
    it('should throw error if password is wrong', function(){
      var throwsError = false;
      return auth.login(correctUsername, 'fake-password').catch(() => {
        throwsError = true;
      }).finally(() => {
        expect(throwsError).to.be.true;
      });
    });

  });

});
