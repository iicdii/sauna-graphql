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
    },
    addPost: async (root, args, context, info) => {
      const { db } = context;
      const { userId, content } = args;

      const user = await db
        .collection('users')
        .doc(userId)
        .get();

      if (!user) throw new Error('유저가 존재하지 않습니다');

      const { username, profileImg } = user;

      const newPostRef = db.collection('posts');

      await newPostRef.set({
        userId,
        username,
        profileImg,
        content,
        likes: [],
      });

      const newPost = newPostRef.get();
      return newPost.data();
    }
  }
};

module.exports = resolvers;
