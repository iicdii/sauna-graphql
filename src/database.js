const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sauna-b0fc9.firebaseio.com'
});

const Firestore = admin.firestore;
const db = Firestore();
db.settings({
  timestampsInSnapshots: true
});

module.exports = {
  Firestore,
  db,
}