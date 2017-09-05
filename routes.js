const api = require('./api/routes');
const auth = require('./api/auth/auth.controller');

const rss = require('./api/rss/rss.controller');

module.exports = function(app) {

  app.use('/api', auth.initializeUser, api);

  app.use('/blogs/rss', rss.getBlogRss);
  // Support old path for the time being
  app.use('/blog-content/blogs.rss', rss.getBlogRss);

  app.get('*', function(req, res) {
    res.sendFile('public/index.html', {root: '../'});
  });
};