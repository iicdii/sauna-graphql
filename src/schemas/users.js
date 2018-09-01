import schemas from '../schemas';

// language="GraphQL Schema"
schemas.push(`  
  extend type Mutation {
    addUser(
      facebookId: ID!,
      username: String!,
      profileUrl: String!
    ): User! 
  }

  type User {
    id: ID!
    username: String!
    profileUrl: String!
    createdAt: String!
    updatedAt: String!
  }
`);

export const resolvers = {
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
  },
  User: {
    async createdAt(root) {
      return root.createdAt.toMillis()
    },
    async updatedAt(root) {
      return root.updatedAt.toMillis();
    }
  },
};
