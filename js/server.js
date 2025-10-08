// server.js
const express = require('express');
const app = express();
const port = 3000; // A porta que nosso servidor vai usar

// Uma rota de teste
app.get('/', (req, res) => {
  res.send('Meu servidor está funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});