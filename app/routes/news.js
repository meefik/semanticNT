/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema; //Schema.ObjectId

var News = new Schema({
    courseid: { type: String, required: true },
    date: { type: Date, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
});

NewsModel = mongoose.model('News', News);

/*
 * Serve JSON to our AngularJS client
 */

exports.getNews = function(req, res) {
    NewsModel.find().sort({ date: -1 }).exec(function(err, data) {
        if (!err) {
            res.json(data);
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.addNews = function(req, res) {
    var newNews = new NewsModel({
        courseid: req.params.courseId,
        date: new Date,
        title: req.body.title,
        description: req.body.description
    });
    newNews.save(function(err, data) {
        if (!err) {
            res.json(data);
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.deleteNews = function(req, res) {
    NewsModel.remove({_id: req.params.newsId, courseid: req.params.courseId},
    function(err) {
        if (!err) {
            res.send(200); // 200 OK
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.updateNews = function(req, res) {
    NewsModel.update({_id: req.params.newsId, courseid: req.params.courseId},
    {title: req.body.title, description: req.body.description},
    function(err) {
        if (!err) {
            res.send(200); // 200 OK
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};