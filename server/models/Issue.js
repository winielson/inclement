// Issue.js

// Creates model for issue collection

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const IssueSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timeCreated: {
        type: Date,
        default: Date.now
    },
    author: { // reference to a document in User collection
        type: Schema.Types.ObjectId, 
        ref: 'User', // Uses populate to create reference to User Collection https://mongoosejs.com/docs/populate.html
        required: true
    },
    upvotes: {
        type: Number,
        required: true
    },
    downvotes: {
        type: Number,
        required: true
    },
    totalVotes: {
        type: Number
    },
    usersUpvoted: [{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }],
    usersDownvoted: [{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }],
    issue_id: Schema.Types.ObjectId
});

module.exports = mongoose.model('Issue', IssueSchema);