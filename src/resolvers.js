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
    async addPost(root, args, context, info) {
      const { db } = context;
      const { userId, content } = args;

      const user = await db
        .collection('users')
        .doc(userId)
        .get();

      if (!user) throw new Error('유저가 존재하지 않습니다');

      const { username, profileUrl } = user.data();

      try {
        const newPostRef = db.collection('posts').doc();
        await newPostRef.set({
          id: newPostRef.id,
          userId,
          username,
          profileUrl,
          content: content.map(item => {
            const { photo, description } = item;
            return {
              photo,
              description,
            }
          }),
          likes: [],
        });

        const newPostSnapShot = await newPostRef.get();
        console.log(newPostSnapShot.data());
        return newPostSnapShot.data();
      } catch(e) {
        throw new Error(e);
      }
    }
  }
};

module.exports = resolvers;
