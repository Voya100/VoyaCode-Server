module.exports = function(app) {

	app.get('/api/test', function(req, res) {
    res.json({test: "This is an api test"})
	});

	app.get('*', function(req, res) {
		res.sendFile('public/index.html', {root: './'});
	});
};