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
    index: { type: Number, required: true },
    date: { type: Date, required: true },
    context: {type: String, required: true}
});

ShelfModel = mongoose.model('Shelf', Shelf);

/*
 * Serve JSON to our AngularJS client
 */

exports.get = function(req, res) {
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
    
    var newShelf = new ShelfModel({
        courseid: req.params.courseId,
        userid: userid,
        date: new Date(),
        context: req.body.context
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
    newShelf.remove({_id: req.params.itemId, courseid: req.params.courseId},
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
    newShelf.update({_id: req.params.itemId, courseid: req.params.courseId},
    {date: new Date(), context: req.body.context},
    function(err) {
        if (!err) {
            res.send(200); // 200 OK
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};