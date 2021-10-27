const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Type Definitions
    "The user type is used for site authentication"
    type User {
        username: String!
        password: String!
        email: String!
        isAdmin: Boolean!
        _id: String!
    }

    "Used for authenticating user login"
    type LoginResult {
        token: String!
        _id: String!
        username: String!
    }

    "The issue type is used to provide climate issue data and discussion"
    type Issue {
        title: String!
        description: String
        timeCreated: String
        author: String!
        upvotes: Int!
        downvotes: Int!
        totalVotes: Int
        usersUpvoted: [String]
        usersDownvoted: [String]
        _id: String!
    }

    "Used to display updated issue json"
    type Edited {
        acknowledged: Boolean!
        modifiedCount: Int!
        upsertedId: String
        upsertedCount: Int
        matchedCount: Int
    }

    "The comment type is used to provide input on issues"
    type Comment {
        message: String!
        issue: String!
        author: String!
        timeCreated: String
        _id: String!
    }

    type Deleted {
        deletedCount: Int!
    }

    "The error type is used to provide error output"
    type Error {
        errorMessage: String!
    }

    # Results that allow for return of different types
    union UserOrErrorResult = User | Error
    union LoginOrErrorResult = LoginResult | Error
    union IssueOrErrorResult = Issue | Error
    union EditedOrErrorResult = Edited | Error
    union CommentOrErrorResult = Comment | Error
    union DeletedOrErrorResult = Deleted | Error

    # Queries
    type Query {
        getAllUsers: [User!]!
        getUserById(_id: String!): UserOrErrorResult
        getAllIssues: [Issue!]!
        getIssuesByAuthor(author: String!): [Issue]!
        getCommentsByAuthor(author: String!): [Comment]!
        getCommentsByIssue(issue: String!): [Comment]!
    }

    # Mutation input declarations
    # inputs allow for alterations from types and setting of default types 
    input CreateUserInput {
        username: String!
        password: String! 
        email: String! 
        isAdmin: Boolean!
    }

    input RegisterUserInput {
        username: String!
        password: String!
        passwordCheck: String!
        email: String! 
        isAdmin: Boolean = false # sets default value to false if not explicitly declared
    }

    input LoginUserInput {
        username: String!
        password: String! 
    }

    input EditUserInput{
        username: String
        password: String
        email: String
        _id: String!
    }

    input CreateIssueInput {
        title: String!
        description: String
        timeCreated: String
        upvotes: Int! = 0 # sets default value to 0 if not explicitly declared
        downvotes: Int! = 0
        totalVotes: Int
        usersUpvoted: [String]
        usersDownvoted: [String]
        currentUser: String!
    }

    "Does not allow for editing of vote data, timeCreated, or author"
    input EditIssueInput {
        title: String
        description: String
        currentUser: String
        totalVotes: Int
        usersUpvoted: [String]
        usersDownvoted: [String]
        _id: String!
    }

    input DeleteInput {
        currentUser: String!
        _id: String!
    }

    input CreateCommentInput {
        message: String # sets default value to '' if not explicitly declared
        issue: String!
        currentUser: String!
    }

    input EditCommentInput {
        message: String # sets default value to '' if not explicitly declared
        currentUser: String!
        _id: String!
    }

    # Mutations
    type Mutation {
        "createUser is a test mutation"
        createUser(input: CreateUserInput!): User
        # Auth mutations
        "Validates user input and creates a new user if valid"
        registerUser(input: RegisterUserInput!): UserOrErrorResult
        loginUser(input: LoginUserInput!): LoginOrErrorResult
        editUser(input: EditUserInput!): EditedOrErrorResult

        # Issue mutations
        createIssue(input: CreateIssueInput): IssueOrErrorResult
        editIssue(input: EditIssueInput): EditedOrErrorResult
        deleteIssue(input: DeleteInput): DeletedOrErrorResult

        # Comment mutations
        createComment(input: CreateCommentInput): CommentOrErrorResult
        editComment(input: EditCommentInput): EditedOrErrorResult
        deleteComment(input: DeleteInput): DeletedOrErrorResult
    }
`;

module.exports = { typeDefs };