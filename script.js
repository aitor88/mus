// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Jugador 2", piedras: 0, cartas: [] }; // Controlado por la máquina
let turno = 1;
let fase = "Reparto";
let acuerdoMus = false;
let baraja = [];
let cartasSeleccionadas = [];
let apuestaActual = 0; // Puntos apostados en la fase actual
let turnoJugador = true; // Indica si es el turno del jugador (true) o de la máquina (false)
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

// Alternar visibilidad de botones
function alternarBotonesMus(mostrarMus) {
  document.getElementById("mus").style.display = mostrarMus ? "inline-block" : "none";
  document.getElementById("noMus").style.display = mostrarMus ? "inline-block" : "none";
  document.getElementById("envite").style.display = mostrarMus ? "none" : "inline-block";
  document.getElementById("ordago").style.display = mostrarMus ? "none" : "inline-block";
  document.getElementById("pasar").style.display = mostrarMus ? "none" : "inline-block";
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
  alternarBotonesMus(false); // Muestra los botones de apuesta tras el descarte
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
  alternarBotonesMus(false); // Muestra los botones de apuestas
  actualizarInterfaz();
});

// Lógica de los botones de apuesta
document.getElementById("envite").addEventListener("click", () => {
  if (turnoJugador) {
    apuestaActual += 2; // Incrementa la apuesta
    actualizarRegistro(`Jugador 1 envida. Apuesta total: ${apuestaActual} piedras.`);
    turnoJugador = false;
    setTimeout(maquinaRespondeApuesta, 1000); // La máquina responde después de 1 segundo
  }
});

document.getElementById("ordago").addEventListener("click", () => {
  if (turnoJugador) {
    actualizarRegistro("Jugador 1 lanza un Órdago. La máquina decide...");
    turnoJugador = false;
    setTimeout(maquinaRespondeOrdago, 1000); // La máquina responde después de 1 segundo
  }
});

document.getElementById("pasar").addEventListener("click", () => {
  if (turnoJugador) {
    actualizarRegistro("Jugador 1 pasa. Turno de la máquina.");
    turnoJugador = false;
    setTimeout(maquinaRespondePaso, 1000); // La máquina responde después de 1 segundo
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
    actualizarRegistro(`La máquina reenvía. Apuesta total: ${apuestaActual} piedras.`);
    turnoJugador = true;
  } else {
    actualizarRegistro("La máquina no acepta la apuesta. El jugador gana la fase.");
    turnoJugador = true;
  }
}

function maquinaRespondeOrdago() {
  const decision = Math.random();
  if (decision < 0.5) {
    actualizarRegistro("La máquina acepta el Órdago. Resolviendo la fase...");
  } else {
    actualizarRegistro("La máquina no acepta el Órdago. El jugador gana el juego.");
  }
}

function maquinaRespondePaso() {
  const decision = Math.random();
  if (decision < 0.5) {
    actualizarRegistro("La máquina también pasa. Resolviendo la fase...");
  } else {
    apuestaActual += 2;
    actualizarRegistro(`La máquina envida. Apuesta total: ${apuestaActual} piedras.`);
    turnoJugador = true;
  }
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
  alternarBotonesMus(true);
  actualizarInterfaz();
}

inicializarJuego();