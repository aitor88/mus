// Variables iniciales
let piedrasJugador = 0;
let piedrasRival = 0;

// Referencias a elementos del DOM
const marcadorJugador = document.getElementById("piedras-jugador");
const marcadorRival = document.getElementById("piedras-rival");

// Funciones para acciones del juego
function pedirMus() {
    alert("Has pedido mus.");
    // Aquí irá la lógica para descartar y robar cartas.
}

function envidar() {
    alert("Has envidado.");
    // Aquí irá la lógica para apostar.
}

function pasar() {
    alert("Has pasado.");
    // Aquí irá la lógica para ceder turno.
}

// Eventos de botones
document.getElementById("mus").addEventListener("click", pedirMus);
document.getElementById("envidar").addEventListener("click", envidar);
document.getElementById("pasar").addEventListener("click", pasar);

// Función para actualizar el marcador
function actualizarMarcador() {
    marcadorJugador.innerText = piedrasJugador;
    marcadorRival.innerText = piedrasRival;
}

// Inicializar el marcador
actualizarMarcador();
