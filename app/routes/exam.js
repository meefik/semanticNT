/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema;

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var VariantSchema = new Schema({
    variantId: {type: String, required: true},
    text: {type: String, required: false}
});

var QuestionSchema = new Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    qtype: {type: String, required: true},
    answer: [String],
    variants: [VariantSchema],
    examId: { type: ObjectId, required: true }
});

var ExamSchema = new Schema({
    courseId: {type: String, required: true},
    author: {type: String, required: true},
    title: {type: String, unique: true, required: true},
    deadline: {type: Date, required: true},
    description: {type: String, required: true}
});

var Variant = mongoose.model('Variant', VariantSchema),
    Question  = mongoose.model('Question', QuestionSchema),
    Exam = mongoose.model('Exam', ExamSchema);

/*
 * Serve JSON to our AngularJS client
 */

// exam API
exports.listExam = function(req, res) {
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized

    Exam.find().sort({ deadline: -1 }).exec(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};
exports.getExam = function (req, res) {
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized

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
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized

    var newExam = new Exam({
        courseId: req.body.courseId,
        author: req.body.author,
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
    if (!req.session.passport.user)
        return res.send(401); // 401 Unauthorized

    Exam.findById(req.params.examId, function (err, exam) {
        if (!err) {
            if(!exam) {
                return res.send(400); //Bad request
            }
            if (exam.author !== req.user) {
                return res.send(403); // 401 Access forbidden
            }

            exam.set({ courseId: req.body.courseId });
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
//            if (exam.author !== req.user) {
//                return res.send(403);  // 401 Access forbidden
//            }

            exam.remove(function (err) {
                if (!err) {
                    Question.remove({ examId: examId }, function (err, question) {
                        Variant.remove({ questionId : question._id }, function (err) {
                            if (!err) {
                                res.send(200); // 200 OK
                            } else {
                                res.send(500); // 500 Internal Server Error
                                console.log(err);
                            }
                        });
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
exports.listQuestion = function(req, res) {
    Question.find({ examId: req.params.examId }).sort({ id: 1 }).exec(function(err, data) {
        if (!err) {
            res.json(data); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};
exports.getQuestion = function (req, res) {
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
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            qtype: req.body.qtype,
            answer: req.body.answer,
            variants: req.body.variants,
            examId: req.body.examId
        });

        question.save(function (err, question) {
            if (!err) {
                res.json(question); // 200 OK + data
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

            question.set({ name: req.body.name });
            question.set({ description: req.body.description});
            question.set({ qtype: req.body.qtype });
            question.set({ answer: req.body.answer});
            question.set({ variants: req.body.variants});

            question.save(function (err, post) {
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