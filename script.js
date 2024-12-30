// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Máquina", piedras: 0, cartas: [] };
let turnoJugador = true;
const fases = ["Mus", "Grande", "Chica", "Pares", "Juego"];
let faseActualIndex = 0;
let fase = fases[faseActualIndex];
let apuestaActual = 0;
let baraja = [];
let cartasSeleccionadas = [];
const registro = document.getElementById("registroDecisiones");

// Elementos HTML
const turnoDisplay = document.getElementById("turno");
const faseDisplay = document.getElementById("fase");
const marcadorDisplay = document.getElementById("marcador");
const cartasJugador1 = document.getElementById("cartasJugador1");
const cartasJugador2 = document.getElementById("cartasJugador2");
const botonConfirmarDescarte = document.getElementById("confirmarDescarte");

// Botones para aceptar o rechazar apuestas
const botonAceptarApuesta = document.getElementById("aceptarApuesta");
const botonRechazarApuesta = document.getElementById("rechazarApuesta");

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

// Iniciar la fase de Grande
function iniciarFaseGrande() {
  faseActualIndex = 1; // Cambiar a la fase Grande
  fase = fases[faseActualIndex];
  document.getElementById("mus").style.display = "none";
  document.getElementById("noMus").style.display = "none";
  alternarBotonesApuestas(true);
  actualizarInterfaz();
}

// Alternar visibilidad de los botones de apuesta
function alternarBotonesApuestas(visible) {
  const display = visible ? "inline-block" : "none";
  document.getElementById("envite").style.display = display;
  document.getElementById("ordago").style.display = display;
  document.getElementById("pasar").style.display = display;
}

// Eventos para aceptar o rechazar apuestas
botonAceptarApuesta.addEventListener("click", () => {
  actualizarRegistro("Jugador 1 acepta la apuesta.");
  jugador1.piedras += apuestaActual;
  mostrarBotonesApuesta(false);
  avanzarFase();
});

botonRechazarApuesta.addEventListener("click", () => {
  actualizarRegistro("Jugador 1 rechaza la apuesta. La máquina gana la fase.");
  jugador2.piedras += apuestaActual;
  mostrarBotonesApuesta(false);
  avanzarFase();
});

// Mostrar botones para aceptar o rechazar apuestas
function mostrarBotonesApuesta(visible) {
  const display = visible ? "inline-block" : "none";
  botonAceptarApuesta.style.display = display;
  botonRechazarApuesta.style.display = display;
}

// Avanzar a la siguiente fase
function avanzarFase() {
  faseActualIndex++;
  if (faseActualIndex >= fases.length) {
    faseActualIndex = 0; // Reiniciar a Mus si llegamos al final
  }
  fase = fases[faseActualIndex];
  apuestaActual = 0; // Reiniciar la apuesta al cambiar de fase
  actualizarInterfaz();
  reiniciarBotones(); // Resetear los botones para la nueva fase
  actualizarRegistro(`Comienza la fase ${fase}.`);
}

// Reiniciar los botones al inicio de cada fase
function reiniciarBotones() {
  alternarBotonesApuestas(true);
  document.getElementById("envite").disabled = false;
  document.getElementById("ordago").disabled = false;
  document.getElementById("pasar").disabled = false;
}

// Respuesta de la máquina a Envido
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
    mostrarBotonesApuesta(true); // Mostrar opciones para aceptar o rechazar
  } else {
    actualizarRegistro("La máquina no acepta la apuesta. Jugador 1 gana la fase.");
    turnoJugador = true;
    avanzarFase();
  }
}

// Botones de apuesta
document.getElementById("envite").addEventListener("click", () => {
  if (turnoJugador && fase === "Grande") {
    apuestaActual += 2;
    actualizarRegistro(`Jugador 1 envida 2 piedras. Apuesta actual: ${apuestaActual}`);
    turnoJugador = false;
    maquinaRespondeApuesta();
  }
});

document.getElementById("ordago").addEventListener("click", () => {
  if (turnoJugador && fase === "Grande") {
    actualizarRegistro("Jugador 1 lanza un Órdago. La máquina decide...");
    turnoJugador = false;
    maquinaRespondeOrdago();
  }
});

document.getElementById("pasar").addEventListener("click", () => {
  if (turnoJugador && fase === "Grande") {
    actualizarRegistro("Jugador 1 pasa. Turno de la máquina.");
    turnoJugador = false;
    maquinaRespondePaso();
  }
});

// Respuesta de la máquina a Órdago
function maquinaRespondeOrdago() {
  const decision = Math.random();
  if (decision < 0.5) {
    actualizarRegistro("La máquina acepta el Órdago. Resolviendo...");
    resetJuego();
  } else {
    actualizarRegistro("La máquina no acepta el Órdago. Jugador 1 gana la partida.");
    resetJuego();
  }
}

// Respuesta de la máquina a Pasar
function maquinaRespondePaso() {
  const decision = Math.random();
  if (decision < 0.5) {
    actualizarRegistro("La máquina también pasa. Avanzamos a la siguiente fase.");
    avanzarFase();
  } else {
    apuestaActual += 2;
    actualizarRegistro(`La máquina envida 2 piedras. Apuesta actual: ${apuestaActual}`);
    mostrarBotonesApuesta(true);
  }
}

// Reiniciar el juego
function resetJuego() {
  faseActualIndex = 0;
  fase = fases[faseActualIndex];
  apuestaActual = 0;
  inicializarJuego();
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
  mostrarCartas();
  actualizarInterfaz();
}

inicializarJuego();