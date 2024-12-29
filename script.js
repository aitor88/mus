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
let faseActual = -1; // -1: Mus, 0: Grande, 1: Chica, 2: Pares, 3: Juego
let turnoActual = "Jugador";
let fichasJugador = 0;
let fichasRival = 0;

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
    faseActual = -1; // Fase "Mus"
    turnoActual = "Jugador";

    actualizarFaseTexto("Mus");
    actualizarTurnoTexto("Jugador");

    habilitarBotonesMus();
    ocultarBotonesApuestas();
    console.log("Cartas repartidas. Fase inicial: Mus.");
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

// Función para pedir mus
function pedirMus() {
    if (cartasSeleccionadas.length === 0) {
        alert("Selecciona al menos una carta para descartar.");
        return;
    }

    if (decidirRivalMus()) {
        alert("El rival también pide mus.");
        cartasSeleccionadas.forEach(index => {
            manoJugador[index] = mazoBarajado.pop();
        });
        cartasSeleccionadas = [];
        mostrarCartasJugador();
    } else {
        alert("El rival corta el mus. Comienza la fase Grande.");
        cortarMus();
    }
}

// Función para cortar el mus
function cortarMus() {
    alert("No hay mus. Comienza la fase Grande.");
    ocultarBotonesMus();
    ocultarBotonIniciar();
    mostrarBotonesApuestas();
    faseActual = 0; // Cambia a la fase "Grande"
    actualizarFaseTexto("Grande");
    actualizarTurnoTexto("Jugador");
}

// Decisión del rival sobre el mus
function decidirRivalMus() {
    return Math.random() < 0.5; // Probabilidad del 50%
}

// Funciones para apuestas
function apostar() {
    console.log("El jugador apuesta 1 ficha.");
    fichasJugador += 1;
    actualizarMarcador();
    cambiarTurno();
}

function subir() {
    console.log("El jugador sube la apuesta.");
    fichasJugador += 2; // Subir implica aumentar la apuesta en más de 1 ficha
    actualizarMarcador();
    cambiarTurno();
}

function pasar() {
    console.log("El jugador pasa.");
    cambiarTurno();
}

// Cambiar turno entre jugador y rival
function cambiarTurno() {
    turnoActual = turnoActual === "Jugador" ? "Rival" : "Jugador";
    actualizarTurnoTexto(turnoActual);
    if (turnoActual === "Rival") {
        setTimeout(accionRival, 1000); // Simula el turno del rival
    }
}

// Simula una acción del rival
function accionRival() {
    const decision = Math.random();
    if (decision < 0.4) {
        console.log("El rival pasa.");
    } else if (decision < 0.7) {
        console.log("El rival iguala la apuesta.");
        fichasRival += 1;
    } else {
        console.log("El rival sube la apuesta.");
        fichasRival += 2;
    }
    actualizarMarcador();
    cambiarTurno(); // Regresa el turno al jugador
}

// Mostrar/Ocultar botones
function habilitarBotonesMus() {
    document.getElementById("pedir-mus").style.display = "inline-block";
    document.getElementById("no-hay-mus").style.display = "inline-block";
}

function ocultarBotonesMus() {
    document.getElementById("pedir-mus").style.display = "none";
    document.getElementById("no-hay-mus").style.display = "none";
}

function mostrarBotonesApuestas() {
    document.getElementById("apuestas").style.display = "block";
}

function ocultarBotonesApuestas() {
    document.getElementById("apuestas").style.display = "none";
}

function ocultarBotonIniciar() {
    document.getElementById("iniciar").style.display = "none";
}

// Actualizar indicadores
function actualizarFaseTexto(fase) {
    document.getElementById("fase-actual").innerText = `Fase: ${fase}`;
}

function actualizarTurnoTexto(turno) {
    document.getElementById("turno-actual").innerText = `Turno: ${turno}`;
}

// Actualizar marcador de fichas
function actualizarMarcador() {
    document.getElementById("piedras-jugador").innerText = fichasJugador;
    document.getElementById("piedras-rival").innerText = fichasRival;
}

// Eventos para botones
document.getElementById("iniciar").addEventListener("click", repartirCartas);
document.getElementById("pedir-mus").addEventListener("click", pedirMus);
document.getElementById("no-hay-mus").addEventListener("click", cortarMus);
document.getElementById("apostar").addEventListener("click", apostar);
document.getElementById("subir").addEventListener("click", subir);
document.getElementById("pasar").addEventListener("click", pasar);
