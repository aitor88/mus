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
let cartasSeleccionadas = [];
let mazoBarajado = [];
let faseActual = 0; // 0: Grande, 1: Chica, 2: Pares, 3: Juego
let turnoActual = "Jugador"; // Alterna entre "Jugador" y "Rival"
let apuestaActual = 0; // Cantidad de piedras apostadas en esta fase

// Referencias del DOM
const marcadorJugador = document.getElementById("piedras-jugador");
const marcadorRival = document.getElementById("piedras-rival");
const cartasJugadorDiv = document.getElementById("cartas-jugador");
const cartasRivalDiv = document.getElementById("cartas-rival");
const faseTexto = document.getElementById("fase-actual");
const turnoTexto = document.getElementById("turno-actual");
const apuestasDiv = document.getElementById("apuestas");
const fichasRivalDiv = document.getElementById("fichas-rival");
const fichasJugadorDiv = document.getElementById("fichas-jugador");

// Mostrar cartas del jugador
function mostrarCartasJugador() {
    const manoOrdenada = [...manoJugador].sort((a, b) => b.valor - a.valor);

    cartasJugadorDiv.innerHTML = "";
    manoOrdenada.forEach((carta, index) => {
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
function mostrarCartasRival(revelar = false) {
    const manoOrdenada = [...manoRival].sort((a, b) => b.valor - a.valor);

    cartasRivalDiv.innerHTML = "";
    manoOrdenada.forEach(carta => {
        const cartaHTML = revelar
            ? `<img 
                   class="carta" 
                   src="assets/cartas/${formatoDosDigitos(carta.valor)}-${carta.palo}.png" 
                   alt="${carta.valor} de ${carta.palo}"
               >`
            : `<img 
                   class="carta" 
                   src="assets/cartas/reverso.png" 
                   alt="Carta oculta"
               >`;
        cartasRivalDiv.innerHTML += cartaHTML;
    });
}

// Helper para formatear valores a dos dígitos
function formatoDosDigitos(valor) {
    return valor.toString().padStart(2, "0");
}

// Repartir cartas iniciales
function repartirCartas() {
    mazoBarajado = barajarMazo();
    manoJugador = mazoBarajado.splice(0, 4);
    manoRival = mazoBarajado.splice(0, 4);
    mostrarCartasJugador();
    mostrarCartasRival();
    limpiarFichas(); // Limpia las fichas al iniciar nueva ronda
    cartasSeleccionadas = [];
    document.getElementById("pedir-mus").style.display = "inline-block";
    document.getElementById("no-hay-mus").style.display = "inline-block";
}

// Limpieza de fichas visuales
function limpiarFichas() {
    fichasJugadorDiv.innerHTML = "";
    fichasRivalDiv.innerHTML = "";
}

// Añadir ficha visual
function añadirFicha(jugador) {
    const ficha = document.createElement("div");
    ficha.classList.add("ficha");

    if (jugador === "Jugador") {
        fichasJugadorDiv.appendChild(ficha);
    } else {
        fichasRivalDiv.appendChild(ficha);
    }
}

// Avanzar fase
function avanzarFase() {
    if (faseActual < 3) {
        faseActual += 1; // Avanzar a la siguiente fase
        actualizarFaseTexto();
        turnoActual = "Jugador"; // Reinicia el turno al jugador
        actualizarTurnoTexto();
        empezarApuestas(); // Inicia la nueva fase de apuestas
    } else {
        // Ronda terminada: Revelar las cartas del rival
        mostrarCartasRival(true); // Revelar cartas del rival
        alert("Ronda terminada. ¡Prepárate para la siguiente ronda!");
        faseActual = 0; // Reinicia las fases
        repartirCartas(); // Reparte nuevas cartas
    }
}

// Actualizar indicadores de fase y turno
function actualizarFaseTexto() {
    const fases = ["Grande", "Chica", "Pares", "Juego"];
    faseTexto.innerText = `Fase: ${fases[faseActual]}`;
}

function actualizarTurnoTexto() {
    turnoTexto.innerText = `Turno: ${turnoActual}`;
}

// Cambiar turno
function cambiarTurno() {
    turnoActual = turnoActual === "Jugador" ? "Rival" : "Jugador";
    actualizarTurnoTexto();
}

// Funciones de apuesta del jugador y rival
// (Integradas previamente)
