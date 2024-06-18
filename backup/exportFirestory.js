const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('../firebaseAdminConfig.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportData() {
  const usersSnapshot = await db.collection('users').get();
  const users = [];

  usersSnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });

  fs.writeFileSync('./backup/users_backup.json', JSON.stringify(users, null, 2));

  console.log('Backup completed.');
}

exportData().catch(console.error);
