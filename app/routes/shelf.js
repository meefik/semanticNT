/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema; //Schema.ObjectId

var Shelf = new Schema({
    courseid: {type: String, required: true},
    author: {type: String, required: true},
    index: {type: Number, required: true},
    date: { type: Date, required: true },
    title: {type: String, required: true},
    text: {type: String, required: true}
});

ShelfModel = mongoose.model('Shelf', Shelf);

/*
 * Serve JSON to our AngularJS client
 */

exports.get = function(req, res) {
    ShelfModel.find().sort({ index: 1 }).exec(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.add = function(req, res) {
    var userid = req.session.passport.user;
    
    var newShelf = new ShelfModel({
        courseid: req.params.courseId,
        author: userid,
        index: new Date().getTime(),
        date: new Date(),
        title: req.body.title,
        text: req.body.text
    });
    newShelf.save(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.remove = function(req, res) {
    ShelfModel.remove({_id: req.params.itemId, courseid: req.params.courseId},
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
    ShelfModel.update({_id: req.params.itemId, courseid: req.params.courseId},
    {date: new Date(), title: req.body.title, text: req.body.text},
    function(err) {
        if (!err) {
            res.send(200); // 200 OK
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};