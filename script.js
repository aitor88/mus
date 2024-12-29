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
let cartasSeleccionadas = []; // Índices de cartas seleccionadas

// Referencias del DOM
const marcadorJugador = document.getElementById("piedras-jugador");
const marcadorRival = document.getElementById("piedras-rival");
const cartasJugadorDiv = document.getElementById("cartas-jugador");
const cartasRivalDiv = document.getElementById("cartas-rival");

// Función para mostrar cartas del jugador
function mostrarCartasJugador() {
    cartasJugadorDiv.innerHTML = "";
    manoJugador.forEach((carta, index) => {
        const cartaHTML = `
            <div id="carta-${index}" class="carta" onclick="seleccionarCarta(${index})">
                ${carta.valor} de ${carta.palo}
            </div>`;
        cartasJugadorDiv.innerHTML += cartaHTML;
    });
}

// Función para mostrar cartas del rival
function mostrarCartasRival() {
    cartasRivalDiv.innerHTML = "";
    manoRival.forEach(carta => {
        const cartaHTML = `
            <div class="carta">
                ${carta.valor} de ${carta.palo}
            </div>`;
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

// Seleccionar una carta
function seleccionarCarta(index) {
    const cartaElement = document.getElementById(`carta-${index}`);
    if (cartasSeleccionadas.includes(index)) {
        // Desmarcar carta
        cartasSeleccionadas = cartasSeleccionadas.filter(i => i !== index);
        cartaElement.classList.remove("seleccionada");
    } else {
        // Marcar carta
        cartasSeleccionadas.push(index);
        cartaElement.classList.add("seleccionada");
    }
}

// Pedir Mus
function pedirMus() {
    if (cartasSeleccionadas.length === 0) {
        alert("Selecciona al menos una carta para descartar.");
        return;
    }

    // Reemplazar cartas seleccionadas
    const mazoBarajado = barajarMazo();
    cartasSeleccionadas.forEach(index => {
        manoJugador[index] = mazoBarajado.pop();
    });

    // Limpiar selección
    cartasSeleccionadas = [];
    mostrarCartasJugador();
}

// Actualizar marcador
function actualizarMarcador() {
    marcadorJugador.innerText = piedrasJugador;
    marcadorRival.innerText = piedrasRival;
}

// Eventos
document.getElementById("iniciar").addEventListener("click", repartirCartas);
document.getElementById("mus").addEventListener("click", pedirMus);

// Inicializar el juego
repartirCartas();
