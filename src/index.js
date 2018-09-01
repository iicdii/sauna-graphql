const { GraphQLServer } = require('graphql-yoga');
const merge = require('lodash/merge');
const { Firestore, db } = require('./database');

const postsResolvers = require('./schemas/posts').resolvers;
const usersResolvers = require('./schemas/users').resolvers;

const schemas = require('./schemas');

// language="GraphQL Schema"
const rootSchema = `
  # 데이터 조회
  type Query {
    # 서버 날짜 조회
    currentDate: String!
  }
  
  # 데이터 변경
  type Mutation {
    # TODO: 임시 데이터
    updateCurrentTime: Float
  }
  
  schema {
    query: Query
    mutation: Mutation
  }
`;

const rootResolvers = {
  Query: {
    currentDate: () => Date.now(),
  },
  Mutation: {
    updateCurrentTime: () => Date.now(),
  },
};

const schema = [...schemas, rootSchema];

const resolvers = merge(
  postsResolvers,
  usersResolvers,
);

const server = new GraphQLServer({
  typeDefs: schema,
  resolvers,
  context: data => ({
    ...data,
    Firestore,
    db,
  }),
});

server.start(() => console.log('Server is running!'));
