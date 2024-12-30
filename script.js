// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Jugador 2", piedras: 0, cartas: [] };
let turno = 1;
let fase = "Reparto";
let baraja = [];
let descarte = [];
let apuestas = { grande: 0, chica: 0, pares: 0, juego: 0 };

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
    .map(carta => `<img src="assets/cartas/${formatearCarta(carta)}.png" alt="${carta.valor} de ${carta.palo}">`)
    .join("");

  cartasJugador2.innerHTML = jugador2.cartas
    .map(() => `<img src="assets/cartas/reverso.png" alt="Reverso">`)
    .join("");
}

// Formatear cartas para las imágenes
function formatearCarta(carta) {
  const valorFormateado = carta.valor.toString().padStart(2, "0");
  return `${valorFormateado}-${carta.palo}`;
}

// Cambiar turno
function cambiarTurno() {
  turno = turno === 1 ? 2 : 1;
  turnoDisplay.textContent = `Turno: ${turno === 1 ? "Jugador 1" : "Jugador 2"}`;
}

// Resolver jugada
function resolverJugada() {
  cartasJugador2.innerHTML = jugador2.cartas
    .map(carta => `<img src="assets/cartas/${formatearCarta(carta)}.png" alt="${carta.valor} de ${carta.palo}">`)
    .join("");
  alert("Resolviendo la jugada...");
}

// Configurar botones
document.getElementById("mus").addEventListener("click", () => {
  alert("Mus pedido.");
  repartirCartas();
});

document.getElementById("noMus").addEventListener("click", () => {
  alert("No hay Mus. Inicia Grande.");
  fase = "Grande";
  actualizarInterfaz();
});

document.getElementById("ordago").addEventListener("click", resolverJugada);

// Inicializar juego
function inicializarJuego() {
  crearBaraja();
  barajarCartas();
  repartirCartas();
  actualizarInterfaz();
}

function actualizarInterfaz() {
  faseDisplay.textContent = `Fase actual: ${fase}`;
  marcadorDisplay.textContent = `Marcador: Jugador 1: ${jugador1.piedras} | Jugador 2: ${jugador2.piedras}`;
}

inicializarJuego();