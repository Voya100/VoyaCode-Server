const api = require('./api/routes');

module.exports = function(app) {

	app.use('/api', api);

	app.get('*', function(req, res) {
    console.log(res);
		res.sendFile('public/index.html', {root: '../'});
	});
};