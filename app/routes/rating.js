/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema;

var Like = new Schema({
    likeid: {type: String, required: true},
    userid: {type: String, required: true},
    author: {type: String, required: true}
});

var LikeAuthor = new Schema({
    likeid: {type: String, required: true, unique: true},
    author: {type: String, required: true}
});

LikeModel = mongoose.model('Like', Like);
LikeAuthorModel = mongoose.model('LikeAuthor', LikeAuthor);

/*
 * API
 */

exports.add = function(likeid, userid) {
    var newLikeAuthor = new LikeAuthorModel({
        likeid: likeid,
        author: userid
    });
    newLikeAuthor.save();
};

exports.remove = function(likeid) {
    LikeAuthorModel.remove({likeid: likeid}, function() {
    });
    LikeModel.remove({likeid: likeid}, function() {
    });
};

exports.get = function(req, res, next) {
    var userid = req.session.passport.user;
    var likeid = req.params.likeId;
    var liked = false;
    LikeModel.find({likeid: likeid}, function(err, data) {
        if (!err && data) {
            for (var i = 0, l = data.length; i < l; i++) {
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
    LikeModel.findOne({likeid: likeid, userid: userid}, function(err, data) {
        if (!err && !data) {
            LikeAuthorModel.findOne({likeid: likeid}, function(err, data) {
                if (!err && data) {
                    var newRating = new LikeModel({
                        likeid: likeid,
                        userid: userid,
                        author: data.author
                    });
                    newRating.save();
                }
            });
        }
    });
    res.send(200);
};

exports.unlike = function(req, res, next) {
    var userid = req.session.passport.user;
    var likeid = req.params.likeId;
    LikeModel.remove({likeid: likeid, userid: userid}, function() {
    });
    res.send(200);
};

exports.report = function(req, res, next) {
    var userid = req.query.userid;
    if (userid) {
        LikeModel.findOne({author: userid}, function(err, data) {
            if (!err && data) {
                res.json({userid: userid, rating: data.length});
            } else {
                res.send(400);
            }
        });
    } else {
        var likeid = req.query.likeid;
        var param = {};
        if (likeid) param = {likeid: likeid};
        LikeModel.find(param, function(err, data) {
            if (!err && data) {
                var arr = {};
                for (var i = 0, l = data.length; i < l; i++) {
                    if (!arr[data[i].author]) arr[data[i].author] = 0;
                    arr[data[i].author] = arr[data[i].author] + 1;
                }
                res.set('Content-Type', 'application/json');
                res.send(JSON.stringify(arr));
            } else {
                res.send(400);
            }
        });
    }
};
