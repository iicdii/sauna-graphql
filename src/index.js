const { GraphQLServer } = require('graphql-yoga');
const { Firestore, db } = require('./database');

// language="GraphQL Schema"
const typeDefs = `
  type Query {
    user(id: ID!): User!

    # 게시물 조회
    posts: [Post]!
  }

  type Mutation {
    addUser(token: String!, username: String!, profileUrl: String!): User! 
  }

  type User {
    id: ID!
    username: String!
    profileUrl: String!
  }
  
  type Post {
    # 유저 id
    userId: String!
    
    # 좋아요 갯수
    likes: Int!
    
    # 내용
    content: [Content]! 
  }
  
  type Content {
    # 사진 url
    photo: String!
    
    # 설명
    description: String
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
    },
    posts: async (root, args, context, info) => {
      const { db } = context;

      const posts = await db
        .collection('posts')
        .get();

      return posts.docs.map(snapshot =>
        snapshot.data()
      );
    },
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
};

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