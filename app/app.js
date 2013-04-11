/**
 * Module dependencies
 */

var express = require('express'),
//    stylus = require('stylus'),
        mongoose = require('mongoose'),
        //MongoStore = require('connect-mongo'),
        routes = require('./routes'),
        api = require('./routes/api');

var app = module.exports = express.createServer();

/**
 * Configuration
 */

var conf = {
    db: {
        name: 'openitmo',
        host: 'mongodb.cde.ifmo.ru',
        port: 27017
        //username: 'admin',
        //password: 'secret'
    }
};

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set("view options", {layout: false});
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        key: 'OPENITMO_ID',
        secret: 'SOMETHING_REALLY_HARD_TO_GUESS',
        store: new express.session.MemoryStore,
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

mongoose.connect('mongodb://' + conf.db.host + ':' + conf.db.port + '/' + conf.db.name);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function callback() {
    // Start server
    app.listen(3000, function() {
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
});

/**
 * Schemas
 */

var Schema = mongoose.Schema; //Schema.ObjectId

var Courses = new Schema({
    number: String
});

var Profile = new Schema({
    email: {type: String, unique: true},
    passwd: {type: String},
    nickname: {type: String, required: true},
    fullname: {type: String},
    courses: [Courses]
});

ProfileModel = mongoose.model('Profile', Profile);

/**
 *  Routes
 */

//app.get('/', routes.index);
//app.get('/tpl/:name', routes.partials);

/**
 * JSON API
 */

app.get('/api/name', api.name);

app.get('/api/profiles', api.profiles);
app.get('/api/profile', api.profile);
app.post('/api/profile', api.registration);
app.post('/api/login', api.login);

/**
 * Return 404 error
 */

app.get('*', routes.e404);
