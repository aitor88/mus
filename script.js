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
  cambiarAFaseSiguiente(); // Cambiamos a la siguiente fase
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
    cambiarAFaseSiguiente(); // Cambiamos a la siguiente fase
  }
}

// Iniciar la fase de descarte
function iniciarDescarte() {
  actualizarRegistro("Ambos jugadores aceptan Mus. Inicia el descarte.");
  document.getElementById("mus").style.display = "none";
  document.getElementById("noMus").style.display = "none";
  botonConfirmarDescarte.style.display = "block";
}

// Cambiar a la siguiente fase
function cambiarAFaseSiguiente() {
  faseActualIndex++;
  if (faseActualIndex >= fases.length) {
    faseActualIndex = 0; // Reiniciar a Mus si llegamos al final
  }
  fase = fases[faseActualIndex];
  actualizarInterfaz();
  if (fase === "Grande") {
    iniciarFaseGrande();
  }
}

// Iniciar la fase de Grande
function iniciarFaseGrande() {
  alternarBotonesApuestas(true); // Mostrar botones de apuesta
  actualizarRegistro("Comienza la fase Grande.");
}

// Alternar visibilidad de los botones de apuesta
function alternarBotonesApuestas(visible) {
  const display = visible ? "inline-block" : "none";
  document.getElementById("envite").style.display = display;
  document.getElementById("ordago").style.display = display;
  document.getElementById("pasar").style.display = display;
}

// Actualizar interfaz
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