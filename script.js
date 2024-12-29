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
    habilitarBotonesMus(); // Habilitar los botones de mus
    actualizarFaseTexto("Grande");
    actualizarTurnoTexto("Jugador");
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

// Actualizar indicadores de fase y turno
function actualizarFaseTexto(fase) {
    const fases = {
        Grande: "Grande",
        Chica: "Chica",
        Pares: "Pares",
        Juego: "Juego",
    };
    faseTexto.innerText = `Fase: ${fases[fase] || "Inicio"}`;
}

function actualizarTurnoTexto(turno) {
    turnoTexto.innerText = `Turno: ${turno}`;
}

// Habilitar botones de mus
function habilitarBotonesMus() {
    document.getElementById("pedir-mus").style.display = "inline-block";
    document.getElementById("no-hay-mus").style.display = "inline-block";
}

// Ocultar botones de mus
function ocultarBotonesMus() {
    document.getElementById("pedir-mus").style.display = "none";
    document.getElementById("no-hay-mus").style.display = "none";
}

// Pedir mus
function pedirMus() {
    if (cartasSeleccionadas.length === 0) {
        alert("Selecciona al menos una carta para descartar.");
        return;
    }

    // Reemplazar las cartas seleccionadas
    cartasSeleccionadas.forEach(index => {
        manoJugador[index] = mazoBarajado.pop();
    });

    cartasSeleccionadas = [];
    mostrarCartasJugador();

    if (decidirRivalMus()) {
        alert("El rival también pide mus. Se reparten nuevas cartas.");
        repartirCartas(); // Nuevo reparto solo si ambos piden mus
    } else {
        alert("El rival corta el mus. Comienzan las apuestas.");
        ocultarBotonesMus();
        empezarApuestas(); // Iniciar apuestas con las cartas actuales
    }
}

// Decisión del rival sobre el mus
function decidirRivalMus() {
    return Math.random() < 0.5; // Probabilidad aleatoria de aceptar el mus
}

// Cortar el mus
function cortarMus() {
    alert("No hay mus. Comienzan las apuestas.");
    ocultarBotonesMus(); // Oculta los botones de mus
    faseActual = 0; // Inicia con la fase Grande
    turnoActual = "Jugador"; // Siempre empieza el jugador
    actualizarFaseTexto("Grande");
    actualizarTurnoTexto("Jugador");
    empezarApuestas(); // Iniciar apuestas con las cartas actuales
}

// Empezar la fase de apuestas
function empezarApuestas() {
    actualizarFaseTexto(["Grande", "Chica", "Pares", "Juego"][faseActual]);
    actualizarTurnoTexto(turnoActual);
    apuestasDiv.style.display = "block";
}

// Avanzar fase
function avanzarFase() {
    if (faseActual < 3) {
        faseActual += 1; // Avanzar a la siguiente fase
        actualizarFaseTexto(["Grande", "Chica", "Pares", "Juego"][faseActual]);
        turnoActual = "Jugador"; // Reinicia el turno al jugador
        actualizarTurnoTexto(turnoActual);
        empezarApuestas(); // Inicia la nueva fase de apuestas
    } else {
        // Ronda terminada: Revelar las cartas del rival
        mostrarCartasRival(true); // Revelar cartas del rival
        alert("Ronda terminada. ¡Prepárate para la siguiente ronda!");
        faseActual = 0; // Reinicia las fases
        repartirCartas(); // Reparte nuevas cartas
    }
}

// Eventos
document.getElementById("iniciar").addEventListener("click", repartirCartas);
document.getElementById("pedir-mus").addEventListener("click", pedirMus);
document.getElementById("no-hay-mus").addEventListener("click", cortarMus);
