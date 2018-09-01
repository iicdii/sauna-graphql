const { GraphQLServer } = require('graphql-yoga');
const { Firestore, db } = require('./database');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: (data) => ({
    ...data,
    Firestore,
    db,
  }),
});
server.start(() => console.log('Server is running!'));
