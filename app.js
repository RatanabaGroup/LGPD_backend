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

app.get('/usuario/selecionar/:value', async (req, res) => {
  var usuario = new Usuario();
  const { value } = req.params;

  try {
      var resultado = await usuario.selecionar(value);
  } catch (error) {
      console.error("Erro ao selecionar dados do usuário!")
  }
  res.send(resultado);
});

app.put('/usuario/atualizar', async (req, res) => {
  const userData = req.body;
  const usuario = new Usuario();
  
  try {
    const userId = await usuario.atualizar(userData);
    res.status(200).json({ data: userId });
  } catch (error) {
    res.status(500).send({ error: 'Erro ao adicionar informações'});
  }
});

app.put('/usuario/atualizar/completo', async (req, res) => {
  const userData = req.body;
  const usuario = new Usuario();
  
  try {
    const id = await usuario.atualizarCompleto(userData);
    res.status(200).json({ mensagem: "usuario atualizado"});
  } catch (error) {
    res.status(500).send({ error: 'Erro ao adicionar informações'});
  }
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