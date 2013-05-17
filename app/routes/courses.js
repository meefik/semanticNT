/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema;

var Course = new Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String },
    begin: { type: Date },
    end: { type: Date },
    effort: { type: Number },
    description: { type: String },
    authors: [String],
    moderators: [String]
});

CourseModel = mongoose.model('Course', Course);

/*
 * Serve JSON to our AngularJS client
 */

exports.list = function(req, res) {
    CourseModel.find(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.get = function(req, res) {
    CourseModel.findOne({id: req.params.courseId}, function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.add = function(req, res) {
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized
    
    var newCourse = new CourseModel({
        id: req.params.courseId,
        name: req.body.name,
        begin: new Date(req.body.begin),
        end: new Date(req.body.end),
        effort: req.body.effort,
        description: req.body.description,
        authors: req.body.authors,
        parts: req.body.parts
    });
    
    newCourse.save(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.remove = function(req, res) {
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized
    
    CourseModel.remove({id: req.params.courseId},
    function(err) {
        if (!err) {
            res.send(200); // 200 OK
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.update = function(req, res) {
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized
    
    CourseModel.update({id: req.params.courseId},
    {
        name: req.body.name,
        begin: new Date(req.body.begin),
        end: new Date(req.body.end),
        effort: req.body.effort,
        description: req.body.description,
        authors: req.body.authors,
        parts: req.body.parts
    },
    function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};