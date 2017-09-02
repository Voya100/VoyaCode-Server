module.exports = {
  encodeToken,
  decodeToken,
  login
};

const jwt = require('jsonwebtoken');
const config = require('../../.config/config');
const Promise = require('bluebird');

function encodeToken(payload, expiryTime = '3h') {
  return jwt.sign(payload, config.tokenSecret, {expiresIn: expiryTime});
}

function decodeToken(token, callback) {
  return jwt.verify(token, config.tokenSecret, callback);
}

function login(username, password){
  // Only one user exist, so simple comparison is enough
  var adminUser = config.users.admin;
  if(username !== adminUser.username || password !== adminUser.password){
    return Promise.reject('Invalid credentials.');
  }

  return Promise.resolve(encodeToken({username, admin: true, loggedIn: true}));
}
