// Espera todo o conteúdo da página carregar antes de rodar qualquer script
document.addEventListener('DOMContentLoaded', function() {

    // ===================================================
    // PARTE 1: LÓGICA DO FILTRO DE CATEGORIAS
    // ===================================================

    // Seleciona os botões de filtro e todos os produtos
const botoesFiltro = document.querySelectorAll('.menucategoria button');
    const produtos = document.querySelectorAll('.produto');

    botoesFiltro.forEach(function(botao) {
        botao.addEventListener('click', function() {
            // Pega a categoria do botão que foi clicado
            const categoriaFiltro = botao.getAttribute('data-filter');

            // Passa por cada produto para decidir se mostra ou esconde
            produtos.forEach(function(produto) {
                const categoriaProduto = produto.getAttribute('data-categoria');

                // Lógica principal do filtro
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

    // Seleciona os elementos do DOM para o modal
    const modalContainer = document.getElementById('modal-container');
    const modalFecharBtn = document.getElementById('modal-fechar-btn');
    
    // Seleciona os locais dentro do modal que vamos preencher
    const modalImg = document.getElementById('modal-img');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalIngredientes = document.getElementById('modal-ingredientes');
    const modalPreco = document.getElementById('modal-preco');

    // Adiciona um "ouvinte" de clique para CADA produto para ABRIR o modal
    // Note que estamos reutilizando a variável 'produtos' que selecionamos ali em cima
    produtos.forEach(produto => {
        produto.addEventListener('click', function(event) {
            // Impede que o clique no botão "Adicionar ao Carrinho" dentro do card abra o modal
            if (event.target.tagName === 'BUTTON') {
                return;
            }

            // Pega as informações do produto que foi clicado
            const imgScr = produto.querySelector('img').src;
            const titulo = produto.querySelector('h3').textContent;
            const preco = produto.querySelector('.preco-novo').textContent;
            const ingredientes = produto.getAttribute('data-ingredientes');

            // Preenche o modal com as informações do produto
            modalImg.src = imgScr;
            modalTitulo.textContent = titulo;
            modalIngredientes.textContent = ingredientes || "Ingredientes não informados."; // Mensagem padrão
            modalPreco.textContent = preco;

            // Mostra o modal adicionando a classe "aberto"
            modalContainer.classList.add('aberto');
        });
    });

    // Função para fechar o modal
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

}); // Fim do 'DOMContentLoaded'