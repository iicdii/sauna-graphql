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

module.exports = typeDefs;