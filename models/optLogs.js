const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

class OptLogs {
  async cadastro(data) {
    const { user_id, opt_id, status, data_alteracao } = data;

    const db = admin.firestore();

    try {
      const docRef = await db.collection('optLogs').add({
        user_id: user_id,
        opt_id: opt_id,
        status: status,
        data_alteracao: data_alteracao
          });
      console.log('Documento escrito com ID:', docRef.id);
    } catch (error) {
      console.error('Erro ao adicionar documento:', error.message);
    }
  };

  async ler(docId) {
    const db = admin.firestore();
    try {
      const doc = await db.collection('optLogs').doc(docId).get();
      if (doc.exists) {
        console.log('Documento encontrado:', doc.data());
        return doc.data();
      } else {
        console.log('Nenhum documento encontrado com o ID fornecido.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao ler documento:', error.message);
    }
  }

  async lerTodos() {
    const db = admin.firestore();
    try {
      const docs = await db.collection('optLogs').get();
      if (!docs.empty) {
        return docs;
      } else {
        console.log('Nenhum documento encontrado.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao ler documento:', error.message);
    }
  }

  async lerTodosUser(userId) {
    const db = admin.firestore();
    try {
      const docs = await db.collection('optLogs').get();
      if (!docs.empty) {
        let opts = [];
        docs.forEach(doc => {
            if (doc.data().user_id == userId) {
                opts.push(doc.data());
            }
        });
        return opts;
      } else {
        console.log('Nenhum documento encontrado.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao ler documento:', error.message);
    }
  }

  async lerTodosOpts(optId) {
    const db = admin.firestore();
    try {
      const docs = await db.collection('optLogs').get();
      if (!docs.empty) {
        let opts = [];
        docs.forEach(doc => {
            if (doc.data().opt_id == optId) {
                opts.push(doc.data());
            }
        });
        return opts;
      } else {
        console.log('Nenhum documento encontrado.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao ler documento:', error.message);
    }
  }

  async atualizar(docId, data) {
    const db = admin.firestore();
    try {
        const { user_id, opt_id, status, data_alteracao } = data;
        const db = admin.firestore();
        data.data_alteracao = new Date();
        await db.collection('optLogs').doc(docId).update(data);
        console.log('Documento atualizado com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar documento:', error.message);
    }
  }
}



module.exports = {
  OptLogs: OptLogs
};