const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// --- Middlewares ---
app.use(cors()); // Habilita o CORS para evitar erros de comunicação
app.use(express.json()); // Habilita o servidor a entender JSON vindo do front-end
app.use(express.static(__dirname)); // Habilita o servidor a entregar arquivos estáticos (index.html, css, js, imgs)

const produtosFilePath = path.join(__dirname, 'produtos.json');

// --- ROTAS DA API ---

// ROTA PARA OBTER TODOS OS PRODUTOS (GET)
app.get('/api/produtos', (req, res) => {
    fs.readFile(produtosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo produtos.json na rota GET:', err);
            return res.status(500).send('Erro ao ler o arquivo de produtos.');
        }
        try {
            res.json(JSON.parse(data));
        } catch (parseErr) {
            console.error('Erro ao fazer o parse do JSON:', parseErr);
            return res.status(500).send('Erro no formato do arquivo de produtos.');
        }
    });
});

// ROTA PARA ADICIONAR UM NOVO PRODUTO (POST) com depuração
app.post('/api/produtos', (req, res) => {
    console.log('1. Rota POST /api/produtos foi acionada!'); // Migalha 1

    const novoProduto = req.body;
    console.log('2. Dados recebidos do formulário:', novoProduto); // Migalha 2

    // Verifica se o corpo da requisição está vazio
    if (!novoProduto || Object.keys(novoProduto).length === 0) {
        console.error('Erro: Nenhum dado foi recebido no corpo da requisição.');
        return res.status(400).send('Erro: Nenhum dado recebido.');
    }

    fs.readFile(produtosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo produtos.json na rota POST:', err);
            return res.status(500).send('Erro ao ler o arquivo de produtos.');
        }
        
        console.log('3. Arquivo produtos.json lido com sucesso.'); // Migalha 3
        const produtos = JSON.parse(data);
        
        // Gera um novo ID único
        novoProduto.id = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
        produtos.push(novoProduto);

        fs.writeFile(produtosFilePath, JSON.stringify(produtos, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo produtos.json:', err);
                return res.status(500).send('Erro ao salvar o produto.');
            }
            
            console.log('4. Novo produto salvo com sucesso no produtos.json!'); // Migalha 4
            
            // Envia a resposta de volta para o navegador
            res.status(201).json(novoProduto);
        });
    });
});

// --- Inicia o Servidor ---
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('Acesse seu cardápio nesta URL. Use a página admin.html para adicionar produtos.');
});
