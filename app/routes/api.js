/*
 * Serve JSON to our AngularJS client
 */

var crypto = require('crypto');

exports.name = function(req, res) {
    res.json({
        name: 'Bob'
    });
};

exports.profiles = function(req, res) {
    ProfileModel.find(function(err, profiles) {
        if (!err) {
            res.json(profiles);
        } else {
            console.log(err);
        }
    });
};

exports.profile = function(req, res) {
    var profile = req.session.profile;
    if (!profile) {
        res.json(401);
    } else {
        res.json(profile);
    };
};

exports.registration = function(req, res) {
    if (!req.body.email || !req.body.passwd)
        return res.send(400);
    var passwd = crypto.createHash('sha1').update(req.body.passwd).digest('hex');
    var profile = new ProfileModel({
        email: req.body.email,
        passwd: passwd,
        nickname: req.body.nickname,
        fullname: req.body.fullname,
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
            return res.json(profile);
            //console.log("auth: ok");
        } else {
            return res.send(403);
            //console.log("auth: error");
        }
    });
};