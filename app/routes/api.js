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

var Courses = new Schema({
    number: String
});

var Profile = new Schema({
    email: {type: String, unique: true, required: true},
    passwd: {type: String},
    nickname: {type: String},
    fullname: {type: String},
    date: {type: Date},
    courses: [Courses]
});

ProfileModel = mongoose.model('Profile', Profile);

/*
 * Serve JSON to our AngularJS client
 */

exports.profiles = function(req, res) {
    ProfileModel.find(function(err, profiles) {
        if (!err) {
            res.json(profiles);
        } else {
            console.log(err);
            //errorHandler(err);
        }
    });
};

exports.getProfile = function(req, res) {
    var profile = req.session.profile;
    if (!profile) {
        res.send(401);
    } else {
        res.json(profile);
    };
};

exports.setProfile = function(req, res) {
    var profile = req.session.profile;
    if (!profile) {
        res.send(401);
    } else {

    };
};

exports.signup = function(req, res) {
    if (!req.body.email || !req.body.passwd)
        return res.send(400);
    var passwd = crypto.createHash('sha1').update(req.body.passwd).digest('hex');
    var profile = new ProfileModel({
        email: req.body.email,
        passwd: passwd,
        nickname: req.body.nickname,
        fullname: req.body.fullname,
        date: new Date,
        courses: req.body.courses
    });
    profile.save(function(err) {
        if (!err) {
            return res.json(profile);
            //console.log("created");
        } else {
            console.log(err);
            return res.send(500);
        }
    });
};

exports.login = function(req, res) {
    if (!req.body.email || !req.body.passwd)
        return res.send(400);
    var passwd = crypto.createHash('sha1').update(req.body.passwd).digest('hex');
    ProfileModel.findOne({email: req.body.email}, function(err, profile) {
        if (!err && profile && profile.passwd === passwd) {
            req.session.profile = profile;
            console.log(req.session.profile);
            return res.json(profile);
            //console.log("auth: ok");
        } else {
            return res.send(403);
            //console.log("auth: error");
        }
    });
};

exports.logout = function(req, res) {
    if (req.session) {
        req.session.destroy(function() {
            res.send(200);
        });
    }
};