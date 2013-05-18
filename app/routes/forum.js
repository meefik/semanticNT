/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId; //Schema.ObjectId

var TopicSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    courseid: { type: String, required: true },
    author: { type: ObjectId, required: true }
});

var PostSchema = new Schema({
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
    rating: { type: Number, min: 0, default: 0},
    author: { type: ObjectId, required: true },
    topic: { type: ObjectId, required: true }
});

Topic = mongoose.model('Topic', TopicSchema);
Post = mongoose.model('Post', PostSchema);

/*
 * Serve JSON to our AngularJS client
 */

exports.getTopics = function(req, res) {
    Topic.find({ courseid: req.params.courseId })
        .sort({ date: -1 })
        .exec(function(err, topics) {
            if (!err) {
                res.json(topics); // 200 OK + data
            } else {
                res.send(500); // 500 Internal Server Error
                console.log(err);
            }
        });
};

exports.addTopic = function(req, res) {
    var topic = new Topic({
        title: req.body.title,
        courseid: req.params.courseId,
        author: req.body.author //for testing
    });

    topic.save(function(err, topic) {
        if (!err) {
            res.json(topic); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.updateTopic = function(req, res) {
    Post.findById(req.params.topicId, function(err, topic) {
        if(!err) {
            topic.set({ title: req.body.title });
            topic.save(function(err) {
                if (!err) {
                    res.json(topic); // 200 OK + data
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

exports.removeTopic = function(req, res) {
    Topic.remove(req.params.topicId, function(err) {
        if (!err) {
            res.send(200); // 200 OK
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.getPosts = function(req, res) {
    Post.findById(req.params.topicId, function(err, posts) {
        if (!err) {
            res.json(posts); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.addPost = function(req, res) {
    var post = new Post({
        title: req.body.title,
        body: req.body.body,
        topic: req.params.topicId,
        author: req.body.author //for testing
    });
    post.topic = req.params.topicId;

    post.save(function(err, post) {
        if (!err) {
            res.json(post); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.updatePost = function(req, res) {
    Post.findById(req.params.postId, function(err, post) {
        if(!err) {
            post.set({ title: req.body.title, body: req.body.body });
            post.save(function(err) {
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

exports.removePost = function(req, res) {
    Post.remove(req.params.postId, function(err) {
        if (!err) {
            res.send(200); // 200 OK
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};