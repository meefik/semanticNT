/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema;

var Rating = new Schema({
    likeid: {type: String, required: true},
    userid: {type: String, required: true}
});

RatingModel = mongoose.model('Rating', Rating);

/*
 * API
 */

exports.get = function(req, res, next) {
    var userid = req.session.passport.user;
    var likeid = req.params.likeId;
    var liked = false;
    RatingModel.find({likeid: likeid}, function(err, data) {
        if (!err && data) {
            for(var i = 0, l = data.length; i < l; i++) {
                if (data[i].userid === userid) {
                    liked = true;
                    break;
                }
            }
            res.json({likeid: likeid, count: data.length, liked: liked});
        } else {
            res.send(200);
        }
    });
};

exports.like = function(req, res, next) {
    var userid = req.session.passport.user;
    var likeid = req.params.likeId;
    RatingModel.findOne({likeid: likeid, userid: userid}, function(err, data) {
        if (!err && !data) {
            var newRating = new RatingModel({
                likeid: likeid,
                userid: userid
            });
            newRating.save();
        }
    });
    res.send(200);
};

exports.unlike = function(req, res, next) {
    var userid = req.session.passport.user;
    var likeid = req.params.likeId;
    RatingModel.remove({likeid: likeid, userid: userid}, function() {});
    res.send(200);
};
