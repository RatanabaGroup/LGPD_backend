const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('../firebaseAdminConfig.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function restoreData() {
  const users = JSON.parse(fs.readFileSync('./backup/users_backup.json', 'utf8'));

  const batch = db.batch();

  users.forEach((user) => {
    const userRef = db.collection('users').doc(user.id);
    batch.set(userRef, user);
  });

  await batch.commit();
  console.log('Data restored.');
}

restoreData().catch(console.error);
