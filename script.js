// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Jugador 2", piedras: 0, cartas: [] }; // Controlado por la máquina
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

  if (turno === 2) {
    setTimeout(accionesMaquina, 1000); // La máquina actúa después de 1 segundo
  }
}

// Resolver jugada
function resolverJugada() {
  cartasJugador2.innerHTML = jugador2.cartas
    .map(carta => `<img src="assets/cartas/${formatearCarta(carta)}.png" alt="${carta.valor} de ${carta.palo}">`)
    .join("");
  alert("Resolviendo la jugada...");
}

// Acciones de la máquina
function accionesMaquina() {
  switch (fase) {
    case "Reparto":
      maquinaDecideReparto();
      break;
    case "Grande":
      maquinaDecideGrande();
      break;
    case "Chica":
      maquinaDecideChica();
      break;
    case "Pares":
      maquinaDecidePares();
      break;
    case "Juego":
      maquinaDecideJuego();
      break;
    default:
      break;
  }
}

// Máquina en Reparto
function maquinaDecideReparto() {
  if (Math.random() > 0.5) {
    alert("La máquina corta el Mus.");
    fase = "Grande";
    actualizarInterfaz();
  } else {
    alert("La máquina pide Mus.");
    repartirCartas();
    actualizarInterfaz();
  }
}

// Máquina en Grande
function maquinaDecideGrande() {
  const valorGrande = calcularValorGrande(jugador2.cartas);

  if (valorGrande > 30) {
    alert("La máquina envida.");
    apuestas.grande += 2;
  } else {
    alert("La máquina pasa.");
  }

  cambiarTurno();
}

// Máquina en Chica
function maquinaDecideChica() {
  const valorChica = calcularValorChica(jugador2.cartas);

  if (valorChica < 15) {
    alert("La máquina envida en Chica.");
    apuestas.chica += 2;
  } else {
    alert("La máquina pasa.");
  }

  cambiarTurno();
}

// Máquina en Pares
function maquinaDecidePares() {
  const pares = contarPares(jugador2.cartas);

  if (pares > 0) {
    alert("La máquina tiene pares y pasa.");
  } else {
    alert("La máquina no tiene pares.");
  }

  cambiarTurno();
}

// Máquina en Juego
function maquinaDecideJuego() {
  const juego = calcularJuego(jugador2.cartas);

  if (juego >= 31) {
    alert("La máquina tiene Juego y lanza un Órdago.");
    apuestas.juego += 2;
  } else {
    alert("La máquina no tiene Juego y pasa.");
  }

  cambiarTurno();
}

// Cálculos
function calcularValorGrande(cartas) {
  return cartas.reduce((acc, carta) => acc + carta.valor, 0);
}

function calcularValorChica(cartas) {
  return cartas.reduce((acc, carta) => acc + carta.valor, 0);
}

function contarPares(cartas) {
  const valores = cartas.map(carta => carta.valor);
  const contador = {};
  valores.forEach(valor => {
    contador[valor] = (contador[valor] || 0) + 1;
  });

  if (Object.values(contador).includes(4)) return 3; // Duples
  if (Object.values(contador).includes(3)) return 2; // Medias
  if (Object.values(contador).includes(2)) return 1; // Par
  return 0; // Sin pares
}

function calcularJuego(cartas) {
  const suma = cartas.reduce((acc, carta) => acc + carta.valor, 0);
  return suma >= 31 ? suma : 0;
}

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

inicializarJuego();