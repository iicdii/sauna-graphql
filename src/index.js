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
    async user(root, args, context, info) {
      try {
        const { db } = context;
        const { id } = args;
        const userSnapshot = await db.collection('users').doc(id).get();
        return userSnapshot.data();
      } catch (e) {
        throw new Error(e);
      }
    }
  },
  Mutation: {
    async addUser(root, args, context, info) {
      try {
        const { db } = context;
        const { username, profileUrl, token } = args;

        const newUserRef = db.collection('users').doc();
        await newUserRef.set({
          id: newUserRef.id,
          username,
          profileUrl,
          token
        });

        const newUserSnapshot = await newUserRef.get();
        return newUserSnapshot.data();
      } catch (e) {
        throw new Error(e);
      }
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