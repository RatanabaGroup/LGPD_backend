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

app.delete('/usuario/:uid', async (req, res) => {
    const { uid } = req.params;
    const usuario = new Usuario();
    
    try {
      await usuario.deleteUserAndAnonymizeData(uid);
      res.status(200).send({ message: `Dados do usuário ${uid} anonimizados com sucesso` });
    } catch (error) {
      res.status(500).send({ error: 'Erro ao excluir e anonimizar usuário', details: error.message });
    }
  });



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`==> Servidor rodando na porta http://localhost:${PORT}      :)`);
});