const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const User = require('../models/User'); // import user model
const Issue = require('../models/Issue');
const Comment = require('../models/Comment');
const { query } = require('express');

const resolvers = {
    // Define union resolve types
    UserOrErrorResult: { 
        __resolveType(obj) {
            // console.log(obj);
            // Return user type if obj contains username
            if(obj.username){
                return 'User';
            }
            // Return error type if obj contains errorMessage
            if(obj.errorMessage){
                return 'Error';
            }
            return null; // GraphQL error is thrown
        }
    },
    LoginOrErrorResult: { 
        __resolveType(obj) {
            // console.log(obj);
            // Return user type if obj contains username
            if(obj.token){
                return 'LoginResult';
            }
            // Return error type if obj contains errorMessage
            if(obj.errorMessage){
                return 'Error';
            }
            return null; // GraphQL error is thrown
        }
    },
    IssueOrErrorResult: { 
        __resolveType(obj) {
            // console.log(obj);
            // Return issue type if obj contains title
            if(obj.title){
                return 'Issue';
            }
            // Return error type if obj contains errorMessage
            if(obj.errorMessage){
                return 'Error';
            }
            return null; // GraphQL error is thrown
        }
    },
    EditedOrErrorResult: { 
        __resolveType(obj) {
            // console.log(obj);
            // Return issue type if obj contains title
            if(obj.acknowledged){
                return 'Edited';
            }
            // Return error type if obj contains errorMessage
            if(obj.errorMessage){
                return 'Error';
            }
            return null; // GraphQL error is thrown
        }
    },
    DeletedOrErrorResult: { 
        __resolveType(obj) {
            // console.log(obj);
            // Return issue type if obj contains title
            if(obj.deletedCount >= 0){
                return 'Deleted';
            }
            // Return error type if obj contains errorMessage
            if(obj.errorMessage){
                return 'Error';
            }
            return null; // GraphQL error is thrown
        }
    },
    CommentOrErrorResult: { 
        __resolveType(obj) {
            // console.log(obj);
            // Return comment type if obj contains message
            if(obj.message){
                return 'Comment';
            }
            // Return error type if obj contains errorMessage
            if(obj.errorMessage){
                return 'Error';
            }
            return null; // GraphQL error is thrown
        }
    },
    Query: {
        async getAllUsers() {
            try {
                const users = await User.find();
                console.log('getAllUsers success');
                return users;
            }            
            catch (err) {
                console.log("getAllUsers failure");
                return { errorMessage: 'getAllUsers ERROR: '+err };
            }
        },
        async getUserById(parent, args) {
            try {
                const user = await User.findById(args._id);
                console.log('getUserById success');
                return user;
            }            
            catch (err) {
                console.log("createComment failure");
                // return { errorMessage: 'getUserById ERROR: no user with matching _id '+args._id };
                return { errorMessage: 'getUserById ERROR:'+err };
            }
        },
        async getAllIssues() {
            try {
                const issues = await Issue.find();
                console.log('getAllIssues success');
                return issues;
            }            
            catch (err) {
                console.log("getAllIssues failure");
                return { errorMessage: 'getAllIssues ERROR: '+err };
            }
        },
        async getIssuesByAuthor(parent, args) {
            try {
                const issues = await Issue.find({'author': args.author});
                console.log('getIssuesByAuthor success');
                return issues;
            }            
            catch (err) {
                console.log("getIssuesByAuthor failure");
                // return { errorMessage: 'getUserById ERROR: no user with matching _id '+args._id };
                return { errorMessage: 'getIssuesByAuthor ERROR:'+err };
            }
        },
        async getCommentsByAuthor(parent, args) {
            try {
                const comments = await Comment.find({'author': args.author});
                console.log('getCommentsByAuthor success');
                return comments;
            }            
            catch (err) {
                console.log("getCommentsByAuthor failure");
                // return { errorMessage: 'getUserById ERROR: no user with matching _id '+args._id };
                return { errorMessage: 'getCommentsByAuthor ERROR:'+err };
            }
        },
        async getCommentsByIssue(parent, args) {
            try {
                const comments = await Comment.find({'issue': args.issue});
                console.log('getCommentsByIssue success');
                return comments;
            }            
            catch (err) {
                console.log("getCommentsByIssue failure");
                // return { errorMessage: 'getUserById ERROR: no user with matching _id '+args._id };
                return { errorMessage: 'getCommentsByIssue ERROR:'+err };
            }
        },
    },
    Mutation: {
        createUser: async (parent, args) => {
            // Create and assign the new User using schema
            const user = new User({
                username: args.input.username,
                password: args.input.password,
                email: args.input.email,
                isAdmin: args.input.isAdmin
            });

            try {
                const savedUser = await user.save(); // mongoose save() adds user document to collection
                console.log('createUser success');
                return savedUser;
            }
            catch (err) {
                console.log("createUser failure");
                return 'createUser ERROR: '+err;
            }
        },
        registerUser: async (parent, args) => {
            try {
                const { username, email, password, passwordCheck} = args.input;

                // Validation
                // Validate: all fields are filled
                if (!username || !email || !password || !passwordCheck) {
                    console.log("registerUser failure");
                    return { errorMessage: "Not all fields are filled." };
                }

                // Validate: pword is larger than 5 characters
                if (password.length < 5) {
                    console.log("registerUser failure");
                    return { errorMessage: "Password needs to be at least 5 characters." };
                }

                // Validate: pword and pwordCheck match
                if (password !== passwordCheck) {
                    console.log("registerUser failure");
                    return { errorMessage: "Entered passwords do not match." };
                }

                // Validate: check if user already exists
                const existingUser = await User.findOne({ username: username });

                if (existingUser) {
                    console.log("registerUser failure");
                    return { errorMessage: "An account with this username already exists." };
                }

                // Salt and hash pword using bcrypt
                const salt = await bcrypt.genSalt();
                const passwordHash = await bcrypt.hash(password, salt);

                const newUser = new User({
                    username: username,
                    email: email,
                    password: passwordHash,
                    isAdmin: args.input.isAdmin
                });

                const savedUser = await newUser.save();
                
                console.log("registerUser success");
                return savedUser;
            }
            catch (err) {
                console.log("registerUser failure");
                return { errorMessage: 'registerUser ERROR: '+err };
            }
        },
        loginUser: async (parent, args) => {
            try {
                const { username, password } = args.input;
                
                // Validate: All required fields are in request
                if (!username || !password) {
                    console.log("loginUser failure");
                    return { errorMessage: "Username and password must be filled." };
                }

                // Validate: User exists
                const user = await User.findOne({ username: username });

                if (!user) {
                    console.log("loginUser failure");
                    return { errorMessage: "An account with this username does not exist." };
                }

                // Validate: Password matches with db
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    console.log("loginUser failure");
                    return { errorMessage: "Incorrect password." };
                }

                // Create jwt to authenticate user
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

                console.log("loginUser success");
                return { 
                    token: token, 
                    id: user._id,
                    username: user.username
                };
            }
            catch (err) {
                console.log("loginUser failure");
                return { errorMessage: 'loginUser ERROR: '+err };
            }
        },
        editUser: async (parent, args) => {
            try {
                let passwordCopy = args.input.password;

                // Salt and hash new pword using bcrypt
                if(args.input.password) {
                    const salt = await bcrypt.genSalt();
                    const passwordHash = await bcrypt.hash(passwordCopy, salt);
                    passwordCopy = passwordHash;
                }

                // Update issue data with matching _id
                const updatedUser = await User.updateOne({ _id: args.input._id }, { $set: 
                    {
                        username: args.input.username,
                        password: passwordCopy,
                        email: args.input.email
                    }
                });

                console.log("editUser success");
                return updatedUser;
            }
            catch (err) {
                console.log("editUser failure");
                return { errorMessage: 'editUser ERROR: '+err };
            }
        },
        createIssue: async (parent, args) => {
            try {
                const { title, description, timeCreated, upvotes, downvotes, totalVotes, currentUser } = args.input

                // Validate that the passed currentUser is defined in db
                const currentUserExists = await User.findById(currentUser);
                if(!currentUserExists) {
                    return { errorMessage: `createIssue ERROR: author with _id ${currentUser} does not exist` };
                }

                // Create and assign the new Issue using schema
                const issue = new Issue({
                    title: title,
                    description: description,
                    timeCreated: timeCreated,
                    upvotes: upvotes,
                    downvotes: downvotes,
                    totalVotes: totalVotes,
                    author: currentUser,
                    usersUpvoted: [currentUser], // the user that creates this issue automatically upvotes it
                    usersDownvote: []
                });

                const savedIssue = await issue.save(); // mongoose save() adds user document to collection
                console.log("createIssue success");
                return savedIssue;
            }
            catch (err) {
                console.log("createIssue failure");
                return { errorMessage: 'createIssue ERROR: '+err };
            }
        },
        editIssue: async (parent, args) => {
            try {
                const { title, description, usersUpvoted, usersDownvoted, totalVotes, _id } = args.input;

                // Update issue data with matching _id
                const updatedIssue = await Issue.updateOne({ _id: _id }, { $set: 
                    {
                        title: title,
                        description: description,
                        usersUpvoted: usersUpvoted,
                        usersDownvoted: usersDownvoted,
                        totalVotes: totalVotes
                    }
                });

                console.log("editIssue success");
                return updatedIssue;
            }
            catch (err) {
                console.log("editIssue failure");
                return { errorMessage: 'editIssue ERROR: '+err };
            }
        },
        deleteIssue: async (parent, args) => {
            try {
                const { currentUser, _id } = args.input;

                // Validate: Check if current user is author 
                const issue = await Issue.findOne({_id: _id});
                if(issue.author.toString() !== currentUser) { // (If false: cannot delete issue)
                    console.log("deleteIssue failure");
                    return { errorMessage: 'deleteIssue ERROR: current user is not the author of this issue' };
                }

                // Delete issue data by _id
                const removedIssue = await Issue.deleteOne({ _id: _id });

                // Validate if issue with passed _id exists
                if(removedIssue.deletedCount === 0) {
                    console.log("deleteIssue failure");
                    return { errorMessage: `deleteIssue ERROR: issue with _id ${_id} does not exist` };
                }
                console.log("deleteIssue success");
                return removedIssue;
            }
            catch (err) {
                console.log("deleteIssue failure");
                return { errorMessage: 'deleteIssue ERROR: '+err };
            }
        },
        createComment: async (parent, args) => {
            try {
                const { message, issue, currentUser } = args.input;

                // Validate that the passed currentUser is defined in db
                const authorExists = await User.findById(currentUser);
                if(!authorExists) {
                    return { errorMessage: `createComment ERROR: author with _id ${currentUser} does not exist` };
                }

                // Validate that the passed issue is defined in db
                const issueExists = await Issue.findById(issue);
                if(!issueExists) {
                    return { errorMessage: `createComment ERROR: issue with _id ${issue} does not exist` };
                }

                // Create and assign the new Comment using schema
                const comment = new Comment({
                    message: message,
                    issue: issue,
                    author: currentUser
                });

                const savedComment = await comment.save(); // mongoose save() adds user document to collection
                console.log("createComment success");
                return savedComment;
            }
            catch (err) {
                console.log("createComment failure");
                return { errorMessage: 'createComment ERROR: '+err };
            }
        },
        editComment: async (parent, args) => {
            try {
                const { message, currentUser, _id } = args.input;

                // Validate: Check if current user is author 
                const comment = await Comment.findOne({_id: _id});
                if(comment.author.toString() !== currentUser) { // (If false: cannot delete comment)
                    console.log("editComment failure");
                    return { errorMessage: 'editComment ERROR: current user is not the author of this comment' };
                }

                // Update comment data with matching _id
                const updatedComment = await Comment.updateOne({ _id: _id }, { $set: 
                    {
                        message: message
                    }
                });

                console.log("editComment success");
                return updatedComment;
            }
            catch (err) {
                console.log("editComment failure");
                return { errorMessage: 'editComment ERROR: '+err };
            }
        },
        deleteComment: async (parent, args) => {
            try {
                const { currentUser, _id } = args.input;

                // Validate: Check if current user is author 
                const comment = await Comment.findOne({_id: _id});
                if(comment.author.toString() !== currentUser) { // (If false: cannot delete comment)
                    console.log("deleteComment failure");
                    return { errorMessage: 'deleteComment ERROR: current user is not the author of this comment' };
                }

                // Delete comment data by _id
                const removedComment = await Comment.deleteOne({ _id: _id });

                // Validate if comment with passed _id exists
                if(removedComment.deletedCount === 0) {
                    console.log("deleteComment failure");
                    return { errorMessage: `deleteComment ERROR: comment with _id ${_id} does not exist` };
                }
                console.log("deleteComment success");
                return removedComment;
            }
            catch (err) {
                console.log("deleteComment failure");
                return { errorMessage: 'deleteComment ERROR: '+err };
            }
        },
    }
};

module.exports = { resolvers };