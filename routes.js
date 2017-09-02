const api = require('./api/routes');
const auth = require('./api/auth/auth.controller');

module.exports = function(app) {

  app.use('/api', auth.initializeUser, api);

  app.get('*', function(req, res) {
    res.sendFile('public/index.html', {root: '../'});
  });
};