const { GraphQLServer } = require('graphql-yoga');
const { Firestore, db } = require('./database');

const typeDefs = `
  type Query {
    greet: String!
  }
`;

const resolvers = {
  Query: {
    greet: (root, args, context, info) => {
      const { db } = context;
      return 'Hello from the world!'
    }
  }
}

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