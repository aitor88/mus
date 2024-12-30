// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Máquina", piedras: 0, cartas: [] };
let turnoJugador = true;
const fases = ["Mus", "Grande", "Chica", "Pares", "Juego"];
let faseActualIndex = 0;
let fase = fases[faseActualIndex];
let apuestaActual = 0;
let baraja = [];
let cartasSeleccionadas = []; // Cartas seleccionadas por el jugador para descarte
const registro = document.getElementById("registroDecisiones");

// Elementos HTML
const turnoDisplay = document.getElementById("turno");
const faseDisplay = document.getElementById("fase");
const marcadorDisplay = document.getElementById("marcador");
const cartasJugador1 = document.getElementById("cartasJugador1");
const cartasJugador2 = document.getElementById("cartasJugador2");
const botonMus = document.getElementById("mus");
const botonNoMus = document.getElementById("noMus");
const botonEnvite = document.getElementById("envite");
const botonOrdago = document.getElementById("ordago");
const botonPasar = document.getElementById("pasar");
const botonAceptarApuesta = document.getElementById("aceptarApuesta");
const botonRechazarApuesta = document.getElementById("rechazarApuesta");

// Botón de confirmación para descarte
const botonConfirmarDescarte = document.createElement("button");
botonConfirmarDescarte.textContent = "Confirmar Descarte";
botonConfirmarDescarte.style.display = "none";
document.body.appendChild(botonConfirmarDescarte);

// Crear y barajar baraja
function crearBaraja() {
  const palos = ["oros", "copas", "espadas", "bastos"];
  const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  baraja = [];
  palos.forEach((palo) => {
    valores.forEach((valor) => {
      baraja.push({ valor, palo });
    });
  });
}

function barajarCartas() {
  baraja.sort(() => Math.random() - 0.5);
}

function formatearCarta(carta) {
  const valorFormateado = carta.valor.toString().padStart(2, "0");
  return `assets/cartas/${valorFormateado}-${carta.palo}.png`;
}

// Repartir cartas
function repartirCartas() {
  jugador1.cartas = baraja.splice(0, 4).sort((a, b) => b.valor - a.valor);
  jugador2.cartas = baraja.splice(0, 4).sort((a, b) => b.valor - a.valor);
  mostrarCartas();
}

function mostrarCartas() {
  cartasJugador1.innerHTML = jugador1.cartas
    .map(
      (carta, index) =>
        `<img src="${formatearCarta(carta)}" alt="${carta.valor} de ${carta.palo}" data-index="${index}" class="carta ${
          cartasSeleccionadas.includes(index) ? "seleccionada" : ""
        }">`
    )
    .join("");

  cartasJugador2.innerHTML = jugador2.cartas
    .map(() => `<img src="assets/cartas/reverso.png" alt="Carta oculta">`)
    .join("");

  // Habilitar clic en las cartas del jugador para seleccionar
  document.querySelectorAll("#cartasJugador1 .carta").forEach((carta) => {
    carta.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      if (cartasSeleccionadas.includes(index)) {
        cartasSeleccionadas = cartasSeleccionadas.filter((i) => i !== index);
      } else if (cartasSeleccionadas.length < 4) {
        cartasSeleccionadas.push(index);
      }
      mostrarCartas(); // Actualizar visualmente las cartas seleccionadas
    });
  });
}

// Actualizar registro de decisiones
function actualizarRegistro(mensaje) {
  const entrada = document.createElement("li");
  entrada.textContent = mensaje;
  registro.appendChild(entrada);
}

// Cambiar a la siguiente fase
function cambiarAFaseSiguiente() {
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

// Mostrar botón de descarte
function mostrarBotonDescarte() {
  botonConfirmarDescarte.style.display = "inline-block";
  actualizarRegistro("Selecciona las cartas que deseas descartar.");
}

// Confirmar descarte
botonConfirmarDescarte.addEventListener("click", () => {
  if (cartasSeleccionadas.length > 0) {
    cartasSeleccionadas.forEach((index) => {
      jugador1.cartas[index] = baraja.shift();
    });
    cartasSeleccionadas = []; // Limpiar selección
    mostrarCartas();
    actualizarRegistro("Se han repartido nuevas cartas.");
    botonConfirmarDescarte.style.display = "none";
    maquinaDescarta(); // Máquina realiza su descarte
  } else {
    actualizarRegistro("No seleccionaste cartas para descartar.");
  }
});

// Máquina realiza su descarte
function maquinaDescarta() {
  const cantidadDescartar = Math.floor(Math.random() * 4); // Máquina descarta de 0 a 3 cartas
  for (let i = 0; i < cantidadDescartar; i++) {
    jugador2.cartas[i] = baraja.shift();
  }
  actualizarRegistro("La máquina ha realizado su descarte.");
}

// Máquina decide sobre el Mus
function maquinaDecideMus(jugadorPidioMus) {
  const decision = Math.random();
  if (decision < 0.5) {
    actualizarRegistro("La máquina acepta el Mus.");
    if (jugadorPidioMus) {
      mostrarBotonDescarte();
    }
  } else {
    actualizarRegistro("La máquina corta el Mus. Comienza la fase de Grande.");
    iniciarFaseGrande();
  }
}

// Botón de Mus
botonMus.addEventListener("click", () => {
  actualizarRegistro("Jugador 1 ha pedido Mus.");
  maquinaDecideMus(true);
});

// Botón de No hay Mus
botonNoMus.addEventListener("click", () => {
  actualizarRegistro("Jugador 1 ha cortado el Mus. Comienza la fase de Grande.");
  iniciarFaseGrande();
});

// Iniciar la fase de Grande
function iniciarFaseGrande() {
  faseActualIndex = 1; // Cambiar a la fase Grande
  fase = fases[faseActualIndex];
  botonMus.style.display = "none";
  botonNoMus.style.display = "none";
  actualizarInterfaz();
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