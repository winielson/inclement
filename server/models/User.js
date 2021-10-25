// User.js

// Creates model for users collection

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    user_id: Schema.Types.ObjectId
});

module.exports = mongoose.model('User', UserSchema);