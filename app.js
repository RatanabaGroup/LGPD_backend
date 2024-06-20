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
    const opts = await db.collection('opts').get();
    opts.forEach(async opt => {
      try {
        const logRef = await db.collection('optLogs').add({
          opt_id: opt.id,
          user_id: resultado.id,
          status: false,
          data_alteracao: new Date()
        });
        console.log('log escrito com ID:', logRef.id);
      } catch (error) {
        console.error('Erro ao adicionar log:', error.message);
      }
    });
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


app.post('/criarOpt', async (req, res) => {
  var opt = new Opt();
  console.log(req.body)
  if (req.body) {
    let data = req.body
    var resultado = await opt.cadastro(data);
  } else {
    var resultado = await opt.cadastro(req.body);
  }
  res.send(resultado);
});

app.get('/ler/:docId', async (req, res) => {
  var opt = new Opt();
  try {
    const data = await opt.ler(req.params.docId);
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send('Documento não encontrado.');
    }
  } catch (error) {
    res.status(500).send('Erro ao ler documento: ' + error.message);
  }
});


app.put('/atualizar/:docId', async (req, res) => {
  var opt = new Opt();
  try {
    await opt.atualizar(req.params.docId, req.body);
    res.status(200).send('Documento atualizado com sucesso.');
  } catch (error) {
    res.status(500).send('Erro ao atualizar documento: ' + error.message);
  }
});

app.post('/criarLog', async (req, res) => {
  var optLogs = new OptLogs();
  try {
    await optLogs.cadastro(req.body);
    res.status(200).send('Cadastro realizado com sucesso.');
  } catch (error) {
    res.status(500).send('Erro ao realizar cadastro: ' + error.message);
  }
});

app.get('/lerLog/:docId', async (req, res) => {
  var optLogs = new OptLogs();
  try {
    const data = await optLogs.ler(req.params.docId);
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send('Documento não encontrado.');
    }
  } catch (error) {
    res.status(500).send('Erro ao ler documento: ' + error.message);
  }
});

app.get('/Logs', async (req, res) => {
  var optLogs = new OptLogs();
  try {
    const docs = await optLogs.lerTodos();
    if (docs) {
      res.status(200).send(docs.docs.map(doc => doc.data()));
    } else {
      res.status(404).send('Nenhum documento encontrado.');
    }
  } catch (error) {
    res.status(500).send('Erro ao ler documentos: ' + error.message);
  }
});

app.get('/userLogs/:userId', async (req, res) => {
  var optLogs = new OptLogs();
  try {
    const docs = await optLogs.lerTodosUser(req.params.userId);
    if (docs) {
      res.status(200).send(docs);
    } else {
      res.status(404).send('Nenhum documento encontrado.');
    }
  } catch (error) {
    res.status(500).send('Erro ao ler documentos: ' + error.message);
  }
});

app.get('/optLogs/:optId', async (req, res) => {
  var optLogs = new OptLogs();
  try {
    const docs = await optLogs.lerTodosOpts(req.params.optId);
    if (docs) {
      res.status(200).send(docs);
    } else {
      res.status(404).send('Nenhum documento encontrado.');
    }
  } catch (error) {
    res.status(500).send('Erro ao ler documentos: ' + error.message);
  }
});

app.put('/atualizarStatus/:docId', async (req, res) => {
  var optLogs = new OptLogs();
  try {
    await optLogs.atualizar(req.params.docId, req.body);
    res.status(200).send('Documento atualizado com sucesso.');
  } catch (error) {
    res.status(500).send('Erro ao atualizar documento: ' + error.message);
  }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`==> Servidor rodando na porta http://localhost:${PORT}      :)`);
});