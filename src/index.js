const { GraphQLServer } = require('graphql-yoga');
const { Firestore, db } = require('./database');

const typeDefs = `
  type Query {
    user(id: ID!): User!
  }

  type Mutation {
    addUser(token: String!, username: String!, profileUrl: String!): User! 
  }

  type User {
    id: ID!
    username: String!
    profileUrl: String!
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