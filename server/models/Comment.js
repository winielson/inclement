// Comment.js

// Creates model for comment collection

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CommentSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    issue: {// reference to a document in Issue collection
        type: Schema.Types.ObjectId, 
        ref: 'Issue', // Uses populate to create reference to User Collection https://mongoosejs.com/docs/populate.html
        required: true
    },
    author: { // reference to a document in User collection
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    timeCreated: {
        type: Date,
        default: Date.now
    },
    comment_id: Schema.Types.ObjectId
});

module.exports = mongoose.model('Comment', CommentSchema);