/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var AnswerSchema = new Schema({
    user: {type: String, required: true},
    courseId : {type: String, required: true},
    examId: {type: ObjectId, required: true },
    date: {type: Date, required: true},
    answers: [String],
    hints: [Boolean],
    score: {type: Number, required: true}
});

var Answer = mongoose.model('Answer', AnswerSchema);

exports.getByCourse = function (req, res) {
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized

    Answer.find({ courseId: req.params.courseId })
        .sort({date : 1})
        .exec(function(err, data) {
            if (!err) {
                res.json(data); // 200 OK + data
            } else {
                res.send(500); // 500 Internal Server Error
                console.log(err);
            }
        });
};

exports.getByCourseAndUser = function (req, res) {
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized

    Answer.find({ courseId: req.params.courseId, user: req.params.user })
        .sort({date : 1})
        .exec(function(err, data) {
            if (!err) {
                res.json(data); // 200 OK + data
            } else {
                res.send(500); // 500 Internal Server Error
                console.log(err);
            }
        });
};


exports.list = function (req, res) {
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized

    Answer.find({ courseId: req.params.courseId, examId: req.params.examId })
        .sort({date : 1})
        .exec(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.getByUser = function (req, res) {
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized

    Answer.find({ user: req.params.user }, function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.get = function (req, res) {
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized

    Answer.find({_id : req.params.answerId}, function(err, data) {
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

    var newAnswer = new Answer({
        user: req.body.user,
        courseId: req.body.courseId,
        examId: req.body.examId,
        date: req.body.date,
        answers: req.body.answers,
        hints: req.body.hints,
        score: req.body.score
    });

    newAnswer.save(function(err, data) {
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

    Answer.remove({_id: req.params.answerId},
        function(err) {
            if (!err) {
                res.send(200); // 200 OK
            } else {
                res.send(500); // 500 Internal Server Error
                console.log(err);
            }
        });
};