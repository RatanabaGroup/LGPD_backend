const express = require('express');
const bodyParser = require('body-parser');
const { Usuario } = require('./models/usuario');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Usuario
app.post('/usuario/cadastro', async (req, res) => {
    var usuario = new Usuario();

    if (req.body) {
        let data = req.body
        var resultado = await usuario.cadastro(data);
    } else {
        var resultado = await usuario.cadastro(req.body);
    }
    res.send(resultado);
});

// app.get('/armadilha/:uid', async (req, res) => {
//     const { uid } = req.params;
//     var armadilha = new Armadilha();

//     const authHeader = req.headers.authorization
//     var verificacao = new Verificacao()
//     const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

//     if (tokenUid != false) {
//         try {
//             const userRecord = await armadilha.buscarPorUid(uid)
//             res.send(userRecord);
//         } catch (error) {
//             console.error('Erro ao buscar usuário:', error);
//             res.status(500).send("Erro durante o processo de busca.");
//         }
//     } else {
//         res.status(500).send("Nenhum token fornecido.");
//     }
// });

// app.put('/armadilha/:uid', async (req, res) => {
//     const { uid } = req.params;
//     var armadilha = new Armadilha();

//     const authHeader = req.headers.authorization
//     var verificacao = new Verificacao()
//     const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

//     if (tokenUid != false) {
//         try {
//             const userRecord = await armadilha.atualizar(uid, req.body)
//             res.send(userRecord);
//         } catch (error) {
//             console.error('Erro ao atualizar usuário:', error);
//             res.status(500).send("Erro durante o processo de atualização.");
//         }
//     } else {
//         res.status(500).send("Nenhum token fornecido.");
//     }
// });

app.delete('/armadilha/:uid', async (req, res) => {
    const { uid } = req.params;
    var armadilha = new Armadilha();

    await armadilha.excluir(uid)
});

// app.get('/armadilha', async (req, res) => {
//     var armadilha = new Armadilha();

//     const authHeader = req.headers.authorization
//     var verificacao = new Verificacao()
//     const tokenUid = await verificacao.verificarToken(authHeader.split(' ')[1]);

//     if (tokenUid != false) {
//         if (tokenUid == "adm") {
//             try {
//                 const userRecord = await armadilha.buscarTodos();
//                 res.send(userRecord);
//             } catch (error) {
//                 console.error('Erro ao buscar todos os usuários:', error);
//                 res.status(500).send("Erro durante o processo de busca de todos os usuários.");
//             }
//         } else {
//             res.status(500).send("Sem permissão.");
//         }
//     } else {
//         res.status(500).send("Nenhum token fornecido.");
//     }
// });


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`==> Servidor rodando na porta http://localhost:${PORT}      :)`);
});