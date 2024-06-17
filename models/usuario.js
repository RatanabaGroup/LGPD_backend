const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

class Usuario {
    async cadastro(data) {
        const {nome, email} = data;
        
        const db = admin.firestore();

        try {
          const docRef = await db.collection('Usuario').add({
            nome: nome,
            email: email
          });
          console.log('Documento escrito com ID:', docRef.id);
        } catch (error) {
          console.error('Erro ao adicionar documento:', error.message);
        }
      };

    // Função para atualizar os detalhes da armadilha
    // atualizar(armadilhaId, novosDados) {
    //     return new Promise((resolve, reject) => {
    //         const db = admin.firestore();

    //         db.collection('Armadilha').doc(armadilhaId).update(novosDados)
    //             .then(() => {
    //                 resolve('Armadilha atualizada com sucesso.');
    //             })
    //             .catch(error => {
    //                 console.error('Erro ao atualizar armadilha:', error);
    //                 reject('Erro ao atualizar armadilha.');
    //             });
    //     });
    // }

    // // Função para obter os detalhes da armadilha
    // buscarPorUid(armadilhaId) {
    //     return new Promise((resolve, reject) => {
    //         const db = admin.firestore();

    //         db.collection('Armadilha').doc(armadilhaId).get()
    //             .then(armadilhaDoc => {
    //                 if (!armadilhaDoc.exists) {
    //                     reject('Armadilha não encontrada.');
    //                     return;
    //                 }

    //                 resolve(armadilhaDoc.data());
    //             })
    //             .catch(error => {
    //                 console.error('Erro ao obter detalhes da armadilha:', error);
    //                 reject('Erro ao obter detalhes da armadilha.');
    //             });
    //     });
    // }

    // // Função para excluir uma armadilha
    // excluir(armadilhaId) {
    //     return new Promise((resolve, reject) => {
    //         const db = admin.firestore();

    //         // Primeiro, exclua a armadilha.
    //         db.collection('Armadilha').doc(armadilhaId).delete()
    //             .then(() => {
    //                 // Busca todos os talhões que contêm o ID da armadilha em seu array.
    //                 return db.collection('Talhao').where('armadilhaId', 'array-contains', armadilhaId).get();
    //             })
    //             .then(querySnapshot => {
    //                 // Cria uma lista de promessas para atualizar cada talhão.
    //                 const updatePromises = [];
    //                 querySnapshot.forEach(doc => {
    //                     // Remove o ID da armadilha do array 'armadilhaId'.
    //                     const updatedArmadilhaIds = doc.data().armadilhaId.filter(id => id !== armadilhaId);
    //                     updatePromises.push(doc.ref.update({ armadilhaId: updatedArmadilhaIds }));
    //                 });
    //                 // Espera todas as atualizações serem concluídas.
    //                 return Promise.all(updatePromises);
    //             })
    //             .then(() => {
    //                 resolve('Armadilha excluída com sucesso e referências atualizadas.');
    //             })
    //             .catch(error => {
    //                 console.error('Erro ao excluir armadilha ou atualizar talhões:', error);
    //                 reject('Erro ao excluir armadilha ou atualizar talhões.');
    //             });
    //     });
    // }

    // // Função para obter todas as armadilhas
    // buscarTodos() {
    //     return new Promise((resolve, reject) => {
    //         const db = admin.firestore();
    //         db.collection('Armadilha').get()
    //             .then(snapshot => {
    //                 if (snapshot.empty) {
    //                     resolve('Nenhuma armadilha encontrada.');
    //                     return;
    //                 }
    //                 let armadilhas = [];
    //                 snapshot.forEach(doc => armadilhas.push({ id: doc.id, ...doc.data() }));
    //                 resolve(armadilhas);
    //             })
    //             .catch(error => {
    //                 console.error('Erro ao buscar todas as armadilhas:', error);
    //                 reject('Erro ao buscar armadilhas.');
    //             });
    //     });
    // }

}

module.exports = {
    Usuario: Usuario
};