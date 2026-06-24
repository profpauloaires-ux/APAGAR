import { db, collection, onSnapshot } from "./config.js";

const produtosRef = collection(db, "produtos");

// Escuta o Firebase em tempo real para montar o catálogo
onSnapshot(produtosRef, (snapshot) => {
    const lista = document.getElementById('listaCatalogo');
    if (!lista) return;

    lista.innerHTML = ''; // Limpa a tela antes de desenhar

    if (snapshot.empty) {
        lista.innerHTML = '<p class="text-center">Nenhum produto encontrado no estoque.</p>';
        return;
    }

    snapshot.forEach((item) => {
        const p = item.data();
        const id = item.id;
        
        const div = document.createElement('div');
        div.className = 'card-servico';
        div.innerHTML = `
            <img src="${p.imagem || 'https://via.placeholder.com/300'}" class="card-img" onerror="this.src='https://via.placeholder.com/300'">
            <div style="padding:15px">
                <h4>${p.nome}</h4>
                <p style="color:var(--success); font-weight:bold;">R$ ${p.preco}</p>
                <button class="btn-cta" style="width:100%; margin-top:10px;" 
                        onclick="adicionarAoCarrinho('${id}', '${p.nome}', ${p.preco})">
                    🛒 Adicionar ao Carrinho
                </button>
            </div>`;
        lista.appendChild(div);
    });
});

// Lógica do Carrinho (Salva no LocalStorage do cliente)
window.adicionarAoCarrinho = (id, nome, preco) => {
    // Buscamos o que já existe ou criamos um array vazio
    let cart = JSON.parse(localStorage.getItem('carrinho_ti')) || [];
    
    const itemExistente = cart.find(i => i.id === id);

    if (itemExistente) {
        itemExistente.qtd++;
    } else {
        // Importante: preco deve ser número para os cálculos funcionarem
        cart.push({ id, nome, preco: parseFloat(preco), qtd: 1 });
    }
    
    localStorage.setItem('carrinho_ti', JSON.stringify(cart));
    alert(`${nome} adicionado ao carrinho!`);
};
// Função para desenhar o carrinho na tela
window.renderCarrinho = () => {
    const corpo = document.getElementById('corpoCarrinho');
    if (!corpo) return;

    const cart = JSON.parse(localStorage.getItem('carrinho_ti')) || [];
    corpo.innerHTML = '';
    let totalGeral = 0;

    if (cart.length === 0) {
        corpo.innerHTML = '<tr><td colspan="5" class="text-center">Seu carrinho está vazio.</td></tr>';
    } else {
        cart.forEach((item, index) => {
            const subtotal = item.preco * item.qtd;
            totalGeral += subtotal;
            
            corpo.innerHTML += `
                <tr>
                    <td>${item.nome}</td>
                    <td>R$ ${item.preco.toFixed(2)}</td>
                    <td>
                        <input type="number" value="${item.qtd}" min="1" 
                               onchange="alterarQtd(${index}, this.value)" style="width:50px">
                    </td>
                    <td>R$ ${subtotal.toFixed(2)}</td>
                    <td><button class="btn-perigo" onclick="removerItem(${index})">X</button></td>
                </tr>`;
        });
    }

    const totalElem = document.getElementById('totalCarrinho');
    if (totalElem) totalElem.innerText = `Total: R$ ${totalGeral.toFixed(2)}`;
};

// Funções de suporte expostas para o HTML
window.alterarQtd = (index, novaQtd) => {
    let cart = JSON.parse(localStorage.getItem('carrinho_ti'));
    cart[index].qtd = parseInt(novaQtd);
    localStorage.setItem('carrinho_ti', JSON.stringify(cart));
    renderCarrinho();
};

window.removerItem = (index) => {
    let cart = JSON.parse(localStorage.getItem('carrinho_ti'));
    cart.splice(index, 1);
    localStorage.setItem('carrinho_ti', JSON.stringify(cart));
    renderCarrinho();
};

window.finalizarPedido = () => {
    alert("Pedido enviado para a TechSupport! Verifique seu e-mail para instruções de logística.");
    localStorage.removeItem('carrinho_ti');
    window.location.href = 'index.html';
};

// Inicializa a renderização se estiver na página do carrinho
renderCarrinho();
// --- FUNÇÃO PARA ESVAZIAR O CARRINHO ---
window.limparTodoCarrinho = () => {
    if (confirm("Tem certeza que deseja remover todos os itens do carrinho?")) {
        // Remove a chave do localStorage
        localStorage.removeItem('carrinho_ti');
        
        // Se a função renderCarrinho existir neste arquivo, chamamos ela
        if (typeof renderCarrinho === "function") {
            renderCarrinho();
        } else {
            // Caso contrário, apenas recarrega a página para limpar a tela
            window.location.reload();
        }
        alert("Carrinho esvaziado!");
    }
};
// --- FUNÇÃO PARA ESVAZIAR O CARRINHO ---
window.limparTodoCarrinho = () => {
    if (confirm("Deseja realmente esvaziar o seu carrinho?")) {
        // Remove os dados do localStorage
        localStorage.removeItem('carrinho_ti');
        
        // Atualiza a tela imediatamente
        renderCarrinho();
        
        alert("Carrinho vazio!");
    }
};

// --- FUNÇÃO PARA FINALIZAR O PEDIDO ---
window.finalizarPedido = () => {
    const cart = JSON.parse(localStorage.getItem('carrinho_ti')) || [];
    
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    
    alert("Pedido enviado com sucesso para a J23 Consultoria!");
    localStorage.removeItem('carrinho_ti');
    window.location.href = 'index.html';
};

// --- FUNÇÃO DE RENDERIZAÇÃO (Caso não tenha no loja.js ainda) ---
function renderCarrinho() {
    const corpo = document.getElementById('corpoCarrinho');
    if (!corpo) return;

    const cart = JSON.parse(localStorage.getItem('carrinho_ti')) || [];
    corpo.innerHTML = '';
    let totalGeral = 0;

    if (cart.length === 0) {
        corpo.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Seu carrinho está vazio.</td></tr>';
    } else {
        cart.forEach((item, index) => {
            const subtotal = item.preco * item.qtd;
            totalGeral += subtotal;
            corpo.innerHTML += `
                <tr>
                    <td>${item.nome}</td>
                    <td>R$ ${item.preco.toFixed(2)}</td>
                    <td><input type="number" value="${item.qtd}" min="1" onchange="alterarQtd(${index}, this.value)" style="width:50px"></td>
                    <td>R$ ${subtotal.toFixed(2)}</td>
                    <td><button class="btn-perigo" onclick="removerItem(${index})">X</button></td>
                </tr>`;
        });
    }
    
    const totalDisplay = document.getElementById('totalCarrinho');
    if (totalDisplay) totalDisplay.innerText = `Total: R$ ${totalGeral.toFixed(2)}`;
}

// Expõe funções de alteração para o HTML
window.alterarQtd = (i, q) => {
    let c = JSON.parse(localStorage.getItem('carrinho_ti'));
    c[i].qtd = parseInt(q);
    localStorage.setItem('carrinho_ti', JSON.stringify(c));
    renderCarrinho();
};

window.removerItem = (i) => {
    let c = JSON.parse(localStorage.getItem('carrinho_ti'));
    c.splice(i, 1);
    localStorage.setItem('carrinho_ti', JSON.stringify(c));
    renderCarrinho();
};

// Inicia a renderização ao carregar a página
renderCarrinho();