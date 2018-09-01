const { GraphQLServer } = require('graphql-yoga');
const { Firestore, db } = require('./database');

// language="GraphQL Schema"
const typeDefs = `
  type Query {
    # 게시물 조회
    posts: [Post]!
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
    posts: async (root, args, context, info) => {
      const { db } = context;

      const posts = await db
        .collection('posts')
        .get();

      return posts.docs.map(snapshot =>
        snapshot.data()
      );
    },
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
