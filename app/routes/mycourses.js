/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema; //Schema.ObjectId

var MyCourses = new Schema({
    userid: { type: String, unique: true, required: true },
    courses: [String]
});

MyCoursesModel = mongoose.model('MyCourses', MyCourses);

/*
 * Serve JSON to our AngularJS client
 */

// Get list of registered courses
exports.getMyCourses = function(req, res) {
    var userid = req.session.passport.user;
    if (!userid)
        return res.send(401); // 401 Unauthorized

    MyCoursesModel.findOne({userid: userid}, function(err, data) {
        if (!err) {
            var courses = [];
            if (data)
                courses = data.courses;
            return res.json({courses: courses});
        } else {
            console.log(err);
            return res.send(500); // 500 Internal Server Error
        }
    });
};

// Set list of registered courses
exports.setMyCourses = function(req, res) {
    var userid = req.session.passport.user;
    if (!userid)
        return res.send(401); // 401 Unauthorized

    MyCoursesModel.findOneAndUpdate({userid: userid}, {courses: req.body.courses}, function(err) {
        if (!err) {
            return res.send(200); // 200 OK
        } else {
            console.log(err);
            return res.send(500); // 500 Internal Server Error
        }
    });
};
