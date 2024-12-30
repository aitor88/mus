// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Máquina", piedras: 0, cartas: [] }; // Controlado por la máquina
let turnoJugador = true; // Indica si es el turno del jugador
let fase = "Reparto";
let apuestaActual = 0;
let baraja = [];
const registro = document.getElementById("registroDecisiones");

// Elementos HTML
const turnoDisplay = document.getElementById("turno");
const faseDisplay = document.getElementById("fase");
const marcadorDisplay = document.getElementById("marcador");
const cartasJugador1 = document.getElementById("cartasJugador1");
const cartasJugador2 = document.getElementById("cartasJugador2");

// Crear y barajar baraja
function crearBaraja() {
  const palos = ["oros", "copas", "espadas", "bastos"];
  const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  baraja = [];
  palos.forEach(palo => {
    valores.forEach(valor => {
      baraja.push({ valor, palo });
    });
  });
}

function barajarCartas() {
  baraja.sort(() => Math.random() - 0.5);
}

// Repartir cartas
function repartirCartas() {
  jugador1.cartas = baraja.splice(0, 4).sort((a, b) => b.valor - a.valor);
  jugador2.cartas = baraja.splice(0, 4).sort((a, b) => b.valor - a.valor);
  mostrarCartas();
}

function mostrarCartas() {
  cartasJugador1.innerHTML = jugador1.cartas
    .map(carta => `<img src="assets/cartas/${carta.valor}-${carta.palo}.png" alt="${carta.valor} de ${carta.palo}">`)
    .join("");

  cartasJugador2.innerHTML = jugador2.cartas
    .map(() => `<img src="assets/cartas/reverso.png" alt="Carta oculta">`)
    .join("");
}

// Actualizar registro
function actualizarRegistro(mensaje) {
  const entrada = document.createElement("li");
  entrada.textContent = mensaje;
  registro.appendChild(entrada);
}

// Lógica de los botones
document.getElementById("envite").addEventListener("click", () => {
  if (turnoJugador) {
    apuestaActual += 2;
    actualizarRegistro(`Jugador 1 envida. Apuesta actual: ${apuestaActual}`);
    turnoJugador = false;
    setTimeout(maquinaRespondeApuesta, 1000);
  }
});

document.getElementById("ordago").addEventListener("click", () => {
  if (turnoJugador) {
    actualizarRegistro("Jugador 1 lanza un Órdago. La máquina decide...");
    turnoJugador = false;
    setTimeout(maquinaRespondeOrdago, 1000);
  }
});

document.getElementById("pasar").addEventListener("click", () => {
  if (turnoJugador) {
    actualizarRegistro("Jugador 1 pasa. Turno de la máquina.");
    turnoJugador = false;
    setTimeout(maquinaRespondePaso, 1000);
  }
});

// Respuestas de la máquina
function maquinaRespondeApuesta() {
  const decision = Math.random();
  if (decision < 0.5) {
    actualizarRegistro("La máquina acepta la apuesta.");
    turnoJugador = true;
  } else if (decision < 0.8) {
    apuestaActual += 2;
    actualizarRegistro(`La máquina sube la apuesta. Apuesta actual: ${apuestaActual}`);
    turnoJugador = true;
  } else {
    actualizarRegistro("La máquina no acepta la apuesta. Jugador 1 gana la fase.");
    turnoJugador = true;
  }
}

function maquinaRespondeOrdago() {
  const decision = Math.random();
  if (decision < 0.5) {
    actualizarRegistro("La máquina acepta el Órdago. Resolviendo...");
  } else {
    actualizarRegistro("La máquina no acepta el Órdago. Jugador 1 gana el juego.");
  }
}

function maquinaRespondePaso() {
  const decision = Math.random();
  if (decision < 0.5) {
    actualizarRegistro("La máquina también pasa.");
  } else {
    apuestaActual += 2;
    actualizarRegistro(`La máquina envida. Apuesta actual: ${apuestaActual}`);
    turnoJugador = true;
  }
}

// Actualizar la interfaz
function actualizarInterfaz() {
  turnoDisplay.textContent = `Turno: ${turnoJugador ? "Jugador 1" : "Máquina"}`;
  faseDisplay.textContent = `Fase actual: ${fase}`;
  marcadorDisplay.textContent = `Marcador: Jugador 1: ${jugador1.piedras} | Máquina: ${jugador2.piedras}`;
}

// Inicializar el juego
function inicializarJuego() {
  crearBaraja();
  barajarCartas();
  repartirCartas();
  actualizarInterfaz();
}

inicializarJuego();