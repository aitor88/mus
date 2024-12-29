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
let cartasSeleccionadas = [];
let mazoBarajado = [];
let faseActual = 0; // 0: Grande, 1: Chica, 2: Pares, 3: Juego
let turnoActual = "Jugador"; // Alterna entre "Jugador" y "Rival"

// Mostrar cartas del jugador
function mostrarCartasJugador() {
    const cartasJugadorDiv = document.getElementById("cartas-jugador");
    cartasJugadorDiv.innerHTML = "";
    manoJugador.forEach((carta, index) => {
        const cartaHTML = `
            <img 
                id="carta-${index}" 
                class="carta" 
                src="assets/cartas/${formatoDosDigitos(carta.valor)}-${carta.palo}.png" 
                alt="${carta.valor} de ${carta.palo}" 
                onclick="seleccionarCarta(${index})"
            >
        `;
        cartasJugadorDiv.innerHTML += cartaHTML;
    });
}

// Mostrar cartas del rival
function mostrarCartasRival() {
    const cartasRivalDiv = document.getElementById("cartas-rival");
    cartasRivalDiv.innerHTML = "";
    manoRival.forEach(carta => {
        const cartaHTML = `
            <img 
                class="carta" 
                src="assets/cartas/reverso.png" 
                alt="Carta oculta"
            >
        `;
        cartasRivalDiv.innerHTML += cartaHTML;
    });
}

// Repartir cartas
function repartirCartas() {
    mazoBarajado = barajarMazo();
    manoJugador = mazoBarajado.splice(0, 4);
    manoRival = mazoBarajado.splice(0, 4);

    mostrarCartasJugador();
    mostrarCartasRival();

    cartasSeleccionadas = [];
    faseActual = 0;
    turnoActual = "Jugador";

    actualizarFaseTexto("Grande");
    actualizarTurnoTexto("Jugador");

    ocultarBotonIniciar();
    habilitarBotonesMus();
    ocultarBotonesApuestas();

    console.log("Ronda iniciada: cartas repartidas.");
}

// Actualizar indicadores
function actualizarFaseTexto(fase) {
    document.getElementById("fase-actual").innerText = `Fase: ${fase}`;
}

function actualizarTurnoTexto(turno) {
    document.getElementById("turno-actual").innerText = `Turno: ${turno}`;
}

// Mostrar y ocultar botones
function ocultarBotonIniciar() {
    document.getElementById("iniciar").style.display = "none";
}

function habilitarBotonesMus() {
    document.getElementById("pedir-mus").style.display = "inline-block";
    document.getElementById("no-hay-mus").style.display = "inline-block";
}

function ocultarBotonesApuestas() {
    document.getElementById("apuestas").style.display = "none";
}

// Evento para el botón "Iniciar Ronda"
document.getElementById("iniciar").addEventListener("click", repartirCartas);
