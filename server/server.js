// server.js

// Sets up middleware for server, establishes connection to db, and starts apollo-express-server

// import modules
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');

// import GraphQL typeDefs and resolvers
const routes = require('./routes/index')
const { typeDefs } = require('./schema/typeDefs');
const { resolvers } = require('./schema/resolvers');

// Instantiate express
const app = express();

// Set port
const PORT = 4000;

// Setup express app middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Register routes in app
app.use('/', routes);

// Create and start apollo server
let server = null;
async function startServer() {
    // Create and assign typeDefs and resolvers to apollo server
    server = new ApolloServer({
        typeDefs,
        resolvers
    });
    await server.start(); // start server
    server.applyMiddleware({ app }); // apply express server
}

startServer();

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION).
catch(error => handleError(error));

// Set up server listener
app.listen(PORT, () => {
    console.log('Listening on port: '+PORT);
});

module.exports = app; // Export the app to be used for testing