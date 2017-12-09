// Get the packages we need
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    secrets = require('./config/secrets'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    cookieSession = require('cookie-session'),
    cookieParser = require('cookie-parser');

// Create our Express application
var app = express();

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Connect to a MongoDB
mongoose.connect(secrets.mongo_connection, { useMongoClient: true});

// Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// Initialize cookie sessions //not sure if needed
app.use(cookieParser());
app.use(cookieSession({
  keys: ['asdf', 'asdf']
}));

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Passport
require('./auth/passport')(passport);
app.use(passport.initialize()); // Create an instance of Passport
app.use(passport.session());

// Use routes as a module (see index.js)
require('./routes/index')(app,passport);

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
