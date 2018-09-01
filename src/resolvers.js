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
    async addUser(root, args, context, info) {
      try {
        const { db, Firestore } = context;
        const { facebookId, username, profileUrl } = args;

        const usersSnapshot =  await db.collection('users').where('facebookId', '==', facebookId).get();
        if (!usersSnapshot.size) {
          const time = Firestore.FieldValue.serverTimestamp();
          const newUserRef = db.collection('users').doc();
          await newUserRef.set({
            id: newUserRef.id,
            username,
            profileUrl,
            facebookId,
            createdAt: time,
            updatedAt: time,
          });

          const newUserSnapshot = await newUserRef.get();
          return newUserSnapshot.data();
        } else {
          return usersSnapshot.docs[0].data();
        }

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
      const { userId, postId } = args;

      try {
        const postRef = db.collection('posts').doc(postId);
        const postSnapshot = await postRef.get();

        const post = postSnapshot.data();

        if (!post) throw new Error('존재하지 않는 게시물 입니다.');

        const newLikes = [...post.likes];

        if (post.likes.includes(userId)) {
          // 좋아요 취소
          const userIndex = newLikes.findIndex(n => n === userId);
          newLikes.splice(userIndex, 1);

          postRef.update({ likes: newLikes });
        } else {
          // 좋아요 추가
          newLikes.push(userId);
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
