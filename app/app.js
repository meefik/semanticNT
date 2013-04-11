/**
 * Module dependencies
 */

var
        express = require('express'),
//    stylus = require('stylus'),
        mongoose = require('mongoose'),
        MongoStore = require('connect-mongodb'),
        routes = require('./routes'),
        api = require('./routes/api');

var app = module.exports = express.createServer();

/**
 * Configuration
 */

var conf = {
    db: {
        name: 'openitmo',
        host: '192.168.4.41',
        port: 27017
        //username: 'admin',
        //password: 'secret'
    }
};
var dbUrl = 'mongodb://' + conf.db.host + ':' + conf.db.port + '/' + conf.db.name;

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set("view options", {layout: false});
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    /*
    var session = express.session({
        store: new MongoStore({
            url: dbUrl,
            maxAge: 60000
        }),
        secret: 'superTopSecret'
    });
    app.use(session);
    */
    
    app.use(express.session({
        secret: 'dfe9df2b07fb476e6b28fc70a814173e',
        key: 'connect.sid',
        //httpOnly: false,
        cookie: { maxAge: 1000 * 60 * 24 }
    }));
    
    app.use(express.logger('dev'));
//  app.use(stylus.middleware({ src: __dirname + '/public', compress: true }));
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

app.configure('development', function() {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

/**
 * Database
 */

mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function callback() {
    // Start server
    app.listen(3000, function() {
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
});


/**
 *  Routes
 */

//app.get('/', routes.index);
//app.get('/tpl/:name', routes.partials);

/**
 * JSON API
 */

app.get('/api/profiles', api.profiles);

app.get('/api/profile', api.getProfile);
app.post('/api/profile', api.setProfile);
app.post('/api/signup', api.signup);
app.post('/api/login', api.login);
app.get('/api/logout', api.logout);

/**
 * Return 404 error
 */

app.get('*', routes.e404);
