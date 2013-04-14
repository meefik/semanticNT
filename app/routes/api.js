/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Schemas
 */

var Schema = mongoose.Schema; //Schema.ObjectId

var Profile = new Schema({
    email: { type: String, unique: true, required: true },
    passwd: { type: String },
    nickname: { type: String },
    fullname: { type: String },
    date: { type: Date }
    //courses: { type: Schema.ObjectId, ref: 'Courses' }
});

var MyCourses = new Schema({
    userid: { type: String, unique: true, required: true },
    courses: [String]
});

ProfileModel = mongoose.model('Profile', Profile);
MyCoursesModel = mongoose.model('MyCourses', MyCourses);

/**
 * Auth
 */

passport.serializeUser(function(userid, done) {
    done(null, userid);
});

passport.deserializeUser(function(userid, done) {
    done(null, userid);
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd'
},
function(username, password, done) {
    ProfileModel.findOne({email: username}, function(err, data) {
        var passwd = crypto.createHash('sha1').update(password).digest('hex');
        if (!err && data && data.passwd === passwd) {
            return done(null, data._id);
        } else {
            return done(err);
        }
    });
}
));

/*
 * Serve JSON to our AngularJS client
 */

exports.profiles = function(req, res) {
    ProfileModel.find(function(err, data) { 
        if (!err) {
            return res.json(data);
        } else {
            return res.send(404);
        }
    });

    /*
    ProfileModel.find(function(err, profiles) {
        if (!err) {
            return res.json(profiles);
        } else {
            errorHandler(err);
        };
    });
    */
};

// Get profile variables
exports.getProfile = function(req, res) {
    var userid = req.session.passport.user;
    if (userid) {
        ProfileModel.findById(userid, function(err, data) {
            if (!err) {
                return res.json({
                    email: data.email,
                    nickname: data.nickname,
                    fullname: data.fullname
                    //courses: data.courses.numbers
                });
            } else {
                console.log(err);
                return res.send(500);
            }
        });
    } else {
        return res.json({});
    }
};

// Set profile variables
exports.setProfile = function(req, res) {
    var userid = req.session.passport.user;
    if (!userid)
        return res.send(401);
};

// New user registration
exports.register = function(req, res) {
    if (!req.body.email || !req.body.passwd)
        return res.send(400);

    /*
    var newCourses = new MyCoursesModel({
        numbers: []
    });
    newCourses.save();
    */
    
    var newProfile = new ProfileModel({
        email: req.body.email,
        passwd: crypto.createHash('sha1').update(req.body.passwd).digest('hex'),
        nickname: req.body.nickname,
        fullname: req.body.fullname,
        date: new Date
        //courses: newCourses._id
    });
    newProfile.save(function(err, data) { 
        if (!err) {
            req.session.passport.user = data._id;
            return res.send(200);
        } else {
            console.log(err);
            //MyCoursesModel.findById(newCourses._id).remove();
            return res.send(500);
        }
    });
};

// Sign In
exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send(401);
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.send(200);
        });
    })(req, res, next);
};

/*
exports.login = function(req, res) {
    if (!req.body.email || !req.body.passwd)
        return res.send(400);
    
    ProfileModel.findOne({email: req.body.email}, function(err, profile) {
        var passwd = crypto.createHash('sha1').update(req.body.passwd).digest('hex');
        if (!err && profile && profile.passwd === passwd) {
            req.session.userid = profile._id;
            return exports.getProfile(req, res);
        } else {
            return res.send(403);
        }
    });
};
*/

// Logout
exports.logout = function(req, res) {
    if (req.session) {
        req.session.destroy(function() {
            return res.send(200);
        });
    }
};

/**
 * My Courses
 */

// Get list of registered courses
exports.getCourses = function(req, res) {
    var userid = req.session.passport.user;
    if (!userid)
        return res.send(401);

    MyCoursesModel.findOne({userid: userid}, function(err, data) {
        if (!err) {
            var courses = [];
            if (data)
                courses = data.courses;
            return res.json({courses: courses});
        } else {
            console.log(err);
            return res.send(500);
        }
    });
};

// Set list of registered courses
exports.setCourses = function(req, res) {
    var userid = req.session.passport.user;
    if (!userid)
        return res.send(401);

    MyCoursesModel.findOneAndUpdate({userid: userid}, {courses: req.body.courses}, function(err) {
        if (!err) {
            return res.send(200);
        } else {
            console.log(err);
            return res.send(500);
        }
    });
};

// fixme: old code
exports.addCourse = function(req, res) {
    var profile = req.session.profile;
    if (!profile)
        return res.send(401);

    ProfileModel.findById(profile._id).populate('courses').exec(function(err, profile) { 
        if (!err) {
            var courseid = req.params.id;
            profile.courses.numbers.push(courseid);
            CoursesModel.findByIdAndUpdate(profile.courses._id, {numbers: profile.courses.numbers}, function(err, courses) {
                if (!err)
                    return res.send(200);
                else
                    return res.send(500);
            });
        } else {
            return res.send(500);
        }
    });
};

// fixme: old code
exports.delCourse = function(req, res) {
    var profile = req.session.profile;
    if (!profile)
        return res.send(401);

    ProfileModel.findById(profile._id).populate('courses').exec(function(err, profile) {
        if (!err) {
            var courseid = req.params.id;
            var arr = profile.courses.numbers;
            for (var i in arr) {
                if (arr[i] === courseid) {
                    profile.courses.numbers.splice(i, 1);
                    break;
                }
            }
            CoursesModel.findByIdAndUpdate(profile.courses._id, {numbers: profile.courses.numbers}, function(err, courses) {
                if (!err)
                    return res.send(200);
                else
                    return res.send(500);
            });
        } else {
            return res.send(500);
        }
    });
};
