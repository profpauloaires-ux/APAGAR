import { LOGIN_USER, LOGIN_PASS } from "./config.js";

const form = document.getElementById('formLogin');
const erroMsg = document.getElementById('erroLogin');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('senha').value;

    if (user === LOGIN_USER && pass === LOGIN_PASS) {
        sessionStorage.setItem('logado', 'true');
        window.location.href = 'produtos.html';
    } else {
        erroMsg.style.display = 'block';
        alert("Usuário ou senha inválidos!");
    }
});