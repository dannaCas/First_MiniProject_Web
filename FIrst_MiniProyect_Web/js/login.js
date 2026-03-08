const registerCard = document.getElementById('registerForm');
const loginCard = document.getElementById('loginForm');
let captchaResuelto = false;
const idsRequeridos = ["m1", "m2", "m3"];

// Alternar vistas
document.getElementById('toLogin').onclick = () => { registerCard.classList.add('hidden'); loginCard.classList.remove('hidden'); };
document.getElementById('toRegister').onclick = () => { loginCard.classList.add('hidden'); registerCard.classList.remove('hidden'); };

// Registro
document.getElementById('signupForm').onsubmit = (e) => {
    e.preventDefault();
    
    // Obtener la lista de usuarios ya existentes o crear una vacía
    let usuarios = JSON.parse(localStorage.getItem('listaUsuarios')) || [];

    // Crear el nuevo usuario
    const nuevoUsuario = {
        email: document.getElementById('regNom').value,
        pass: document.getElementById('regPassword').value
    };

    // Guardar en el arreglo y subir a LocalStorage
    usuarios.push(nuevoUsuario);
    localStorage.setItem('listaUsuarios', JSON.stringify(usuarios));

    alert('Cuenta creada con éxito.');
};
// LÓGICA DRAG AND DROP
const fondo = new Image();
fondo.src = "/MEDIA/canva.jpg";
const lienzo = document.getElementById('lienzo');
const ctx = lienzo.getContext('2d');
let imagenesCanvas = [];

lienzo.addEventListener('dragover', (e) => e.preventDefault());
fondo.onload = function(){
    ctx.drawImage(fondo, 0, 0, lienzo.width, lienzo.height);
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
lienzo.addEventListener('drop', (ev) => {

    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const img = document.getElementById(data);
    const rect = lienzo.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    // guardar imagen y posición
    imagenesCanvas.push({
        img: img,
        x: x-30,
        y: y-30
    });
    ctx.clearRect(0,0,lienzo.width,lienzo.height);
    ctx.drawImage(fondo,0,0,lienzo.width,lienzo.height);
    imagenesCanvas.forEach(obj => {
        ctx.drawImage(obj.img, obj.x, obj.y, 60, 60);
    });
    captchaResuelto = true;

});
// VERIFICACIÓN FINAL
document.getElementById("verificarCaptcha").onclick = function() {

    const idsEnCanvas = imagenesCanvas.map(obj => obj.img.id);
    const todas = idsRequeridos.every(id => idsEnCanvas.includes(id));

    if(!todas){
        alert("Debes arrastrar las 3 imagenes al recuadro.");
        return;
    }
    // continuar con login
    const email = document.getElementById('logNom').value.trim();
    const pass = document.getElementById('logPassword').value.trim();
    const usuarios = JSON.parse(localStorage.getItem('listaUsuarios')) || [];

    // Buscar si existe usuario
    const usuarioValido = usuarios.find(u => u.email === email && u.pass === pass);
    if (usuarioValido) {
        // guardar usuario actual en localstorage userEmail
        localStorage.setItem('userEmail', usuarioValido.email);
        alert("¡Bienvenido! Sesión iniciada.");

        // Limpiar captcha
        imagenesCanvas = [];

        // Leer la URL 
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');

        if (redirect === 'drawForm') {
            window.location.href = "/PAGES/drawForm.html";
        } else {
            window.location.href = "/PAGES/perfil.html";
        }
    } else {
        alert("Datos incorrectos.");
        // Limpiar captcha
        imagenesCanvas = [];
        ctx.clearRect(0,0,lienzo.width,lienzo.height);
        ctx.drawImage(fondo, 0, 0, lienzo.width, lienzo.height);
    }

};

function finalizarLogin() {
    // Obtener los parámetros de la URL actual
    const urlParams = new URLSearchParams(window.location.search);
    const destino = urlParams.get('redirect');

    // Lógica de redirección basada en el parámetro
    if (destino === 'draw') {
        alert("¡Bienvenido! Vamos a crear tu sorteo.");
        window.location.href = "drawForm.html";
    } else if (destino === 'profile') {
        alert("¡Bienvenido a tu perfil!");
        window.location.href = "perfil.html";
    } else {
        // Por defecto mandar a perfil
        window.location.href = "perfil.html";
    }
}