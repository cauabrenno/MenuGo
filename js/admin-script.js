document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-produto');
    const formTitulo = document.getElementById('form-titulo');
    const produtoIdInput = document.getElementById('produto-id');
    const btnSalvar = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const listaProdutosContainer = document.getElementById('lista-produtos-admin');

    // Função para buscar e renderizar todos os produtos
    async function fetchAndRenderProducts() {
        try {
            const response = await fetch('/api/produtos');
            const produtos = await response.json();
            
            listaProdutosContainer.innerHTML = ''; // Limpa a lista
            produtos.forEach(produto => {
                const produtoDiv = document.createElement('div');
                produtoDiv.classList.add('produto-item-admin');
                produtoDiv.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <div class="produto-info-admin">
                        <h3>${produto.nome}</h3>
                        <p>R$ ${produto.preco.toFixed(2)}</p>
                    </div>
                    <div class="produto-acoes-admin">
                        <button class="btn-editar" data-id="${produto.id}">✏️</button>
                        <button class="btn-remover" data-id="${produto.id}">❌</button>
                    </div>
                `;
                listaProdutosContainer.appendChild(produtoDiv);
            });
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            listaProdutosContainer.innerHTML = '<p style="color: #ff4d4d;">Falha ao carregar produtos. Verifique se o servidor está rodando.</p>';
        }
    }

    // Função para preencher o formulário para edição
    async function popularFormulario(id) {
        try {
            const response = await fetch(`/api/produtos`); // Busca todos para encontrar o produto
            const produtos = await response.json();
            const produto = produtos.find(p => p.id == id);

            if(produto) {
                form.nome.value = produto.nome;
                form.categoria.value = produto.categoria;
                form['preco-atual'].value = produto.preco;
                form['preco-antigo'].value = produto.precoAntigo || '';
                form.ingredientes.value = produto.ingredientes;
                form.imagem.value = produto.imagem;
                produtoIdInput.value = produto.id;

                formTitulo.textContent = 'Editar Produto';
                btnSalvar.textContent = 'Salvar Alterações';
                btnCancelar.style.display = 'block';
                window.scrollTo(0, 0); // Rola para o topo
            }
        } catch (error) {
            console.error('Erro ao buscar dados do produto:', error);
        }
    }

    // Função para resetar o formulário
    function resetarFormulario() {
        form.reset();
        produtoIdInput.value = '';
        formTitulo.textContent = 'Adicionar Novo Produto';
        btnSalvar.textContent = 'Salvar Produto';
        btnCancelar.style.display = 'none';
    }

    // Event listener para o envio do formulário (Adicionar ou Editar)
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = produtoIdInput.value;
        const url = id ? `/api/produtos/${id}` : '/api/produtos';
        const method = id ? 'PUT' : 'POST';

        const dadosProduto = {
            nome: form.nome.value,
            categoria: form.categoria.value,
            preco: parseFloat(form['preco-atual'].value),
            precoAntigo: parseFloat(form['preco-antigo'].value) || null,
            ingredientes: form.ingredientes.value,
            imagem: form.imagem.value,
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosProduto)
            });
            if (response.ok) {
                resetarFormulario();
                fetchAndRenderProducts(); // Atualiza a lista
            } else {
                alert('Erro ao salvar produto.');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    });

    // Event listener para os botões na lista de produtos (Editar e Remover)
    listaProdutosContainer.addEventListener('click', async (event) => {
        // Usa event.target.closest para garantir que pegamos o botão mesmo que o clique seja no ícone dentro dele
        const targetButton = event.target.closest('button');
        if (!targetButton) return; // Se o clique não foi em um botão, ignora

        const id = targetButton.dataset.id;
        if (!id) return; // Se o botão não tem um data-id, ignora

        if (targetButton.classList.contains('btn-editar')) {
            popularFormulario(id);
        }
        if (targetButton.classList.contains('btn-remover')) {
            if (confirm('Tem certeza que deseja remover este produto?')) {
                try {
                    const response = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
                    if (response.ok) {
                        fetchAndRenderProducts(); // Atualiza a lista
                    } else {
                        alert('Erro ao remover produto.');
                    }
                } catch (error) {
                    console.error('Erro:', error);
                }
            }
        }
    });

    // Listener para o botão de cancelar edição
    btnCancelar.addEventListener('click', resetarFormulario);

    // Carrega os produtos na primeira vez que a página é aberta
    fetchAndRenderProducts();
});

