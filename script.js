// Crear el mazo de cartas
const mazo = [];
const palos = ["oros", "copas", "espadas", "bastos"];
const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

// Generar las cartas
palos.forEach(palo => {
    valores.forEach(valor => {
        mazo.push({ palo, valor });
    });
});

// Barajar las cartas
function barajarMazo() {
    return [...mazo].sort(() => Math.random() - 0.5);
}

// Variables del juego
let manoJugador = [];
let manoRival = [];
let piedrasJugador = 0;
let piedrasRival = 0;

// Referencias del DOM
const marcadorJugador = document.getElementById("piedras-jugador");
const marcadorRival = document.getElementById("piedras-rival");
const cartasJugadorDiv = document.getElementById("cartas-jugador");
const cartasRivalDiv = document.getElementById("cartas-rival");

// Función para mostrar cartas
function mostrarCartasJugador() {
    cartasJugadorDiv.innerHTML = "";
    manoJugador.forEach(carta => {
        const cartaHTML = `<img src="assets/cartas/${carta.valor}_de_${carta.palo}.png" alt="${carta.valor} de ${carta.palo}" class="carta">`;
        cartasJugadorDiv.innerHTML += cartaHTML;
    });
}

function mostrarCartasRival() {
    cartasRivalDiv.innerHTML = "";
    manoRival.forEach(carta => {
        const cartaHTML = `<img src="assets/cartas/${carta.valor}_de_${carta.palo}.png" alt="${carta.valor} de ${carta.palo}" class="carta carta-revelada">`;
        cartasRivalDiv.innerHTML += cartaHTML;
    });
}

// Repartir cartas
function repartirCartas() {
    const mazoBarajado = barajarMazo();
    manoJugador = mazoBarajado.splice(0, 4);
    manoRival = mazoBarajado.splice(0, 4);
    mostrarCartasJugador();
    cartasRivalDiv.innerHTML = "Cartas del Rival: [Ocultas]";
}

// Evaluaciones y lógica del juego
function jugarRonda() {
    repartirCartas();
    alert("Resolviendo Grande, Chica, Pares y Juego...");
    mostrarCartasRival();
    actualizarMarcador();
}

function actualizarMarcador() {
    marcadorJugador.innerText = piedrasJugador;
    marcadorRival.innerText = piedrasRival;
}

// Eventos
document.getElementById("iniciar").addEventListener("click", jugarRonda);
document.getElementById("mus").addEventListener("click", repartirCartas);

// Inicializar el juego
repartirCartas();
