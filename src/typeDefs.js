// language="GraphQL Schema"
const typeDefs = `
  type Query {
    user(id: ID!): User!
    posts: [Post]!
  }

  type Mutation {
    addUser(token: String!, username: String!, profileUrl: String!): User! 
    addPost(
      userId: String!
      content: [ContentInput]!
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
    id: String!
    user: User!
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
