const admin = require('firebase-admin');
const serviceAccount = require('./firebaseAdminConfig.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function monitorAndAnonymize() {
  const exclusionListSnapshot = await db.collection('exclusion_list').get();
  const userIds = exclusionListSnapshot.docs.map(doc => doc.id);

  for (const userId of userIds) {
    const userRef = db.collection('users').doc(userId);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.log(`No document found for user ${userId}`);
      continue; 
    }

    await userRef.update({
      nome: 'Anonimizado',
      email: 'Anonimizado@anonimizado.com',
      dataNascimento: 'Anonimizado',
      endereco: 'Anonimizado',
      telefone: 'Anonimizado'
    });

    const user = await db.collection('users').doc(userId).get();

    try {
      const userRecord = await admin.auth().getUserByEmail(user.data().email);
      const uid = userRecord.uid;

      await admin.auth().deleteUser(uid);

      console.log(`Backup data for user ${userId} anonymized`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`No Firebase Auth user record found for user ${userId}`);
      } else {
        console.error(`Error fetching or deleting user ${userId}:`, error);
      }
    }
  }
}

setInterval(monitorAndAnonymize, 5000);
