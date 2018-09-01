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
    async posts(root, args, context, info) {
      const { db } = context;
      const posts = await db.collection('posts').get();

      return posts.docs.map(snapshot => snapshot.data());
    }
  },
  Mutation: {
    async addUser(root, args, context, info) {
      try {
        const { db, Firestore } = context;
        const { username, profileUrl, token } = args;
        const time = Firestore.FieldValue.serverTimestamp();

        const newUserRef = db.collection('users').doc();
        await newUserRef.set({
          id: newUserRef.id,
          username,
          profileUrl,
          token,
          createdAt: time,
          updatedAt: time,
        });

        const newUserSnapshot = await newUserRef.get();
        return newUserSnapshot.data();
      } catch (e) {
        throw new Error(e);
      }
    },
    async addPost(root, args, context, info) {
      const { db, Firestore } = context;
      const { userId, content } = args;
      const time = Firestore.FieldValue.serverTimestamp();

      try {
        const newPostRef = db.collection('posts').doc();
        await newPostRef.set({
          id: newPostRef.id,
          userId,
          content: content.map(item => {
            const { photo, description } = item;
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
    }
  },
  User: {
    async createdAt(root) {
      return root.createdAt.toMillis()
    },
    async updatedAt(root) {
      return root.updatedAt.toMillis();
    }
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
