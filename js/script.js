document.addEventListener('DOMContentLoaded', function() {

    // ===================================================
    // PARTE 1: LÓGICA DO FILTRO DE CATEGORIAS
    // ===================================================
    const botoesFiltro = document.querySelectorAll('.menucategoria button');
    const produtos = document.querySelectorAll('.produto');

    botoesFiltro.forEach(function(botao) {
        botao.addEventListener('click', function() {
            const categoriaFiltro = botao.getAttribute('data-filter');
            produtos.forEach(function(produto) {
                const categoriaProduto = produto.getAttribute('data-categoria');
                if (categoriaFiltro === 'Todos' || categoriaProduto === categoriaFiltro) {
                    produto.classList.remove('escondido');
                } else {
                    produto.classList.add('escondido');
                }
            });
        });
    });

    // ===================================================
    // PARTE 2: LÓGICA DO MODAL DE DETALHES DO PRODUTO
    // ===================================================
    const modalContainer = document.getElementById('modal-container');
    const modalFecharBtn = document.getElementById('modal-fechar-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalIngredientes = document.getElementById('modal-ingredientes');
    const modalPreco = document.getElementById('modal-preco');

    produtos.forEach(produto => {
        produto.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') return;
            const id = this.getAttribute('data-id');
            const nome = this.getAttribute('data-nome');
            const preco = this.getAttribute('data-preco');
            modalContainer.setAttribute('data-id-atual', id);
            modalContainer.setAttribute('data-nome-atual', nome);
            modalContainer.setAttribute('data-preco-atual', preco);
            modalImg.src = this.querySelector('img').src;
            modalTitulo.textContent = this.querySelector('h3').textContent;
            modalIngredientes.textContent = this.getAttribute('data-ingredientes') || "Ingredientes não informados.";
            modalPreco.textContent = this.querySelector('.preco-novo').textContent;
            modalContainer.classList.add('aberto');
        });
    });

    function fecharModal() {
        modalContainer.classList.remove('aberto');
    }

    modalFecharBtn.addEventListener('click', fecharModal);
    modalContainer.addEventListener('click', function(event) {
        if (event.target === modalContainer) {
            fecharModal();
        }
    });

    // ===================================================
    // PARTE 3: LÓGICA DO CARRINHO DE COMPRAS
    // ===================================================
    let carrinho = [];
    const botoesAdicionar = document.querySelectorAll('.add-carrinho-btn');
    const carrinhoContainerEl = document.getElementById('carrinho-container');
    const botaoAbrirCarrinho = document.querySelector('.carrinho a');
    const listaCarrinho = document.getElementById('lista-carrinho');

    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', function() {
            const produtoCard = botao.closest('.produto');
            const id = produtoCard.getAttribute('data-id');
            const nome = produtoCard.getAttribute('data-nome');
            const preco = parseFloat(produtoCard.getAttribute('data-preco'));
            adicionarAoCarrinho(id, nome, preco);
        });
    });

    function adicionarAoCarrinho(id, nome, preco) {
        const itemExistente = carrinho.find(item => item.id === id);
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({ id: id, nome: nome, preco: preco, quantidade: 1 });
        }
        atualizarCarrinhoVisual();
    }
    
    // --- NOVO: Funções para aumentar e diminuir quantidade ---
    function aumentarQuantidade(id) {
        const item = carrinho.find(item => item.id === id);
        if (item) {
            item.quantidade++;
        }
        atualizarCarrinhoVisual();
    }

    function diminuirQuantidade(id) {
        const item = carrinho.find(item => item.id === id);
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
        carrinho = carrinho.filter(item => item.id !== id);
        atualizarCarrinhoVisual();
    }

    // --- ATUALIZADO: Event listener do carrinho para incluir + e - ---
    listaCarrinho.addEventListener('click', function(event) {
        const target = event.target;
        const id = target.getAttribute('data-id');

        if (id) { // Só executa se o elemento clicado tiver um data-id
            event.stopPropagation();
            if (target.classList.contains('remover-item-btn')) {
                removerDoCarrinho(id);
            } else if (target.classList.contains('btn-aumentar')) {
                aumentarQuantidade(id);
            } else if (target.classList.contains('btn-diminuir')) {
                diminuirQuantidade(id);
            }
        }
    });
    
    // --- ATUALIZADO: Função visual para incluir os controles de quantidade ---
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

});