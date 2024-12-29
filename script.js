// Crear la baraja española de 40 cartas
const palos = ["oros", "copas", "espadas", "bastos"];
const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
const valorCarta = {
    1: 1, 2: 1, 3: 10, 4: 4, 5: 5, 6: 6, 7: 7, 10: 10, 11: 10, 12: 10
};

// Crear baraja
function crearBaraja() {
    const baraja = [];
    palos.forEach(palo => {
        valores.forEach(valor => {
            baraja.push({ palo, valor, puntos: valorCarta[valor] });
        });
    });
    return baraja;
}

// Barajar cartas
function barajar(baraja) {
    return baraja.sort(() => Math.random() - 0.5);
}

// Jugador y máquina
const jugador = { nombre: "Jugador", mano: [], piedras: 0 };
const maquina = { nombre: "Máquina", mano: [], piedras: 0 };
let baraja = crearBaraja();

// Fases del juego
let faseActual = "Mus"; // Fases: Mus, Grande, Chica, Pares, Juego
let turnoActual = "Jugador"; // Turnos: Jugador, Máquina
let apuestaActual = 0; // Apuesta en la fase actual

// Repartir cartas
function repartirCartas() {
    baraja = barajar(baraja);
    jugador.mano = baraja.splice(0, 4);
    maquina.mano = baraja.splice(0, 4);
    console.log("Mano del jugador:", jugador.mano);
    console.log("Mano de la máquina: [Ocultas]");
}

// Seleccionar cartas para descarte
function descarte(jugador, indices) {
    indices.forEach(index => {
        jugador.mano[index] = baraja.pop();
    });
    console.log(`${jugador.nombre} descarta y recibe nuevas cartas.`);
}

// Evaluar jugadas
function evaluarGrande(mano) {
    return mano.reduce((acum, carta) => acum + carta.puntos, 0);
}

function evaluarChica(mano) {
    return mano.reduce((acum, carta) => acum - carta.puntos, 0);
}

function evaluarJuego(mano) {
    const suma = mano.reduce((acum, carta) => acum + carta.puntos, 0);
    if (suma >= 31) return suma;
    return 0;
}

// Avanzar fases
function avanzarFase() {
    const fases = ["Mus", "Grande", "Chica", "Pares", "Juego"];
    const siguienteFase = fases[fases.indexOf(faseActual) + 1] || "Fin";
    faseActual = siguienteFase;
    console.log(`Fase actual: ${faseActual}`);
}

// Cambiar turno
function cambiarTurno() {
    turnoActual = turnoActual === "Jugador" ? "Máquina" : "Jugador";
    console.log(`Turno actual: ${turnoActual}`);
}

// Apuestas
function envidar(jugador, cantidad) {
    console.log(`${jugador.nombre} envida ${cantidad} piedras.`);
    apuestaActual += cantidad;
}

function aceptarEnvite() {
    console.log(`${turnoActual} acepta el envite.`);
    jugador.piedras += apuestaActual;
    maquina.piedras -= apuestaActual;
}

function ordago() {
    console.log(`${turnoActual} lanza un órdago.`);
    if (turnoActual === "Jugador") {
        console.log("La máquina acepta el órdago.");
        finalizarJuego();
    } else {
        console.log("El jugador acepta el órdago.");
        finalizarJuego();
    }
}

// Finalizar juego
function finalizarJuego() {
    console.log("Juego finalizado. Mostrando resultados...");
    console.log("Mano del jugador:", jugador.mano);
    console.log("Mano de la máquina:", maquina.mano);
    // Determinar ganador
    const puntosJugador = evaluarGrande(jugador.mano);
    const puntosMaquina = evaluarGrande(maquina.mano);
    if (puntosJugador > puntosMaquina) {
        console.log("El jugador gana el juego.");
    } else {
        console.log("La máquina gana el juego.");
    }
}

// Turnos
function jugarTurno() {
    if (turnoActual === "Jugador") {
        console.log("Es tu turno. Elige una acción:");
        console.log("1. Mus (Descartar cartas)");
        console.log("2. Envidar");
        console.log("3. Ordago");
    } else {
        turnoMaquina();
    }
}

function turnoMaquina() {
    console.log("Turno de la máquina...");
    const decision = Math.random();
    if (decision < 0.4) {
        console.log("La máquina pasa.");
        avanzarFase();
    } else if (decision < 0.7) {
        envidar(maquina, 2);
    } else {
        ordago();
    }
    cambiarTurno();
}

// Interacción inicial
function iniciarJuego() {
    console.log("Iniciando el juego de Mus...");
    repartirCartas();
    while (faseActual !== "Fin") {
        jugarTurno();
    }
    console.log("Juego completado.");
}

// Inicia el juego
iniciarJuego();
