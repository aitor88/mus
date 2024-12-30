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

// Mostrar cartas (solo para desarrollo)
function mostrarCartas() {
  cartasJugador1.innerHTML = jugador1.cartas.map(carta => `${carta.valor} de ${carta.palo}`).join(", ");
  cartasJugador2.innerHTML = jugador2.cartas.map(carta => `${carta.valor} de ${carta.palo}`).join(", ");
}

// Resolver la jugada de una fase
function resolverJugada(fase) {
  let ganador = null;

  switch (fase) {
    case "Grande":
      ganador = compararGrande();
      break;
    case "Chica":
      ganador = compararChica();
      break;
    case "Pares":
      ganador = compararPares();
      break;
    case "Juego":
      ganador = compararJuego();
      break;
    case "Punto":
      ganador = compararPunto();
      break;
  }

  if (ganador) {
    ganador.piedras += apuestas[fase.toLowerCase()];
    alert(`${ganador.nombre} gana la fase de ${fase} y recibe ${apuestas[fase.toLowerCase()]} piedras`);
  } else {
    alert(`Empate en la fase de ${fase}`);
  }

  // Reiniciar las apuestas de esta fase
  apuestas[fase.toLowerCase()] = 0;

  // Cambiar a la siguiente fase
  avanzarFase();
  actualizarInterfaz();
}

// Comparar Grande
function compararGrande() {
  const valorJugador1 = calcularValorGrande(jugador1.cartas);
  const valorJugador2 = calcularValorGrande(jugador2.cartas);

  if (valorJugador1 > valorJugador2) return jugador1;
  if (valorJugador2 > valorJugador1) return jugador2;
  return null; // Empate
}

// Comparar Chica
function compararChica() {
  const valorJugador1 = calcularValorChica(jugador1.cartas);
  const valorJugador2 = calcularValorChica(jugador2.cartas);

  if (valorJugador1 < valorJugador2) return jugador1;
  if (valorJugador2 < valorJugador1) return jugador2;
  return null; // Empate
}

// Comparar Pares
function compararPares() {
  const paresJugador1 = contarPares(jugador1.cartas);
  const paresJugador2 = contarPares(jugador2.cartas);

  if (paresJugador1 > paresJugador2) return jugador1;
  if (paresJugador2 > paresJugador1) return jugador2;
  return null; // Empate
}

// Comparar Juego
function compararJuego() {
  const juegoJugador1 = calcularJuego(jugador1.cartas);
  const juegoJugador2 = calcularJuego(jugador2.cartas);

  if (juegoJugador1 > juegoJugador2) return jugador1;
  if (juegoJugador2 > juegoJugador1) return jugador2;
  return null; // Empate
}

// Comparar Punto
function compararPunto() {
  const puntoJugador1 = calcularPunto(jugador1.cartas);
  const puntoJugador2 = calcularPunto(jugador2.cartas);

  if (puntoJugador1 > puntoJugador2) return jugador1;
  if (puntoJugador2 > puntoJugador1) return jugador2;
  return null; // Empate
}

// Calcular valor Grande
function calcularValorGrande(cartas) {
  return cartas.reduce((acc, carta) => acc + carta.valor, 0);
}

// Calcular valor Chica
function calcularValorChica(cartas) {
  return cartas.reduce((acc, carta) => acc + carta.valor, 0);
}

// Contar Pares
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

// Calcular Juego
function calcularJuego(cartas) {
  const suma = cartas.reduce((acc, carta) => acc + carta.valor, 0);
  return suma >= 31 ? suma : 0;
}

// Calcular Punto
function calcularPunto(cartas) {
  const suma = cartas.reduce((acc, carta) => acc + carta.valor, 0);
  return suma < 31 ? suma : 0;
}

// Avanzar a la siguiente fase
function avanzarFase() {
  const fases = ["Grande", "Chica", "Pares", "Juego", "Punto"];
  const indice = fases.indexOf(fase);

  if (indice < fases.length - 1) {
    fase = fases[indice + 1];
  } else {
    fase = "Reparto"; // Reiniciar las fases
    repartirCartas();
  }
}

// Iniciar el juego
iniciarJuego();