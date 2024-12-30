// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Máquina", piedras: 0, cartas: [] };
let baraja = [];
let cartasSeleccionadas = []; // Cartas seleccionadas por el jugador para descarte
let faseActual = "Mus"; // Fase inicial

// Elementos HTML
const cartasJugador1 = document.getElementById("cartasJugador1");
const botonMus = document.getElementById("mus");
const botonNoMus = document.getElementById("noMus");
const registro = document.getElementById("registroDecisiones");

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

function repartirCartas() {
  jugador1.cartas = baraja.splice(0, 4);
  jugador2.cartas = baraja.splice(0, 4);
  mostrarCartas();
}

function mostrarCartas() {
  cartasJugador1.innerHTML = jugador1.cartas
    .map(
      (carta, index) =>
        `<img src="assets/cartas/${carta.valor
          .toString()
          .padStart(2, "0")}-${carta.palo}.png" alt="Carta ${index}" data-index="${index}" class="carta ${
          cartasSeleccionadas.includes(index) ? "seleccionada" : ""
        }">`
    )
    .join("");

  // Evento para seleccionar cartas
  document.querySelectorAll("#cartasJugador1 .carta").forEach((carta) => {
    carta.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      if (cartasSeleccionadas.includes(index)) {
        cartasSeleccionadas = cartasSeleccionadas.filter((i) => i !== index);
      } else {
        cartasSeleccionadas.push(index);
      }
      mostrarCartas(); // Actualizar visualización
    });
  });
}

function actualizarRegistro(mensaje) {
  const entrada = document.createElement("li");
  entrada.textContent = mensaje;
  registro.appendChild(entrada);
}

// Lógica de Mus
botonMus.addEventListener("click", () => {
  actualizarRegistro("Jugador 1 ha pedido Mus.");
  maquinaDecideMus();
});

botonNoMus.addEventListener("click", () => {
  actualizarRegistro("Jugador 1 ha cortado el Mus. Comienza la fase Grande.");
  iniciarFaseGrande();
});

function maquinaDecideMus() {
  const decision = Math.random();
  if (decision < 0.5) {
    actualizarRegistro("La máquina acepta el Mus.");
    mostrarDescarte();
  } else {
    actualizarRegistro("La máquina corta el Mus. Comienza la fase Grande.");
    iniciarFaseGrande();
  }
}

function mostrarDescarte() {
  actualizarRegistro("Selecciona las cartas para descartar.");
  const botonConfirmarDescarte = document.createElement("button");
  botonConfirmarDescarte.textContent = "Confirmar Descarte";
  document.body.appendChild(botonConfirmarDescarte);

  botonConfirmarDescarte.addEventListener("click", () => {
    if (cartasSeleccionadas.length > 0) {
      cartasSeleccionadas.forEach((index) => {
        jugador1.cartas[index] = baraja.shift(); // Reemplazar cartas seleccionadas
      });
      actualizarRegistro("Se han repartido nuevas cartas.");
      cartasSeleccionadas = [];
      mostrarCartas();
      botonConfirmarDescarte.remove();

      // La máquina realiza su descarte
      maquinaDescarta();
    } else {
      actualizarRegistro("No seleccionaste cartas para descartar.");
    }
  });
}

function maquinaDescarta() {
  const cantidadDescartar = Math.floor(Math.random() * 4); // Máquina descarta de 0 a 3 cartas
  for (let i = 0; i < cantidadDescartar; i++) {
    jugador2.cartas[i] = baraja.shift();
  }
  actualizarRegistro("La máquina ha realizado su descarte.");
}

// Iniciar la fase Grande
function iniciarFaseGrande() {
  faseActual = "Grande";
  botonMus.style.display = "none";
  botonNoMus.style.display = "none";
  actualizarRegistro("Fase Grande iniciada.");
}

// Inicializar el juego
function inicializarJuego() {
  crearBaraja();
  barajarCartas();
  repartirCartas();
  actualizarRegistro("Juego iniciado. Fase actual: Mus.");
}

inicializarJuego();