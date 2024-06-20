const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

class Usuario {
  async cadastro(data) {
    const { nome, email} = data;

    const db = admin.firestore();

    try {
      const docRef = await db.collection('users').add({
        nome: nome,
        email: email
      });
      res.status(200).json({ userId: docRef.uid });
    } catch (error) {
      console.error('Erro ao adicionar documento:', error.message);
    }
  };

  async selecionar(email) {
    const db = admin.firestore();
    try {
      const snapshot = await db.collection('users').where('email', '==', email).get();
  
      if (snapshot.empty) {
        return null; 
      }
  
      return snapshot.docs[0].data();
  
    } catch (error) {
      console.error("Erro selecionando usuario: ", error.message);
      throw error; 
    }
  }
  

  async atualizar(userData) {
    const { email, dataNascimento, telefone, endereco } = userData;

    const db = admin.firestore();

    try {
    
    const snapshot = await db.collection('users').where('email', '==', email).get();

    if (snapshot.empty) {
      return null;
    }

    let userId;
    snapshot.forEach(doc => {
      userId = doc.id;
    });

    const userRef = db.collection('users').doc(userId);

    await userRef.update({
        dataNascimento: dataNascimento,
        telefone: telefone,
        endereco: endereco
      });

    console.log(`Usuário atualizado`);
    return userId
    } catch (error) {
      console.error("Erro atualizando usuario: ", error.message);
    }
  }  


  async atualizarCompleto(userData) {
    const { userId, nome, email, emailNovo, dataNascimento, telefone, endereco } = userData;

    const db = admin.firestore();

    try {
    
    const snapshot = await db.collection('users').where('email', '==', email).get();

    if (snapshot.empty) {
      return null;
    }

    let id;
    snapshot.forEach(doc => {
      id = doc.id;
    });

    const userRef = db.collection('users').doc(id);

    await userRef.update({
        nome: nome,
        email: emailNovo,
        dataNascimento: dataNascimento,
        telefone: telefone,
        endereco: endereco
      });

    await admin.auth().updateUser(userId, {
        email: emailNovo
      });


    return id
    } catch (error) {
      console.error("Erro atualizando usuario: ", error.message);
    }
  }  
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