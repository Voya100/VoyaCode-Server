var config = require('./config.global');

config.env = 'development';

config.postgres = {
  host: 'localhost',
  port: 5432,
  database: 'voyacode',
  user: 'postgres',
  password: 'postgres'
}

config.tokenSecret = '4cdddef5-e507-4499-ad5d-29feff6d25c1';

// Stored in configs because there is only 1 user - if more users are added, a database would be more appropriate storing location
config.users = {
  admin: {
    username: 'Admin',
    admin: true,
    password: 'test-password'
  }
}

config.mailgun = {
  apiKey: 'fake-key',
  domain: 'voyacode.com'
}

config.encryptPassword = 'h=H85Z$A<PJd[]Zx?=emj=J_Wa.7"QQ5WFAZ)LQ{MPU';

module.exports = config;