// test.js

// Uses chai assertion module to test Express Route API's

// import dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
require('dotenv/config');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Express.js API authentication routes testing', () => {
    // Testing for get requests
    describe('Login', () => { 
        // Success tests
        describe('Successful POST request for the user login', () => {
            it('should respond with json object with a token and userData, given a valid username and password', (done) => {
                // Setup mock body
                const body =  {
                    username: process.env.VALID_USERNAME,
                    password: process.env.VALID_PASSWORD
                }
    
                chai.request(app)
                    .post('/users/login')
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('token');
                        res.body.should.have.property('user');
                        done();
                    });
            });
        });

        // Failure tests
        describe('Unsuccessful POST requests for the user login', () => {
            // Request body username and password are empty
            it('should respond with error, when username and password are empty', (done) => {
                // Setup mock body
                const body =  {
                    username: '',
                    password: ''
                }
    
                chai.request(app)
                    .post('/users/login')
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.should.have.property('message', 'Username and password must be filled.');
                        done();
                    });
            });

            // Request body username does not match any
            it('should respond with error, when username does not exist in db', (done) => {
                // Setup mock body
                const body =  {
                    username: 'nonX',
                    password: 'fdsfds'
                }
    
                chai.request(app)
                    .post('/users/login')
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.should.have.property('message', 'An account with this username does not exist.');
                        done();
                    });
            });

            // Request body password is incorrect
            it('should respond with error, when password is incorrect', (done) => {
                // Setup mock body
                const body =  {
                    username: process.env.VALID_USERNAME,
                    password: 'fdsfds'
                }
    
                chai.request(app)
                    .post('/users/login')
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.should.have.property('message', "Incorrect password.");
                        done();
                    });
            });
        });
    });
});

