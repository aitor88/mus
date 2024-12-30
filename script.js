// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Máquina", piedras: 0, cartas: [] }; // Controlado por la máquina
let turnoJugador = true; // Indica si es el turno del jugador
const fases = ["Mus", "Grande", "Chica", "Pares", "Juego"];
let faseActualIndex = 0; // Índice de la fase actual
let fase = fases[faseActualIndex];
let apuestaActual = 0;
let baraja = [];
let cartasSeleccionadas = []; // Cartas seleccionadas para el descarte
const registro = document.getElementById("registroDecisiones");

// Elementos HTML
const turnoDisplay = document.getElementById("turno");
const faseDisplay = document.getElementById("fase");
const marcadorDisplay = document.getElementById("marcador");
const cartasJugador1 = document.getElementById("cartasJugador1");
const cartasJugador2 = document.getElementById("cartasJugador2");
const botonConfirmarDescarte = document.getElementById("confirmarDescarte");

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
  mostrarCartas();
}

// Mostrar cartas
function mostrarCartas() {
  cartasJugador1.innerHTML = jugador1.cartas
    .map(
      (carta, index) =>
        `<img src="assets/cartas/${formatearCarta(carta)}" alt="${carta.valor} de ${carta.palo}" data-index="${index}" class="carta">`
    )
    .join("");

  // Agregar eventos para seleccionar cartas del jugador 1
  document.querySelectorAll("#cartasJugador1 img").forEach(carta => {
    carta.addEventListener("click", () => seleccionarCartaParaDescarte(carta));
  });

  cartasJugador2.innerHTML = jugador2.cartas
    .map(() => `<img src="assets/cartas/reverso.png" alt="Carta oculta">`)
    .join("");
}

// Seleccionar cartas para descarte
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
  // Reemplazar las cartas descartadas por nuevas cartas
  cartasSeleccionadas.forEach(index => {
    jugador1.cartas[index] = baraja.pop();
  });

  // Ordenar las cartas del jugador 1 de mayor a menor
  jugador1.cartas.sort((a, b) => b.valor - a.valor);

  actualizarRegistro("Jugador 1 ha descartado y recibido nuevas cartas.");
  cartasSeleccionadas = [];
  mostrarCartas(); // Actualizar las cartas visibles después del descarte
  botonConfirmarDescarte.style.display = "none"; // Ocultar botón de descarte

  // Volver a mostrar los botones de Mus y No hay Mus
  document.getElementById("mus").style.display = "inline-block";
  document.getElementById("noMus").style.display = "inline-block";

  // Cambiar la fase a Mus para permitir decidir si hacer un nuevo Mus
  fase = "Mus";
  actualizarInterfaz();
});

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
  document.getElementById("mus").style.display = "none";
  document.getElementById("noMus").style.display = "none";
  botonConfirmarDescarte.style.display = "block";
}

// Iniciar la fase de Grande
function iniciarFaseGrande() {
  faseActualIndex = 1; // Cambia a la fase Grande
  fase = fases[faseActualIndex];
  document.getElementById("mus").style.display = "none";
  document.getElementById("noMus").style.display = "none";
  alternarBotonesApuestas(true); // Mostrar botones de apuesta
  actualizarInterfaz();
}

// Lógica de apuestas en la fase Grande
document.getElementById("envite").addEventListener("click", () => {
  if (turnoJugador && fase === "Grande") {
    apuestaActual += 2;
    actualizarRegistro(`Jugador 1 envida. Apuesta actual: ${apuestaActual}`);
    turnoJugador = false;
    setTimeout(maquinaRespondeApuesta, 1000);
  }
});

document.getElementById("ordago").addEventListener("click", () => {
  if (turnoJugador && fase === "Grande") {
    actualizarRegistro("Jugador 1 lanza un Órdago. La máquina decide...");
    turnoJugador = false;
    setTimeout(maquinaRespondeOrdago, 1000);
  }
});

document.getElementById("pasar").addEventListener("click", () => {
  if (turnoJugador && fase === "Grande") {
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
    avanzarFase();
  } else if (decision < 0.8) {
    apuestaActual += 2;
    actualizarRegistro(`La máquina sube la apuesta. Apuesta actual: ${apuestaActual}`);
    turnoJugador = true;
  } else {
    actualizarRegistro("La máquina no acepta la apuesta. Jugador 1 gana la fase.");
    turnoJugador = true;
    avanzarFase();
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
    avanzarFase();
  } else {
    apuestaActual += 2;
    actualizarRegistro(`La máquina envida. Apuesta actual: ${apuestaActual}`);
    turnoJugador = true;
  }
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
