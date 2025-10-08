const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const produtosFilePath = path.join(__dirname, 'produtos.json');

// --- ROTAS DA API ---

// READ (GET) - Já tínhamos esta
app.get('/api/produtos', (req, res) => {
    fs.readFile(produtosFilePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).send('Erro ao ler o arquivo de produtos.'); }
        res.json(JSON.parse(data));
    });
});

// CREATE (POST) - Já tínhamos esta
app.post('/api/produtos', (req, res) => {
    const novoProduto = req.body;
    fs.readFile(produtosFilePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).send('Erro ao ler o arquivo.'); }
        const produtos = JSON.parse(data);
        novoProduto.id = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
        produtos.push(novoProduto);
        fs.writeFile(produtosFilePath, JSON.stringify(produtos, null, 2), (err) => {
            if (err) { return res.status(500).send('Erro ao salvar o produto.'); }
            res.status(201).json(novoProduto);
        });
    });
});

// --- NOVAS ROTAS ---

// UPDATE (PUT) - Para editar um produto existente
app.put('/api/produtos/:id', (req, res) => {
    const idParaEditar = parseInt(req.params.id);
    const dadosAtualizados = req.body;
    fs.readFile(produtosFilePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).send('Erro ao ler o arquivo.'); }
        let produtos = JSON.parse(data);
        const indexDoProduto = produtos.findIndex(p => p.id === idParaEditar);

        if (indexDoProduto === -1) {
            return res.status(404).send('Produto não encontrado.');
        }

        // Atualiza o produto mantendo o ID original
        produtos[indexDoProduto] = { ...dadosAtualizados, id: idParaEditar };

        fs.writeFile(produtosFilePath, JSON.stringify(produtos, null, 2), (err) => {
            if (err) { return res.status(500).send('Erro ao salvar as alterações.'); }
            res.status(200).json(produtos[indexDoProduto]);
        });
    });
});

// DELETE (DELETE) - Para remover um produto
app.delete('/api/produtos/:id', (req, res) => {
    const idParaRemover = parseInt(req.params.id);
    fs.readFile(produtosFilePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).send('Erro ao ler o arquivo.'); }
        let produtos = JSON.parse(data);
        const produtosFiltrados = produtos.filter(p => p.id !== idParaRemover);

        if (produtos.length === produtosFiltrados.length) {
            return res.status(404).send('Produto não encontrado.');
        }

        fs.writeFile(produtosFilePath, JSON.stringify(produtosFiltrados, null, 2), (err) => {
            if (err) { return res.status(500).send('Erro ao remover o produto.'); }
            res.status(200).send({ message: 'Produto removido com sucesso.' });
        });
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});