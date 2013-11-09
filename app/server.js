/**
 * Module dependencies
 */

var express = require('express'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(express),
    passport = require('passport');

var routes = require('./routes'),
    profile = require('./routes/profile'),
    courses = require('./routes/courses'),
    news = require('./routes/news'),
    shelf = require('./routes/shelf'),
    struct = require('./routes/struct'),
    forum = require('./routes/forum'),
    exam = require('./routes/exam'),
    answers = require('./routes/answers');

var app = express();

/**
 * Configuration
 */

var SERVER_PORT = 3000;
//var dbUrl = 'mongodb://192.168.4.41:27017/openitmo';
var dbUrl = 'mongodb://localhost:27017/openitmo';

app.configure(function () {
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

app.configure('development', function () {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

//Handler of uncaught exceptions
process.on('uncaughtException', function (err) {
    console.error(err);
});

/**
 *  Routes
 */

//app.get('/', routes.index);
//app.get('/tpl/:name', routes.partials);

/**
 * JSON API
 */

// Profiles
app.post('/api/register', profile.register);
app.post('/api/login', profile.login);
app.get('/api/logout', profile.logout);
app.post('/api/reset', profile.reset);
app.get('/api/profile', profile.get);
app.put('/api/profile', profile.update);
app.del('/api/profile', profile.remove);
app.get('/api/profile/:login', profile.check);

// Courses
app.get('/api/courses', courses.list);
app.post('/api/courses', courses.add);
app.get('/api/courses/:courseId', courses.get);
app.put('/api/courses/:courseId', courses.update);
app.del('/api/courses/:courseId', courses.remove);

// Course news
app.get('/api/courses/:courseId/news', news.get);
app.post('/api/courses/:courseId/news', news.add);
app.put('/api/courses/:courseId/news/:itemId', news.update);
app.del('/api/courses/:courseId/news/:itemId', news.remove);

// Course shelf
app.get('/api/courses/:courseId/shelf', shelf.get);
app.post('/api/courses/:courseId/shelf', shelf.add);
app.put('/api/courses/:courseId/shelf/:itemId', shelf.update);
app.del('/api/courses/:courseId/shelf/:itemId', shelf.remove);

// Course struct
app.get('/api/courses/:courseId/struct', struct.get);
app.post('/api/courses/:courseId/struct', struct.add);
app.put('/api/courses/:courseId/struct/:itemId', struct.update);
app.del('/api/courses/:courseId/struct/:itemId', struct.remove);

// Course forum
app.get('/api/courses/:courseId/forum', forum.getTopics);
app.get('/api/courses/:courseId/forum/offset/:offset', forum.getTopics);
app.get('/api/courses/:courseId/forum/:topicId', forum.getTopicById);
app.post('/api/courses/:courseId/forum', forum.addTopic);
app.put('/api/courses/:courseId/forum/:topicId', forum.updateTopic);
app.del('/api/courses/:courseId/forum/:topicId', forum.removeTopic);
app.get('/api/courses/:courseId/forum/:topicId/posts', forum.getPosts);
app.get('/api/courses/:courseId/forum/:topicId/posts/offset/:offset', forum.getPosts);
app.get('/api/courses/:courseId/forum/:topicId/posts/:postId', forum.getPostById);
app.post('/api/courses/:courseId/forum/:topicId/posts', forum.addPost);
app.put('/api/courses/:courseId/forum/:topicId/posts/:postId', forum.updatePost);
app.del('/api/courses/:courseId/forum/:topicId/posts/:postId', forum.removePost);
app.post('/api/courses/:courseId/forum/:topicId/posts/:postId/star', forum.starPost);
app.del('/api/courses/:courseId/forum/:topicId/posts/:postId/star', forum.unstarPost);

// Course exams
app.get('/api/courses/:courseId/exam', exam.listExam);
app.get('/api/courses/:courseId/exam/:examId', exam.getExam);
app.post('/api/courses/:courseId/exam', exam.addExam);
app.put('/api/courses/:courseId/exam/:examId', exam.updateExam);
app.del('/api/courses/:courseId/exam/:examId', exam.removeExam);
app.get('/api/courses/:courseId/exam/:examId/question', exam.listQuestion);
app.get('/api/courses/:courseId/exam/:examId/question/:questionId', exam.getQuestion);
app.post('/api/courses/:courseId/exam/:examId/question', exam.addQuestion);
app.put('/api/courses/:courseId/exam/:examId/question/:questionId', exam.updateQuestion);
app.del('/api/courses/:courseId/exam/:examId/question/:questionId', exam.removeQuestion);

// Course exam answers
app.get('/api/courses/:courseId/answers', answers.getByCourse);
app.get('/api/courses/:courseId/answers/user/:user', answers.getByCourseAndUser);
app.get('/api/courses/:courseId/answers/:answerId', answers.get);
app.del('/api/courses/:courseId/answers/:answerId', answers.remove);
app.get('/api/courses/:courseId/answers/exam/:examId', answers.list);
app.post('/api/courses/:courseId/answers/exam/:examId', answers.add);

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
    app.listen(SERVER_PORT, function () {
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
});
