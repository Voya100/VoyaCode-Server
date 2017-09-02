var config = require('./config.global');

config.env = 'development';

config.postgres = {
  host: 'localhost',
  port: 5432,
  database: 'voyacode',
  user: 'postgres',
  password: 'postgres'
}

module.exports = config;