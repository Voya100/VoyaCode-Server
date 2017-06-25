const request = require('request');

module.exports = function(app) {

	app.get('/api/test', function(req, res) {
    res.json({test: "This is an api test 3"})
	});

  app.get('/api/blogs', function(req, res) {
    const uri = 'http://69.5.14.14/php/blogs.php' + (req.query.limit ? '?limit=' + req.query.limit : '');
    request({
      uri: uri
    }).pipe(res);
	});

  app.get('/api/comments', function(req, res){
    const uri = 'http://69.5.14.14/php/getComments.php';
    request({
      uri: uri
    }).pipe(res);
  })

	app.get('*', function(req, res) {
    console.log(res);
		res.sendFile('public/index.html', {root: '../'});
	});
};