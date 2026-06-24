import { db, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "./config.js";

const produtosRef = collection(db, "produtos");

// Read: Escuta o banco em tempo real (onSnapshot)
onSnapshot(produtosRef, (snapshot) => {
    const corpo = document.getElementById('corpoTabela');
    if (!corpo) return;
    corpo.innerHTML = '';
    
    snapshot.forEach((item) => {
        const p = item.data();
        const id = item.id; // O Firebase gera IDs automáticos
        corpo.innerHTML += `
            <tr>
                <td><img src="${p.imagem}" class="img-mini" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td>${p.nome}</td>
                <td>${p.categoria}</td>
                <td>R$ ${p.preco}</td>
                <td>
                    <button class="btn-info" onclick="abrirModalEdicao('${id}', '${p.nome}', '${p.categoria}', ${p.preco}, '${p.imagem}')">Editar</button>
                    <button class="btn-perigo" onclick="excluirProduto('${id}')">Excluir</button>
                </td>
            </tr>`;
    });
});

// Create
document.getElementById('formProduto')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await addDoc(produtosRef, {
            nome: document.getElementById('nome').value,
            categoria: document.getElementById('categoria').value,
            preco: parseFloat(document.getElementById('preco').value).toFixed(2),
            imagem: document.getElementById('urlImagem').value,
            dataCriacao: new Date()
        });
        e.target.reset();
    } catch (err) { console.error("Erro ao salvar:", err); }
});

// Delete
window.excluirProduto = async (id) => {
    if(confirm("Excluir item do banco de dados?")) {
        await deleteDoc(doc(db, "produtos", id));
    }
};

// Update (Função simplificada para o exemplo)
window.abrirModalEdicao = (id, nome, cat, preco, img) => {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-nome').value = nome;
    document.getElementById('edit-preco').value = preco;
    document.getElementById('edit-urlImagem').value = img;
    document.getElementById('modalEdicao').style.display = 'block';
};

document.getElementById('formEdicao')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const ref = doc(db, "produtos", id);
    await updateDoc(ref, {
        nome: document.getElementById('edit-nome').value,
        preco: document.getElementById('edit-preco').value,
        imagem: document.getElementById('edit-urlImagem').value
    });
    document.getElementById('modalEdicao').style.display = 'none';
});
// --- FUNÇÃO DE LOGOUT (Adicionar ao final do admin.js) ---
window.logout = () => {
    sessionStorage.removeItem('logado');
    window.location.href = 'index.html';
};

// --- FUNÇÃO PARA FECHAR O MODAL (Caso não tenha) ---
window.fecharModal = () => {
    document.getElementById('modalEdicao').style.display = 'none';
};