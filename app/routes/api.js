/**
 * Module dependencies
 */

var
        crypto = require('crypto'),
        mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema; //Schema.ObjectId

var Profile = new Schema({
    email: { type: String, unique: true, required: true },
    passwd: { type: String },
    nickname: { type: String },
    fullname: { type: String },
    date: { type: Date },
    courses: { type: Schema.ObjectId, ref: 'Courses' }
});

var Courses = new Schema({
    numbers: [String]
});

ProfileModel = mongoose.model('Profile', Profile);
CoursesModel = mongoose.model('Courses', Courses);

/*
 * Serve JSON to our AngularJS client
 */

exports.profiles = function(req, res) {
    ProfileModel.findOne({}).populate('courses').run(function(err, courses) { 
        if (!err) {
            return res.json(courses);
        } else {
            return res.send(404);
        };
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

exports.getProfile = function(req, res) {
    var profile = req.session.profile;
    if (profile) {
        return res.json(profile);
    } else {
        return res.send(401);
    };
};

exports.setProfile = function(req, res) {
    var profile = req.session.profile;
    if (!profile)
        return res.send(401);
};

exports.signup = function(req, res) {
    if (!req.body.email || !req.body.passwd)
        return res.send(400);

    var newCourses = new CoursesModel({
        numbers: []
    });
    newCourses.save();
    
    var newProfile = new ProfileModel({
        email: req.body.email,
        passwd: crypto.createHash('sha1').update(req.body.passwd).digest('hex'),
        nickname: req.body.nickname,
        fullname: req.body.fullname,
        date: new Date,
        courses: newCourses._id
    });
    newProfile.save(function(err, profile) { 
        if (!err) {
            req.session.profile = newProfile;
            return res.json(profile);
        } else {
            return res.send(500);
        };
    });
};

exports.login = function(req, res) {
    if (!req.body.email || !req.body.passwd)
        return res.send(400);
    
    var passwd = crypto.createHash('sha1').update(req.body.passwd).digest('hex');
    ProfileModel.findOne({email: req.body.email}, function(err, profile) {
        if (!err && profile && profile.passwd === passwd) {
            req.session.profile = profile;
            return res.json(profile);
            //console.log("auth: ok");
        } else {
            return res.send(403);
            //console.log("auth: error");
        };
    });
};

exports.logout = function(req, res) {
    if (req.session) {
        req.session.destroy(function() {
            return res.send(200);
        });
    };
};

/**
 * My Courses
 */

exports.addCourse = function(req, res) {
    //var profile = req.session.profile;
    //if (!profile)
    //    return res.send(401);

    ProfileModel.findById(/*profile._id*/'5167e259e30a06ad15000002').populate('courses').exec(function(err, profile) { 
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
        };
    });
};

exports.delCourse = function(req, res) {
    //var profile = req.session.profile;
    //if (!profile)
    //    return res.send(401);

    ProfileModel.findById(/*profile._id*/'5167e259e30a06ad15000002').populate('courses').exec(function(err, profile) {
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
        ;
    });
};

exports.getCourses = function(req, res) {
    var profile = req.session.profile;
    if (!profile)
        return res.send(401);

    ProfileModel.findById(profile._id).populate('courses').exec(function(err, profile) { 
        if (!err) {
            return res.json(profile.courses.numbers);
        } else {
            return res.send(500);
        };
    });
};