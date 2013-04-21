/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema; //Schema.ObjectId

var Info = new Schema({
    courseid: {type: String, required: true},
    date: { type: Date, required: true },
    context: {type: String, required: true}
});

InfoModel = mongoose.model('Info', Info);

/*
 * Serve JSON to our AngularJS client
 */

exports.get = function(req, res) {
    InfoModel.find(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.add = function(req, res) {
    var newInfo = new InfoModel({
        courseid: req.params.courseId,
        date: new Date(),
        context: req.body.context
    });
    newInfo.save(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.remove = function(req, res) {
    InfoModel.remove({_id: req.params.itemId, courseid: req.params.courseId},
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
    InfoModel.update({_id: req.params.itemId, courseid: req.params.courseId},
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