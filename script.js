// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Jugador 2", piedras: 0, cartas: [] };
let turno = 1; // 1 para Jugador 1, 2 para Jugador 2
let fase = "Reparto"; // Fases: Reparto, Grande, Chica, Pares, Juego, Punto
let baraja = [];
let descarte = [];
let apuestas = { grande: 0, chica: 0, pares: 0, juego: 0 };

// Elementos HTML
const turnoDisplay = document.getElementById("turno");
const faseDisplay = document.getElementById("fase");
const marcadorDisplay = document.getElementById("marcador");
const cartasJugador1 = document.getElementById("cartasJugador1");
const cartasJugador2 = document.getElementById("cartasJugador2");

// Inicializar el juego
function iniciarJuego() {
  crearBaraja();
  barajarCartas();
  repartirCartas();
  fase = "Reparto";
  actualizarInterfaz();
}

// Crear baraja española
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

// Barajar cartas
function barajarCartas() {
  baraja = baraja.sort(() => Math.random() - 0.5);
}

// Repartir cartas
function repartirCartas() {
  jugador1.cartas = baraja.splice(0, 4);
  jugador2.cartas = baraja.splice(0, 4);
}

// Cambiar turno
function cambiarTurno() {
  turno = turno === 1 ? 2 : 1;
  turnoDisplay.textContent = `Turno: ${turno === 1 ? "Jugador 1" : "Jugador 2"}`;
}

// Actualizar interfaz
function actualizarInterfaz() {
  faseDisplay.textContent = `Fase actual: ${fase}`;
  marcadorDisplay.textContent = `Marcador: Jugador 1: ${jugador1.piedras} | Jugador 2: ${jugador2.piedras}`;
  mostrarCartas();
}

// Mostrar cartas (ocultar cartas del Jugador 2 hasta el final de la fase)
function mostrarCartas() {
  cartasJugador1.innerHTML = jugador1.cartas
    .map(carta => `<img src="assets/cartas/${formatearCarta(carta)}.png" alt="${carta.valor} de ${carta.palo}">`)
    .join("");

  cartasJugador2.innerHTML = jugador2.cartas
    .map(() => `<img src="assets/cartas/reverso.png" alt="Reverso">`)
    .join("");
}

// Formatear carta para coincidir con los archivos de imagen
function formatearCarta(carta) {
  const valorFormateado = carta.valor.toString().padStart(2, "0");
  return `${valorFormateado}-${carta.palo}`;
}

// Mostrar cartas del Jugador 2 al final de la fase
function revelarCartasJugador2() {
  cartasJugador2.innerHTML = jugador2.cartas
    .map(carta => `<img src="assets/cartas/${formatearCarta(carta)}.png" alt="${carta.valor} de ${carta.palo}">`)
    .join("");
}

// Resolver jugadas
function resolverJugada(fase) {
  // Resolver la fase y revelar cartas del Jugador 2
  alert(`Resolviendo la fase de ${fase}`);
  revelarCartasJugador2();
  avanzarFase();
  actualizarInterfaz();
}

// Avanzar a la siguiente fase
function avanzarFase() {
  const fases = ["Grande", "Chica", "Pares", "Juego", "Punto"];
  const indice = fases.indexOf(fase);
  fase = indice < fases.length - 1 ? fases[indice + 1] : "Reparto";
  if (fase === "Reparto") repartirCartas();
}

// Acciones de botones
document.getElementById("mus").addEventListener("click", () => {
  alert("Mus pedido. Se descartan cartas.");
  repartirCartas();
  actualizarInterfaz();
});

document.getElementById("noMus").addEventListener("click", () => {
  alert("No hay Mus. Inicia la fase de Grande.");
  fase = "Grande";
  actualizarInterfaz();
});

document.getElementById("envite").addEventListener("click", () => {
  alert("Envite realizado.");
  cambiarTurno();
});

document.getElementById("ordago").addEventListener("click", () => {
  alert("¡Órdago lanzado!");
  resolverJugada(fase);
});

document.getElementById("pasar").addEventListener("click", () => {
  alert("Pasar.");
  cambiarTurno();
});

// Iniciar el juego
iniciarJuego();