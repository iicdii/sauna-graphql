// language="GraphQL Schema"
const typeDefs = `
  type Query {
    posts(offset: Int, limit: Int): [Post]!
  }

  type Mutation {
    addUser(
      facebookId: ID!,
      username: String!,
      profileUrl: String!
    ): User! 
    addPost(
      userId: ID!
      title: String!
      content: [ContentInput]!
    ): Post!
    likePost(
      postId: ID!
      userId: ID!
    ): Post!
  }

  type User {
    id: ID!
    username: String!
    profileUrl: String!
    createdAt: String!
    updatedAt: String!
  }
  
  type Post {
    id: ID!
    user: User!
    title: String!
    likes: [String]!
    content: [Content]!
    createdAt: String!
    updatedAt: String!
  }
  
  type Content {
    photo: String!
    description: String
  }
  
  input ContentInput {
    photo: String!
    description: String
  }
`;

module.exports = typeDefs;
