/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var OptionSchema = new Schema({
    id: {type: String, unique: true, required: true},
    text: {type: String, required: true},
    question: { type: ObjectId, required: true }
});

var QuestionSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    qtype: {type: String, required: true},
    answer: [String],
    exam: {type: ObjectId, required: true }
});

var ExamSchema = new Schema({
    courseid: {type: String, required: true},
    author: {type: String, required: true},
    title: {type: String, unique: true, required: true},
    deadline: {type: Date, required: true},
    description: {type: String, required: true}
});

var Exam = mongoose.model('Exam', ExamSchema),
    Question  = mongoose.model('Question', QuestionSchema),
    Option = mongoose.model('Option', OptionSchema);

/*
 * Serve JSON to our AngularJS client
 */

// exam API
exports.getExams = function(req, res) {
    Exam.find().sort({ deadline: -1 }).exec(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.getExamById = function (req, res) {
    Exam.findById(req.params.examId, function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.addExam = function(req, res) {
    var newExam = new Exam({
        courseid: req.params.courseId,
        author: req.user,
        deadline: req.body.deadline,
        title: req.body.title,
        description: req.body.description
    });
    newExam.save(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.updateExam = function(req, res) {

    Exam.findById(req.params.examId, function (err, exam) {
        if (!err) {
            if(!exam) {
                return res.send(400); //Bad request
            }
            if (exam.author !== req.user) {
                return res.send(403); // 401 Access forbidden
            }

            exam.set({ courseid: req.body.courseid });
            exam.set({ deadline: req.body.deadline });
            exam.set({ title: req.body.title });
            exam.set({ description: req.body.description });
            exam.save(function (err) {
                if (!err) {
                    res.json(exam); // 200 OK + data
                } else {
                    res.send(500); // 500 Internal Server Error
                    console.log(err);
                }
            });
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.removeExam = function(req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    var examId = req.params.examId;

    Exam.findById(examId, function (err, exam) {
        if (!err) {
            if(!exam) {
                return res.send(400); //Bad request
            }
            if (exam.author !== req.user) {
                return res.send(403);  // 401 Access forbidden
            }

            exam.remove(function (err) {
                if (!err) {
                    Question.remove({ examId: examId }, function (err) {
                        if (!err) {
                            Option.remove({ examId: examId }, function (err) {
                                if (!err) {
                                    res.send(200); // 200 OK
                                } else {
                                    res.send(500); // 500 Internal Server Error
                                    console.log(err);
                                }
                            });
                        } else {
                            res.send(500); // 500 Internal Server Error
                            console.log(err);
                        }
                    });
                } else {
                    res.send(500); // 500 Internal Server Error
                    console.log(err);
                }
            });
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });

};

// questions API
exports.getQuestions = function(req, res) {
    Question.find({ exam: req.params.examId }).sort({ name: 1 }).exec(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.getQuestionById = function (req, res) {
    Question.findById(req.params.questionId, function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.addQuestion = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    Exam.findById(req.params.examId, function(err, exam) {
        if(err) {
            return res.send(500); // Internal server error
        }
        if(!exam) {
            return res.send(400); // Bad request
        }

        var question = new Question({
            name: req.params.name,
            description: req.body.description,
            qtype: req.body.qtype,
            exam: req.params.examId
        });

        question.save(function (err, post) {
            if (!err) {
                res.json(post); // 200 OK + data
            } else {
                res.send(500); // 500 Internal Server Error
                console.log(err);
            }
        });
    });
};

exports.updateQuestion = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    Question.findById(req.params.questionId, function (err, question) {
        if (!err) {
            if(!question) {
                return res.send(400); //Bad request
            }

            Exam.findById(req.params.questionId, function(err, data) {
                if (!err) {
                    res.json(data); // 200 OK + data
                } else {
                    res.send(500); // 500 Internal Server Error
                    console.log(err);
                }
            });

            question.set({ name: req.body.name });
            question.set({ description: req.body.description});
            question.set({ type: req.body.description });
            //question.set({ exam: req.body.exam });

            question.save(function (err) {
                if (!err) {
                    res.json(post); // 200 OK + data
                } else {
                    res.send(500); // 500 Internal Server Error
                    console.log(err);
                }
            });
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.removeQuestion = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    Question.findById(req.params.questionId, function (err, post) {
        if (!err) {
            if(!post) {
                return res.send(400); //Bad request
            }
            if (post.author !== req.user) {
                return res.send(403); // 401 Access forbidden
            }

            post.remove(function (err) {
                if (!err) {
                    res.send(200); // 200 OK
                } else {
                    res.send(500); // 500 Internal Server Error
                    console.log(err);
                }
            });
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

//    opts: new OptionsSchema({
//        id: req.body.quests.opts.id,
//        text: req.body.quests.opts.text,
//        isRight: req.body.quests.opts.isRight
//    })