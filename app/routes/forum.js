/**
 * Module dependencies
 */

var mongoose = require('mongoose');

/**
 * Schemas
 */

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId; //Schema.ObjectId

var Topic = new Schema({
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: { type: ObjectId, required: true }
});

var Post = new Schema({
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
    rating: { type: Number, min: 0, default: 0},
    author: { type: ObjectId, required: true },
    topic: { type: ObjectId, required: true }
});

TopicModel = mongoose.model('Topic', Topic);
PostModel = mongoose.model('Post', Post);