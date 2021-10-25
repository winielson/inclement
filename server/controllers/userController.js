// userController.js

// Create user class with methods for each route requests

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const auth = require('../middleware/auth')
const User = require('../models/User') // import user model

// Set up controller for our routes file to use
class UserController {
    // Register new user
    static registerUser = async (req, res) => {
        try {
            let { username, email, password, passwordCheck, isAdmin } = req.body; // extract values from body object

            // Validation
            // Validate: all fields are filled
            if (!username || !email || !password || !passwordCheck) {
                return res.status(400).json({ message: "Not all fields are filled." });
            }

            // Validate: pword is larger than 5 characters
            if (password.length < 5) {
                return res.status(400).json({ message: "Password needs to be at least 5 characters." });
            }

            // Validate: pword and pwordCheck match
            if (password !== passwordCheck) {
                return res.status(400).json({ message: "Entered passwords do not match." });
            }

            // Validate: check if user already exists
            const existingUser = await User.findOne({ username: username });

            if (existingUser) {
                return res.status(400).json({ message: "An account with this username already exists." });
            }

            // Validate: check if admin
            if (!isAdmin) {
                isAdmin = false;
            } 

            // Salt and hash pword using bcrypt
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = new User({
                username: username,
                email: email,
                password: passwordHash,
                isAdmin: isAdmin
            })

            const savedUser = await newUser.save();
            
            res.json(savedUser);
        }
        catch(err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Login 
    static loginUser = async (req, res) => {
        try {
            const { username, password } = req.body;

            // Validation
            // Validate: All required fields are in request
            if (!username || !password) {
                return res.status(400).json({ message: "Username and password must be filled." });
            }

            // Validate: User exists
            const user = await User.findOne({ username: username });

            if (!user) {
                return res.status(400).json({ message: "An account with this username does not exist." });
            }

            // Validate: Password matches with db
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect password." });
            }

            // Create jwt to authenticate user
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

            res.status(200).json({ 
                token, 
                user: {
                    id: user._id,
                    username: user.username
                }
            });
        }
        catch (err) {
            res.status(500).json({ error: 'Error'+err.message });
        }
    }

    // Check if token is valid
    static tokenCheck = async (req, res) => {
        try {
            const token = req.header('x-auth-token');

            // Validation
            // Validate: token is in header
            if(!token) {
                return res.json(false);
            } 

            // Validate: verify token
            const verified = jwt.verify(token, process.env.JWT_SECRET);

            if(!verified) {
                return res.json(false);
            }

            // Validate: user _id exists
            const user = await User.findById(verified._id);

            if(!user) {
                return res.json(false);
            }

            // Return true if not stopped by any conditions
            return res.json(true);

        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // static getAuthUser = async (req, res) => {
    //     try {
    //         const users = await User.find();
    //         res.json(users);
    //     }
    //     catch(err) {
    //         res.status(500).json({ message: err });
    //     }
    // }


    // Get all users
    static getAllUsers = async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        }
        catch(err) {
            res.status(500).json({ message: err });
        }
    }

    // Get a single user
    static getSingleUser = async (req, res) => {
        try {
            const user = await User.findById(req.user);
            res.json({
                username: user.username,
                id: user._id
            });
        }
        catch(err) {
            res.json({ message: err });
        }
    }

    // Adds a single user object by passing object to body
    static postSingleUser = async (req, res) => {
        // Create and assign the new User using schema
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            admin: req.body.admin
        })

        try {
            const savedUser = await user.save();
            res.json(savedUser);
        }
        catch(err) {
            res.json({ message: err });
        }

        console.log('postSingleUser success');
    }

    // Update description of one user
    static updateSingleUser = async (req, res) => {
        try {
            const updatedUser = await User.updateOne({ _id: req.params._id }, { $set: 
                {
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    admin: req.body.admin
                }
            });
            res.json(updatedUser);
        }
        catch(err) {
            res.json({ message: err, req: req.params });
        }
    }

    // Delete a single user by id
    static deleteSingleUser = async (req, res) => {
        try {
            const removedUser = await User.deleteOne({ _id: req.params._id });
            res.json(removedUser);
        }
        catch(err) {
            res.json({ message: err });
        }        
    }
}

module.exports = UserController; // export class to be used in routing (/routes/index.js)