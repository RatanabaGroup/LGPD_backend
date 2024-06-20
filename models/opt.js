const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminConfig.json');

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

class Opt {
    async cadastro(data) {
        const { versao, data_efetiva, conteudo } = data;
        const db = admin.firestore();
        try {
            const docRef = await db.collection('opts').add({
                versao: versao,
                data_efetiva: new Date(),
                conteudo: conteudo
            });
            console.log('Documento escrito com ID:', docRef.id);
            const users = await db.collection('users').get();
            users.forEach(async user => {
                try {
                    const logRef = await db.collection('optLogs').add({
                        user_id: user.id,
                        opt_id: docRef.id,
                        status: false,
                        data_alteracao: new Date()
                    });
                    console.log('log escrito com ID:', logRef.id);
                } catch (error) {
                    console.error('Erro ao adicionar log:', error.message);
                }
            });
        } catch (error) {
            console.error('Erro ao adicionar documento:', error.message);
        }
    };

    async ler(docId) {
    const db = admin.firestore();

        try {
            const doc = await db.collection('opts').doc(docId).get();
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

    async atualizar(docId, data) {
    const db = admin.firestore();

        try {
            const { versao, data_efetiva, conteudo } = data;
            const db = admin.firestore();
            const logs = await db.collection('optLogs').get()
            logs.forEach(async log => {
                if (log.data().opt_id == docId) {
                    let attLog = {status: "", data_alteracao: ""}
                    attLog.status = false;
                    attLog.data_alteracao = new Date();
                    await db.collection('optLogs').doc(log.id).update(attLog);
                };
            });
            data.data_efetiva = new Date();
            await db.collection('opts').doc(docId).update(data);
            console.log('Documento atualizado com sucesso.');
        } catch (error) {
            console.error('Erro ao atualizar documento:', error.message);
        }
    }
}

module.exports = {
    Opt: Opt
};