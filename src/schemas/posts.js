const schemas = require('../schemas');

// language="GraphQL Schema"
schemas.push(`
  extend type Query {
    posts(offset: Int, limit: Int): [Post]!
  }
  
  extend type Mutation {
    addPost(
      facebookId: ID!
      title: String
      content: [ContentInput]!
    ): Post!
    likePost(
      postId: ID!
      facebookId: ID!
    ): Post!
  }
  
  type Post {
    id: ID!
    user: User!
    title: String
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
`);

const resolvers = {
  Query: {
    async posts(root, args, context, info) {
      let offset = 0;
      let limit = 10;

      if (args.offset) {
        offset = args.offset;
      }

      if (args.limit) {
        limit = args.limit;
      }

      const { db } = context;
      const posts = await db.collection('posts').orderBy('updatedAt', 'desc').offset(offset).limit(limit).get();

      return posts.docs.map(snapshot => snapshot.data());
    }
  },
  Mutation: {
    async addPost(root, args, context, info) {
      const { db, Firestore } = context;
      const { facebookId, title, content } = args;
      const time = Firestore.FieldValue.serverTimestamp();

      try {
        const usersSnapshot = await db.collection('users').where('facebookId', '==', facebookId).get();
        const user = usersSnapshot.docs[0].data();
        const userId = user.id;

        const newPostRef = db.collection('posts').doc();
        await newPostRef.set({
          id: newPostRef.id,
          userId,
          title: title ? title : null,
          content: content.map(item => {
            const { photo, description } = item;

            if (!description) return { photo };

            return {
              photo,
              description,
            }
          }),
          likes: [],
          createdAt: time,
          updatedAt: time,
        });

        const newPostSnapShot = await newPostRef.get();
        return newPostSnapShot.data();
      } catch(e) {
        throw new Error(e);
      }
    },
    async likePost(root, args, context, info) {
      const { db } = context;
      const { facebookId, postId } = args;

      try {
        const postRef = db.collection('posts').doc(postId);
        const postSnapshot = await postRef.get();

        const post = postSnapshot.data();

        if (!post) throw new Error('존재하지 않는 게시물 입니다.');

        const newLikes = [...post.likes];

        if (post.likes.includes(facebookId)) {
          // 좋아요 취소
          const userIndex = newLikes.findIndex(n => n === facebookId);
          newLikes.splice(userIndex, 1);

          postRef.update({ likes: newLikes });
        } else {
          // 좋아요 추가
          newLikes.push(facebookId);
          postRef.update({ likes: newLikes });
        }

        return {
          ...post,
          likes: newLikes,
        };
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Post: {
    async user(root, args, context, info) {
      const { userId } = root;
      const { db } = context;
      const userSnapshot = await db.collection('users').doc(userId).get();
      return userSnapshot.data();
    },
    async createdAt(root) {
      return root.createdAt.toMillis();
    },
    async updatedAt(root) {
      return root.updatedAt.toMillis();
    }
  },
};

module.exports = resolvers;