var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionData ={
  host: 'localhost',
  port: 5432,
  database: 'voyacode',
  user: 'postgres'
}
var db = pgp(connectionData);

module.exports = db;