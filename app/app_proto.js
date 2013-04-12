/**
 * Module dependencies.
 */
 

var express = require('express'),
    mongoose = require('mongoose'),
    routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
    //app.set('views', __dirname + '/views');
    //app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '../../app'));
});

app.configure('development', function() {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

// Routes

//app.get('/', routes.index);


/**
 * Database
 */

mongoose.connect('mongodb://mongodb.cde.ifmo.ru/openitmo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('MongoDB connection established!');
});

var Schema = mongoose.Schema; //Schema.ObjectId

// Model

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

var ProfileModel = mongoose.model('Profile', Profile);


/**
 * HTTP responses
 */

app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/api', function(req, res) {
    res.send('openITMO API is running');
});

// POST to CREATE
app.post('/api/profile', function(req, res) {
    var profile;
    console.log("POST: ");
    console.log(req.body);
    profile = new ProfileModel({
        email: req.body.email,
        passwd: req.body.passwd,
        nickname: req.body.nickname,
        fullname: req.body.fullname,
        courses: req.body.courses
    });
    product.save(function(err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });
    return res.send(product);
});


// List products
app.get('/api/profile', function(req, res) {
    return ProfileModel.find(function(err, products) {
        if (!err) {
            return res.send(products);
        } else {
            return console.log(err);
        }
    });
});


// :format может быть json или html
app.get('/documents.:format?', function(req, res) {
    // Подобие Mongo запроса
    Document.find().all(function(documents) {
        switch (req.params.format) {
            // Для json генерируем подходящие данные
            case 'json':
                res.send(documents.map(function(d) {
                    return d.__doc;
                }));
                break;

                // Иначе - переадресация
            default:
                res.redirect('/documents');
        }
    });
});

// Listen

app.listen(3000, function() {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
