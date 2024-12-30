// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Máquina", piedras: 0, cartas: [] }; // Controlado por la máquina
let turnoJugador = true; // Indica si es el turno del jugador
const fases = ["Mus", "Grande", "Chica", "Pares", "Juego"];
let faseActualIndex = 0; // Índice de la fase actual
let fase = fases[faseActualIndex];
let apuestaActual = 0;
let baraja = [];
const registro = document.getElementById("registroDecisiones");

// Elementos HTML
const turnoDisplay = document.getElementById("turno");
const faseDisplay = document.getElementById("fase");
const marcadorDisplay = document.getElementById("marcador");

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

// Formatear el nombre de las cartas
function formatearCarta(carta) {
  const valorFormateado = carta.valor.toString().padStart(2, "0");
  return `${valorFormateado}-${carta.palo}.png`;
}

// Repartir cartas
function repartirCartas() {
  jugador1.cartas = baraja.splice(0, 4).sort((a, b) => b.valor - a.valor);
  jugador2.cartas = baraja.splice(0, 4).sort((a, b) => b.valor - a.valor);
}

// Mostrar cartas
function mostrarCartas() {
  const cartasJugador1 = document.getElementById("cartasJugador1");
  const cartasJugador2 = document.getElementById("cartasJugador2");

  cartasJugador1.innerHTML = jugador1.cartas
    .map(carta => `<img src="assets/cartas/${formatearCarta(carta)}" alt="${carta.valor} de ${carta.palo}">`)
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

// Botón de Mus
document.getElementById("mus").addEventListener("click", () => {
  actualizarRegistro("Jugador 1 ha pedido Mus.");
  maquinaDecideMus(true);
});

// Botón de No hay Mus
document.getElementById("noMus").addEventListener("click", () => {
  actualizarRegistro("Jugador 1 ha cortado el Mus. Comienza la fase de Grande.");
  iniciarFaseGrande();
});

// Decisión de la máquina sobre el Mus
function maquinaDecideMus(jugadorQuiereMus) {
  if (Math.random() > 0.5) {
    actualizarRegistro("La máquina también quiere Mus.");
    if (jugadorQuiereMus) {
      iniciarDescarte();
    }
  } else {
    actualizarRegistro("La máquina corta el Mus. Comienza la fase de Grande.");
    iniciarFaseGrande();
  }
}

// Iniciar la fase de descarte
function iniciarDescarte() {
  actualizarRegistro("Ambos jugadores aceptan Mus. Inicia el descarte.");
  document.getElementById("descarte").style.display = "block";
  document.getElementById("mus").style.display = "none";
  document.getElementById("noMus").style.display = "none";
}

// Iniciar la fase de Grande
function iniciarFaseGrande() {
  faseActualIndex = 1; // Cambia a la fase Grande
  fase = fases[faseActualIndex];
  actualizarInterfaz();
  alternarBotonesApuestas(true); // Habilitar botones de apuesta
}

// Avanzar a la siguiente fase
function avanzarFase() {
  faseActualIndex++;
  if (faseActualIndex >= fases.length) {
    actualizarRegistro("Turno completado. Resolviendo jugadas...");
    resolverJugada(); // Resolver jugadas y calcular puntos
    faseActualIndex = 1; // Reiniciar en la fase Grande para el próximo turno
  }
  fase = fases[faseActualIndex];
  actualizarInterfaz();
}

// Resolver jugadas
function resolverJugada() {
  jugador1.piedras += 1; // Ejemplo: sumar un punto al jugador 1
  actualizarPuntuacion();
}

// Actualizar puntuación visual
function actualizarPuntuacion() {
  const fichasJugador1 = document.querySelector("#puntuacionJugador1 .fichas");
  const fichasJugador2 = document.querySelector("#puntuacionJugador2 .fichas");

  // Dibujar las piedras
  fichasJugador1.innerHTML = "🟡".repeat(jugador1.piedras % 5) + "🔵".repeat(Math.floor(jugador1.piedras / 5));
  fichasJugador2.innerHTML = "🟡".repeat(jugador2.piedras % 5) + "🔵".repeat(Math.floor(jugador2.piedras / 5));
}

// Alternar botones de apuestas
function alternarBotonesApuestas(visible) {
  document.getElementById("envite").style.display = visible ? "inline-block" : "none";
  document.getElementById("ordago").style.display = visible ? "inline-block" : "none";
  document.getElementById("pasar").style.display = visible ? "inline-block" : "none";
}

// Actualizar interfaz
function actualizarInterfaz() {
  turnoDisplay.textContent = `Turno: ${turnoJugador ? "Jugador 1" : "Máquina"}`;
  faseDisplay.textContent = `Fase actual: ${fase}`;
  marcadorDisplay.textContent = `Marcador: Jugador 1: ${jugador1.piedras} | Máquina: ${jugador2.piedras}`;
  document.getElementById("apuestaActual").textContent = `Apuesta actual: ${apuestaActual}`;
}

// Inicializar el juego
function inicializarJuego() {
  crearBaraja();
  barajarCartas();
  repartirCartas();
  mostrarCartas();
  actualizarInterfaz();
}

inicializarJuego();