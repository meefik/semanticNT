/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema;

var Struct = new Schema({
    courseid: {type: String, required: true},
    author: {type: String, required: true},
    date: {type: Date, required: true},
    title:  {type: String, required: true},
    text: {type: String, required: true}
});

StructModel = mongoose.model('Struct', Struct);

/*
 * Serve JSON to our AngularJS client
 */

exports.get = function(req, res) {
    var userid = req.session.passport.user;
    if (!userid)
        return res.send(401); // 401 Unauthorized
    
    StructModel.find().sort({date: 1}).exec(function(err, data) {
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
    
    var newStruct = new StructModel({
        courseid: req.params.courseId,
        author: userid,
        date: new Date(),
        title: req.body.title,
        text: req.body.text
    });
    newStruct.save(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
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
    
    StructModel.remove({_id: req.params.itemId, courseid: req.params.courseId},
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
    var userid = req.session.passport.user;
    if (!userid)
        return res.send(401); // 401 Unauthorized

    StructModel.update({_id: req.params.itemId, courseid: req.params.courseId},
    {title: req.body.title, text: req.body.text},
    function(err) {
        if (!err) {
            res.send(200); // 200 OK
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};