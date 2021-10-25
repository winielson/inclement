const { makeExecutableSchema } = require('apollo-server-express');
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');

module.exports = makeExecutableSchema({
	typeDefs: typeDefs,
	resolvers: resolvers
});