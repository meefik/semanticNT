/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var rating = require('./rating');

/**
 * Schemas
 */

var Schema = mongoose.Schema;

var Shelf = new Schema({
    courseid: {type: String, required: true},
    author: {type: String, required: true},
    date: { type: Date, required: true },
    title: {type: String, required: true},
    text: {type: String, required: true}
});

ShelfModel = mongoose.model('Shelf', Shelf);

/*
 * Serve JSON to our AngularJS client
 */

exports.get = function(req, res) {
    var userid = req.session.passport.user;
    if (!userid)
        return res.send(401); // 401 Unauthorized
    
    ShelfModel.find(function(err, data) {
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
    if (!userid)
        return res.send(401); // 401 Unauthorized
    
    var newShelf = new ShelfModel({
        courseid: req.params.courseId,
        author: userid,
        date: new Date(),
        title: req.body.title,
        text: req.body.text
    });
    newShelf.save(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
            rating.add(data._id,userid);
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.remove = function(req, res) {
    var userid = req.session.passport.user;
    if (!userid)
        return res.send(401); // 401 Unauthorized
    
    ShelfModel.remove({_id: req.params.itemId, courseid: req.params.courseId},
    function(err) {
        if (!err) {
            res.send(200); // 200 OK
            rating.remove(req.params.itemId);
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.update = function(req, res) {
    var userid = req.session.passport.user;
    if (!userid)
        return res.send(401); // 401 Unauthorized
    
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