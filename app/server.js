/**
 * Module dependencies
 */

var express = require('express');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(express);
//var everyauth = require('everyauth');
var passport = require('passport');

var routes = require('./routes');
var api = require('./routes/api');

var app = module.exports = express.createServer();

/**
 * Configuration
 */

var SERVER_PORT = 3000;
var dbUrl = 'mongodb://192.168.4.41:27017/openitmo';

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set("view options", {layout: false});
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    
    /*
    app.use(express.session({
        cookie: { path: '/', httpOnly: true, maxAge: null }, 
        secret:'dfe9df2b07fb476e6b28fc70a814173e'
    }));
    */

    app.use(express.session({
        secret: 'dfe9df2b07fb476e6b28fc70a814173e',
        cookie: {maxAge: 1000 * 60 * 60}
        /*
        store: new MongoStore({
            url: dbUrl
        })
        */
    }));

    /*
    app.use(express.session({
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // month
        secret: 'dfe9df2b07fb476e6b28fc70a814173e',
        store: new SessionStore({url: dbUrl, interval: 1000 * 60 * 60})
    }));
    */

    /*
     app.use(express.session({
     secret: 'dfe9df2b07fb476e6b28fc70a814173e',
     key: 'connect.sid',
     //httpOnly: false,
     cookie: { maxAge: 1000 * 60 * 60 }
     }));
     */
    
    //app.use(stylus.middleware({ src: __dirname + '/public', compress: true }));

    app.use(express.logger('dev'));
    app.use(express.static(__dirname + '/public'));
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(app.router);
});

app.configure('development', function() {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

/**
 *  Routes
 */

//app.get('/', routes.index);
//app.get('/tpl/:name', routes.partials);

/**
 * JSON API
 */

// for developement
app.get('/api/profiles', api.profiles);

// New user registration
app.post('/api/register', api.register);
// Sign In
app.post('/api/login', api.login);
// Logout
app.get('/api/logout', api.logout);
// Reset password
app.post('/api/reset', api.resetPassword);

// Get profile variables
app.get('/api/profile', api.getProfile);
// Set profile variables
app.post('/api/profile', api.setProfile);

// Get list of registered courses
app.get('/api/mycourses', api.getCourses);
// Set list of registered courses
app.post('/api/mycourses', api.setCourses);

// other
//app.put('/api/course/:id', api.addCourse);
//app.del('/api/course/:id', api.delCourse);

/**
 * Return 404 error
 */

app.get('*', routes.e404);


/**
 * Start Server
 */

mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function callback() {
    // Start server
    app.listen(SERVER_PORT, function() {
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
});
