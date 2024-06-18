const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

class Usuario {
  async cadastro(data) {
    const { nome, email } = data;

    const db = admin.firestore();

    try {
      const docRef = await db.collection('users').add({
        nome: nome,
        email: email
      });
      console.log('Documento escrito com ID:', docRef.id);
    } catch (error) {
      console.error('Erro ao adicionar documento:', error.message);
    }
  };

  async addUserToExclusionList(userId) {
    const db = admin.firestore();
    
    try {
      await db.collection('exclusion_list').doc(userId).set({
        exclusionDate: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`User ${userId} added to exclusion list`);
    } catch (error) {
      console.error("Error adding user to exclusion list: ", error.message);
    }
  }

  async deleteUserAndAnonymizeData(userId) {
    
    const db = admin.firestore();

    try {
      // Adicionar o usuário à lista de exclusão
      await this.addUserToExclusionList(userId);

      const userRef = db.collection('users').doc(userId);

      // Excluir ou anonimizar dados na coleção 'users'
      await userRef.update({
        nome: 'Anonimizado',
        email: `anonimizado${userId}@example.com`
      });

      console.log(`Data for user ${userId} anonymized`);
    } catch (error) {
      console.error("Error deleting or anonymizing user data: ", error.message);
    }
  }  
}

module.exports = {
  Usuario: Usuario
};