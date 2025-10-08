// Aguarda o documento carregar
document.addEventListener('DOMContentLoaded', function() {

    // --- CÓDIGO DO FILTRO DE CATEGORIAS (QUE JÁ FIZEMOS) ---
    // ... ele pode continuar aqui sem problemas ...

    // --- CÓDIGO NOVO PARA O MODAL ---

    // 1. Seleciona os elementos do DOM
    const produtos = document.querySelectorAll('.produto');
    const modalContainer = document.getElementById('modal-container');
    const modalFecharBtn = document.getElementById('modal-fechar-btn');
    
    // Seleciona os locais dentro do modal que vamos preencher
    const modalImg = document.getElementById('modal-img');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalIngredientes = document.getElementById('modal-ingredientes');
    const modalPreco = document.getElementById('modal-preco');

    // 2. Adiciona um "ouvinte" de clique para CADA produto
    produtos.forEach(produto => {
        produto.addEventListener('click', function(event) {
            // Impede que o clique no botão "Adicionar ao Carrinho" abra o modal
            if (event.target.tagName === 'BUTTON') {
                return;
            }

            // 3. Pega as informações do produto que foi clicado
            const imgScr = produto.querySelector('img').src;
            const titulo = produto.querySelector('h3').textContent;
            const preco = produto.querySelector('.preco-novo').textContent;
            const ingredientes = produto.getAttribute('data-ingredientes'); // Pega do atributo data-

            // 4. Preenche o modal com as informações do produto
            modalImg.src = imgScr;
            modalTitulo.textContent = titulo;
            modalIngredientes.textContent = ingredientes;
            modalPreco.textContent = preco;

            // 5. Mostra o modal adicionando a classe "aberto"
            modalContainer.classList.add('aberto');
        });
    });

    // 6. Função para fechar o modal
    function fecharModal() {
        modalContainer.classList.remove('aberto');
    }

    // Adiciona o evento de clique no botão de fechar (X)
    modalFecharBtn.addEventListener('click', fecharModal);

    // Adiciona o evento de clique no fundo escuro (overlay) para fechar
    modalContainer.addEventListener('click', function(event) {
        // Se o clique foi exatamente no overlay (fundo) e não no conteúdo
        if (event.target === modalContainer) {
            fecharModal();
        }
    });
});