document.addEventListener('DOMContentLoaded', function() {
    // --- VARIÁVEIS GLOBAIS ---
    let todosOsProdutos = []; // Guarda a lista completa de produtos vinda do servidor
    let carrinho = [];

    // --- SELETORES DE ELEMENTOS FIXOS ---
    const containerProdutos = document.querySelector('.produtos');
    const botoesFiltro = document.querySelectorAll('.menucategoria button');
    const modalContainer = document.getElementById('modal-container');
    const carrinhoContainerEl = document.getElementById('carrinho-container');
    const listaCarrinho = document.getElementById('lista-carrinho');

    // ===================================================
    // FUNÇÃO PRINCIPAL PARA RENDERIZAR OS PRODUTOS
    // ===================================================
    function renderizarProdutos(produtosParaRenderizar) {
        if (!containerProdutos) return; // Garante que o container existe
        containerProdutos.innerHTML = ''; // Limpa o container antes de adicionar os novos produtos
        
        if (produtosParaRenderizar.length === 0) {
            containerProdutos.innerHTML = '<p style="color: white; text-align: center;">Nenhum produto encontrado.</p>';
            return;
        }

        produtosParaRenderizar.forEach(produto => {
            const precoAntigoHTML = produto.precoAntigo ? `<p class="preco-antigo">R$ ${produto.precoAntigo.toFixed(2)}</p>` : '';
            const desconto = produto.precoAntigo && produto.preco < produto.precoAntigo ? Math.round(((produto.precoAntigo - produto.preco) / produto.precoAntigo) * 100) : 0;
            const descontoHTML = desconto > 0 ? `<span class="desconto">-${desconto}%</span>` : '';

            const produtoHTML = `
                <article class="produto" 
                         data-categoria="${produto.categoria}"
                         data-ingredientes="${produto.ingredientes || ''}"
                         data-id="${produto.id}" 
                         data-nome="${produto.nome}" 
                         data-preco="${produto.preco}"
                         data-imagem="${produto.imagem}"
                         data-preco-antigo="${produto.precoAntigo || ''}">

                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    ${precoAntigoHTML}
                    <p class="preco-novo">R$ ${produto.preco.toFixed(2)}</p>
                    ${descontoHTML}
                    <button class="add-carrinho-btn">Adicionar ao Carrinho</button>
                </article>
            `;
            containerProdutos.innerHTML += produtoHTML;
        });

        // Após renderizar, precisamos reativar todos os eventos dos produtos
        anexarEventListenersDosProdutos();
    }
    
    // ===================================================
    // FUNÇÃO PARA ANEXAR TODOS OS EVENT LISTENERS DOS PRODUTOS
    // ===================================================
    function anexarEventListenersDosProdutos() {
        // --- LÓGICA DO MODAL ---
        const todosOsCards = document.querySelectorAll('.produto');
        todosOsCards.forEach(produto => {
            produto.addEventListener('click', function(event) {
                if (event.target.tagName === 'BUTTON') return;
                
                const id = this.getAttribute('data-id');
                const nome = this.getAttribute('data-nome');
                const preco = this.getAttribute('data-preco');
                
                modalContainer.setAttribute('data-id-atual', id);
                modalContainer.setAttribute('data-nome-atual', nome);
                modalContainer.setAttribute('data-preco-atual', preco);

                document.getElementById('modal-img').src = this.getAttribute('data-imagem');
                document.getElementById('modal-titulo').textContent = nome;
                document.getElementById('modal-ingredientes').textContent = this.getAttribute('data-ingredientes') || "Ingredientes não informados.";
                document.getElementById('modal-preco').textContent = `R$ ${parseFloat(preco).toFixed(2)}`;
                
                modalContainer.classList.add('aberto');
            });
        });

        // --- LÓGICA DE ADICIONAR AO CARRINHO ---
        const botoesAdicionar = document.querySelectorAll('.add-carrinho-btn');
        botoesAdicionar.forEach(botao => {
            botao.addEventListener('click', function() {
                const produtoCard = botao.closest('.produto');
                const id = produtoCard.getAttribute('data-id');
                const nome = produtoCard.getAttribute('data-nome');
                const preco = parseFloat(produtoCard.getAttribute('data-preco'));
                adicionarAoCarrinho(id, nome, preco);
            });
        });
    }

    // ===================================================
    // LÓGICA DO FILTRO (AGORA USA O ARRAY DE PRODUTOS)
    // ===================================================
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', function() {
            const categoriaFiltro = botao.getAttribute('data-filter');
            let produtosFiltrados;

            if (categoriaFiltro === 'Todos') {
                produtosFiltrados = todosOsProdutos;
            } else {
                produtosFiltrados = todosOsProdutos.filter(produto => produto.categoria === categoriaFiltro);
            }
            renderizarProdutos(produtosFiltrados);
        });
    });

    // ===================================================
    // TODAS AS FUNÇÕES E EVENTOS FIXOS
    // ===================================================

    // --- FUNÇÕES DO MODAL ---
    const modalFecharBtn = document.getElementById('modal-fechar-btn');
    function fecharModal() {
        modalContainer.classList.remove('aberto');
    }
    modalFecharBtn.addEventListener('click', fecharModal);
    modalContainer.addEventListener('click', function(event) {
        if (event.target === modalContainer) {
            fecharModal();
        }
    });

    // --- FUNÇÕES DO CARRINHO ---
    function adicionarAoCarrinho(id, nome, preco) {
        const itemExistente = carrinho.find(item => item.id == id); // Usar == para comparar string com número se necessário
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({ id: id, nome: nome, preco: preco, quantidade: 1 });
        }
        atualizarCarrinhoVisual();
    }

    function aumentarQuantidade(id) {
        const item = carrinho.find(item => item.id == id);
        if (item) item.quantidade++;
        atualizarCarrinhoVisual();
    }

    function diminuirQuantidade(id) {
        const item = carrinho.find(item => item.id == id);
        if (item) {
            item.quantidade--;
            if (item.quantidade === 0) {
                removerDoCarrinho(id);
            } else {
                atualizarCarrinhoVisual();
            }
        }
    }

    function removerDoCarrinho(id) {
        carrinho = carrinho.filter(item => item.id != id);
        atualizarCarrinhoVisual();
    }
    
    function atualizarCarrinhoVisual() {
        const contadorItens = document.getElementById('contador-itens');
        const precoTotalEl = document.getElementById('preco-total');
        const contadorIcone = document.getElementById('carrinho-contador-icone');

        if (!listaCarrinho) return;
        listaCarrinho.innerHTML = '';
        let totalItens = 0;
        let precoTotal = 0;

        if (carrinho.length === 0) {
            listaCarrinho.innerHTML = '<li class="carrinho-vazio">Seu carrinho está vazio.</li>';
        } else {
            carrinho.forEach(item => {
                const itemLi = document.createElement('li');
                itemLi.classList.add('item-carrinho');
                itemLi.innerHTML = `
                    <div class="item-info">
                        ${item.nome}
                        <span>R$ ${item.preco.toFixed(2)} cada</span>
                    </div>
                    <div class="item-quantidade">
                        <button class="btn-diminuir" data-id="${item.id}">-</button>
                        <span>${item.quantidade}</span>
                        <button class="btn-aumentar" data-id="${item.id}">+</button>
                    </div>
                    <div class="item-preco-total">
                        R$ ${(item.preco * item.quantidade).toFixed(2)}
                    </div>
                    <button class="remover-item-btn" data-id="${item.id}">&times;</button>
                `;
                listaCarrinho.appendChild(itemLi);
                totalItens += item.quantidade;
                precoTotal += item.preco * item.quantidade;
            });
        }
        
        contadorItens.textContent = totalItens;
        precoTotalEl.textContent = `R$ ${precoTotal.toFixed(2)}`;
        contadorIcone.textContent = totalItens;

        if (totalItens > 0) {
            contadorIcone.classList.add('visivel');
        } else {
            contadorIcone.classList.remove('visivel');
        }
    }

    // --- EVENT LISTENERS FIXOS (CARRINHO E MODAL) ---
    listaCarrinho.addEventListener('click', function(event) {
        const target = event.target;
        const id = target.getAttribute('data-id');
        if (id) {
            event.stopPropagation();
            if (target.classList.contains('remover-item-btn')) removerDoCarrinho(id);
            else if (target.classList.contains('btn-aumentar')) aumentarQuantidade(id);
            else if (target.classList.contains('btn-diminuir')) diminuirQuantidade(id);
        }
    });

    const botaoAbrirCarrinho = document.querySelector('.carrinho a');
    botaoAbrirCarrinho.addEventListener('click', function(event) {
        event.preventDefault();
        carrinhoContainerEl.classList.toggle('aberto');
    });

    document.addEventListener('click', function(event) {
        if (carrinhoContainerEl.classList.contains('aberto') &&
            !carrinhoContainerEl.contains(event.target) &&
            !botaoAbrirCarrinho.contains(event.target)) {
            carrinhoContainerEl.classList.remove('aberto');
        }
    });

    const botaoAdicionarModal = document.querySelector('.modal-add-carrinho');
    botaoAdicionarModal.addEventListener('click', function() {
        const id = modalContainer.getAttribute('data-id-atual');
        const nome = modalContainer.getAttribute('data-nome-atual');
        const preco = parseFloat(modalContainer.getAttribute('data-preco-atual'));
        adicionarAoCarrinho(id, nome, preco);
        fecharModal();
        carrinhoContainerEl.classList.add('aberto');
    });


    // ===================================================
    // PONTO DE PARTIDA: BUSCA OS PRODUTOS NO SERVIDOR
    // ===================================================
    fetch('/api/produtos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(produtosDoServidor => {
            todosOsProdutos = produtosDoServidor;
            renderizarProdutos(todosOsProdutos);
        })
        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
            if(containerProdutos) containerProdutos.innerHTML = '<p style="color: white; text-align: center;">Erro ao carregar produtos. Verifique se o servidor está rodando.</p>';
        });
});