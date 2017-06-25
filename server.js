// set up
var express  = require('express');
var app      = express();
var port  	 = process.env.PORT || 8080;

var morgan = require('morgan'); 		// log requests to the console
var bodyParser = require('body-parser'); 	// pull information from HTML POST

// configuration

app.use(express.static(__dirname + '/../public'));              // set the static file location
app.use(morgan('dev')); 										                    // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			      // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									                  // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

// routes
require('./routes.js')(app);

// listen
app.listen(port);
console.log("App listening on port " + port);