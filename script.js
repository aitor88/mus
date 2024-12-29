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
let faseActual = 0;
let turnoActual = "Jugador";

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

// Formatear números con dos dígitos
function formatoDosDigitos(valor) {
    return valor.toString().padStart(2, "0");
}

// Función para repartir cartas
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

    habilitarBotonesMus();

    console.log("Cartas repartidas y botones de Mus habilitados.");
}

// Función para seleccionar cartas
function seleccionarCarta(index) {
    const cartaElement = document.getElementById(`carta-${index}`);
    if (cartasSeleccionadas.includes(index)) {
        cartasSeleccionadas = cartasSeleccionadas.filter(i => i !== index);
        cartaElement.classList.remove("seleccionada");
    } else {
        cartasSeleccionadas.push(index);
        cartaElement.classList.add("seleccionada");
    }
    console.log("Cartas seleccionadas:", cartasSeleccionadas);
}

// Mostrar y ocultar botones
function habilitarBotonesMus() {
    document.getElementById("pedir-mus").style.display = "inline-block";
    document.getElementById("no-hay-mus").style.display = "inline-block";
}

function ocultarBotonesMus() {
    document.getElementById("pedir-mus").style.display = "none";
    document.getElementById("no-hay-mus").style.display = "none";
}

// Actualizar indicadores
function actualizarFaseTexto(fase) {
    document.getElementById("fase-actual").innerText = `Fase: ${fase}`;
}

function actualizarTurnoTexto(turno) {
    document.getElementById("turno-actual").innerText = `Turno: ${turno}`;
}

// Evento para el botón "Iniciar Ronda"
document.getElementById("iniciar").addEventListener("click", repartirCartas);
