// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Jugador 2", piedras: 0, cartas: [] }; // Controlado por la máquina
let turno = 1;
let fase = "Reparto";
let acuerdoMus = false;
let baraja = [];
let cartasSeleccionadas = [];
const botonConfirmarDescarte = document.getElementById("confirmarDescarte");

// Elementos HTML
const turnoDisplay = document.getElementById("turno");
const faseDisplay = document.getElementById("fase");
const marcadorDisplay = document.getElementById("marcador");
const cartasJugador1 = document.getElementById("cartasJugador1");
const cartasJugador2 = document.getElementById("cartasJugador2");

// Crear baraja y repartir cartas
function crearBaraja() {
  const palos = ["oros", "copas", "espadas", "bastos"];
  const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  baraja = [];
  for (let palo of palos) {
    for (let valor of valores) {
      baraja.push({ valor, palo });
    }
  }
}

function barajarCartas() {
  baraja.sort(() => Math.random() - 0.5);
}

function repartirCartas() {
  jugador1.cartas = baraja.splice(0, 4);
  jugador2.cartas = baraja.splice(0, 4);
  mostrarCartas();
}

// Mostrar cartas
function mostrarCartas() {
  cartasJugador1.innerHTML = jugador1.cartas
    .map(
      (carta, index) =>
        `<img src="assets/cartas/${formatearCarta(carta)}.png" alt="${carta.valor} de ${carta.palo}" data-index="${index}" class="carta">`
    )
    .join("");

  document.querySelectorAll("#cartasJugador1 img").forEach(carta => {
    carta.addEventListener("click", () => seleccionarCartaParaDescarte(carta));
  });

  cartasJugador2.innerHTML = jugador2.cartas
    .map(() => `<img src="assets/cartas/reverso.png" alt="Reverso">`)
    .join("");
}

// Formatear cartas para las imágenes
function formatearCarta(carta) {
  const valorFormateado = carta.valor.toString().padStart(2, "0");
  return `${valorFormateado}-${carta.palo}`;
}

// Registro de decisiones
function actualizarRegistro(mensaje) {
  const registro = document.getElementById("registroDecisiones");
  const nuevaEntrada = document.createElement("li");
  nuevaEntrada.textContent = mensaje;
  registro.appendChild(nuevaEntrada);
  registro.scrollTop = registro.scrollHeight;
}

// Seleccionar cartas para el descarte
function seleccionarCartaParaDescarte(carta) {
  const index = carta.getAttribute("data-index");

  if (cartasSeleccionadas.includes(index)) {
    cartasSeleccionadas = cartasSeleccionadas.filter(i => i !== index);
    carta.classList.remove("seleccionada");
  } else {
    cartasSeleccionadas.push(index);
    carta.classList.add("seleccionada");
  }

  botonConfirmarDescarte.style.display = cartasSeleccionadas.length > 0 ? "block" : "none";
}

// Confirmar descarte
botonConfirmarDescarte.addEventListener("click", () => {
  cartasSeleccionadas.forEach(index => {
    jugador1.cartas[index] = baraja.pop();
  });

  actualizarRegistro("Jugador 1 ha descartado y recibido nuevas cartas.");
  cartasSeleccionadas = [];
  document.getElementById("descarte").style.display = "none";
  botonConfirmarDescarte.style.display = "none";

  fase = "Grande";
  actualizarInterfaz();
});

// Acciones del Mus
document.getElementById("mus").addEventListener("click", () => {
  actualizarRegistro("Jugador 1 ha pedido Mus.");
  maquinaDecideMus(true);
});

document.getElementById("noMus").addEventListener("click", () => {
  actualizarRegistro("Jugador 1 ha cortado el Mus. La partida comienza sin descartes.");
  acuerdoMus = false;
  fase = "Grande";
  actualizarInterfaz();
});

function maquinaDecideMus(jugadorQuiereMus) {
  if (Math.random() > 0.5) {
    actualizarRegistro("La máquina también quiere Mus.");
    acuerdoMus = jugadorQuiereMus;
    activarDescarte();
  } else {
    actualizarRegistro("La máquina corta el Mus. La partida comienza sin descartes.");
    acuerdoMus = false;
    fase = "Grande";
    actualizarInterfaz();
  }
}

function activarDescarte() {
  actualizarRegistro("Ambos han aceptado el Mus. La máquina descarta automáticamente.");
  jugador2.cartas = baraja.splice(0, 4);
  mostrarCartas();
}

function actualizarInterfaz() {
  faseDisplay.textContent = `Fase actual: ${fase}`;
  marcadorDisplay.textContent = `Marcador: Jugador 1: ${jugador1.piedras} | Jugador 2: ${jugador2.piedras}`;
  mostrarCartas();
}

// Inicializar el juego
function inicializarJuego() {
  crearBaraja();
  barajarCartas();
  repartirCartas();
  actualizarInterfaz();
}

inicializarJuego();