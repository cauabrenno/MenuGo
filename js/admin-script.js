// js/admin-script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-produto');

    form.addEventListener('submit', (event) => {
        // Impede o comportamento padrão do formulário (que é recarregar a página)
        event.preventDefault();

        // Pega os valores de todos os campos do formulário
        const dadosProduto = {
            nome: document.getElementById('nome').value,
            categoria: document.getElementById('categoria').value,
            preco: parseFloat(document.getElementById('preco-atual').value),
            precoAntigo: parseFloat(document.getElementById('preco-antigo').value) || null, // Se for vazio, envia null
            ingredientes: document.getElementById('ingredientes').value,
            imagem: document.getElementById('imagem').value
        };

        // Envia os dados para o servidor (back-end)
        fetch('/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosProduto) // Converte o objeto JavaScript em texto JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(produtoSalvo => {
            alert(`Produto "${produtoSalvo.nome}" salvo com sucesso!`);
            form.reset(); // Limpa o formulário
        })
        .catch(error => {
            console.error('Erro ao salvar o produto:', error);
            alert('Ocorreu um erro ao salvar o produto. Verifique o console.');
        });
    });
});