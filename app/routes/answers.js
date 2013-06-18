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
    examId: {type: ObjectId, required: true },
    date: {type: Date, required: true},
    answers: [Array],
    score: {type: Number, required: true}
});

var Answer = mongoose.model('Answer', AnswerSchema);

exports.get = function(req, res) {
    Answer.find().sort({ date: -1 }).exec(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.getByExam = function (req, res) {
    Answer.find({ examId: req.params.examId })
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

exports.getById = function (req, res) {
    Answer.findById(req.params._id, function(err, data) {
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
        examId: req.body.examId,
        date: req.body.date,
        answers: req.body.answers,
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