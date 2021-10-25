// index.js

// Assign the routes to each path

// import modules and route controllers
const { Router } = require('express')
const UserController = require("../controllers/userController");
const auth = require("../middleware/auth");
const User = require('../models/User') // import user model

// Init and assign express router
const routes = Router();

// Assign route path with controller methods
routes.get('/users/:_id', UserController.getSingleUser);
routes.post('/newUser', UserController.postSingleUser);
routes.post('/users/register', UserController.registerUser);
routes.post('/users/login', UserController.loginUser);
routes.post('/users/validateToken', UserController.tokenCheck);
routes.put('/users/:_id', UserController.updateSingleUser);
routes.delete('/users/:_id', UserController.deleteSingleUser);

// Route to authenticate and retrieve current user data
// TODO: Move to UserController.js or remove and use GraphQL instead
routes.get("/users", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        username: user.username,
        id: user._id,
    });
});

module.exports = routes; // export routes to be used in server.js