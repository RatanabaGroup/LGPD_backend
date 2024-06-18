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

    // Verifique se o documento existe
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.log(`No document found for user ${userId}`);
      continue; // Pula para o próximo usuário na lista
    }

    // Anonimizar dados no backup restaurado
    await userRef.update({
      nome: 'Anonimizado',
      email: `anonimizado${userId}@example.com`,
    });

    // await batch.commit();
    console.log(`Backup data for user ${userId} anonymized`);
  }
}

// Execute a função de monitoramento periodicamente
setInterval(monitorAndAnonymize, 60000); // Verifica a cada minuto
