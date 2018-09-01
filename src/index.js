const { GraphQLServer } = require('graphql-yoga');

const typeDefs = `
  type Query {
    greet: String!
  }
`;

const resolvers = {
  Query: {
    greet: () => 'Hello from the world!'
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});
server.start(() => console.log('Server is running!'));