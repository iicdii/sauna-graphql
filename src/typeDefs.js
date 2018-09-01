// language="GraphQL Schema"
const typeDefs = `
  type Query {
    user(id: ID!): User!
    posts(offset: Int!, limit: Int!): [Post]!
  }

  type Mutation {
    addUser(token: ID!, username: String!, profileUrl: String!): User! 
    addPost(
      userId: ID!
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
    id: ID!
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
