
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

// Schemas

var Sizes = new Schema({
    size: {type: String, required: true},
    available: {type: Number, required: true, min: 0, max: 1000},
    sku: {
        type: String,
        required: true,
        validate: [/[a-zA-Z0-9]/, 'Product sku should only have letters and numbers']
    },
    price: {type: Number, required: true, min: 0}
});

var Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'catalog', 'detail', 'zoom'],
        required: true
    },
    url: {type: String, required: true}
});

var Variants = new Schema({
    color: String,
    images: [Images],
    sizes: [Sizes]
});

var Categories = new Schema({
    name: String
});

var Catalogs = new Schema({
    name: String
});

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

/*
 var profile = new ProfileModel({ email: "teach@cde.ifmo.ru", passwd: "secret", nickname: "teach", fullname: "Ivanov Ivan Ivanovich", courses: [ {number: "CS0001"}, {number: "CS0007"}] });
 profile.save(function (err) {
 console.log(err) // ValidationError: Validator "min" failed for path name with value `4`
 //console.log(err.errors.age.value) // 4
 })
 
 ProfileModel.find(
 function (err, products) {
 if (!err) {
 return console.log(products);
 } else {
 return console.log(err);
 }
 });
 
 */

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
