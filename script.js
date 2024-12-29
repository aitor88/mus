// Crear el mazo de cartas
const mazo = [];
const palos = ["oros", "copas", "espadas", "bastos"];
const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

// Generar las cartas
palos.forEach(palo => {
    valores.forEach(valor => {
        mazo.push({ palo, valor });
    });
});

// Barajar las cartas
function barajarMazo() {
    return [...mazo].sort(() => Math.random() - 0.5);
}

// Variables del juego
let manoJugador = [];
let manoRival = [];
let piedrasJugador = 0;
let piedrasRival = 0;

// Referencias del DOM
const marcadorJugador = document.getElementById("piedras-jugador");
const marcadorRival = document.getElementById("piedras-rival");
const cartasJugadorDiv = document.getElementById("cartas-jugador");
const cartasRivalDiv = document.getElementById("cartas-rival");

// Función para repartir cartas
function repartirCartas() {
    const mazoBarajado = barajarMazo();
    manoJugador = mazoBarajado.splice(0, 4);
    manoRival = mazoBarajado.splice(0, 4);

    // Mostrar cartas del jugador
    cartasJugadorDiv.innerHTML = "";
    manoJugador.forEach(carta => {
        const cartaHTML = `<div>${carta.valor} de ${carta.palo}</div>`;
        cartasJugadorDiv.innerHTML += cartaHTML;
    });

    // Ocultar cartas del rival
    cartasRivalDiv.innerHTML = "Cartas del Rival: [Ocultas]";
}

// Función para mostrar las cartas del rival
function mostrarCartasRival() {
    cartasRivalDiv.innerHTML = "";
    manoRival.forEach(carta => {
        const cartaHTML = `<div>${carta.valor} de ${carta.palo}</div>`;
        cartasRivalDiv.innerHTML += cartaHTML;
    });
}

// Evaluar Grande
function evaluarGrande() {
    const mayorJugador = Math.max(...manoJugador.map(carta => carta.valor));
    const mayorRival = Math.max(...manoRival.map(carta => carta.valor));

    if (mayorJugador > mayorRival) {
        alert("Jugador gana Grande");
        piedrasJugador++;
    } else if (mayorRival > mayorJugador) {
        alert("Rival gana Grande");
        piedrasRival++;
    } else {
        alert("Empate en Grande");
    }
    actualizarMarcador();
}

// Evaluar Chica
function evaluarChica() {
    const menorJugador = Math.min(...manoJugador.map(carta => carta.valor));
    const menorRival = Math.min(...manoRival.map(carta => carta.valor));

    if (menorJugador < menorRival) {
        alert("Jugador gana Chica");
        piedrasJugador++;
    } else if (menorRival < menorJugador) {
        alert("Rival gana Chica");
        piedrasRival++;
    } else {
        alert("Empate en Chica");
    }
    actualizarMarcador();
}

// Evaluar Pares
function evaluarPares() {
    const paresJugador = calcularPares(manoJugador);
    const paresRival = calcularPares(manoRival);

    if (paresJugador > paresRival) {
        alert("Jugador gana Pares");
        piedrasJugador++;
    } else if (paresRival > paresJugador) {
        alert("Rival gana Pares");
        piedrasRival++;
    } else {
        alert("Empate en Pares");
    }
    actualizarMarcador();
}

function calcularPares(mano) {
    const valores = mano.map(carta => carta.valor);
    const conteo = {};
    valores.forEach(valor => {
        conteo[valor] = (conteo[valor] || 0) + 1;
    });

    let pares = 0;
    for (let valor in conteo) {
        if (conteo[valor] === 2) pares++;
    }
    return pares;
}

// Evaluar Juego
function evaluarJuego() {
    const puntosJugador = sumarPuntos(manoJugador);
    const puntosRival = sumarPuntos(manoRival);

    const ordenJuego = [31, 32, 40, 39, 38, 37, 36, 35, 34, 33];

    const posicionJugador = ordenJuego.indexOf(puntosJugador);
    const posicionRival = ordenJuego.indexOf(puntosRival);

    if (posicionJugador !== -1 && posicionRival !== -1) {
        if (posicionJugador < posicionRival) {
            alert("Jugador gana Juego");
            piedrasJugador++;
        } else if (posicionRival < posicionJugador) {
            alert("Rival gana Juego");
            piedrasRival++;
        } else {
            alert("Empate en Juego");
        }
    } else {
        alert("Nadie tiene Juego");
    }
    actualizarMarcador();
}

function sumarPuntos(mano) {
    return mano.reduce((acc, carta) => acc + carta.valor, 0);
}

// Función para actualizar el marcador
function actualizarMarcador() {
    marcadorJugador.innerText = piedrasJugador;
    marcadorRival.innerText = piedrasRival;
}

// Comportamiento del rival
function comportamientoRival() {
    alert("Rival está tomando su decisión...");

    // Grande
    const mayorRival = Math.max(...manoRival.map(carta => carta.valor));
    if (mayorRival > 10 && Math.random() < 0.5) {
        alert("El rival envida en Grande");
        piedrasRival++;
    }

    // Chica
    const menorRival = Math.min(...manoRival.map(carta => carta.valor));
    if (menorRival < 4 && Math.random() < 0.5) {
        alert("El rival envida en Chica");
        piedrasRival++;
    }

    // Pares
    const paresRival = calcularPares(manoRival);
    if (paresRival > 0 && Math.random() < 0.5) {
        alert("El rival envida en Pares");
        piedrasRival++;
    }

    // Juego
    const puntosRival = sumarPuntos(manoRival);
    if ((puntosRival === 31 || puntosRival === 32) && Math.random() < 0.5) {
        alert("El rival envida en Juego");
        piedrasRival++;
    }

    actualizarMarcador();
}

// Comprobar ganador
function comprobarGanador() {
    if (piedrasJugador >= 40) {
        alert("¡Felicidades! Has ganado la partida.");
        reiniciarJuego();
    } else if (piedrasRival >= 40) {
        alert("El rival ha ganado la partida. ¡Suerte la próxima vez!");
        reiniciarJuego();
    }
}

function reiniciarJuego() {
    piedrasJugador = 0;
    piedrasRival = 0;
    actualizarMarcador();
    repartirCartas();
}

// Jugar una ronda completa
function jugarRonda() {
    repartirCartas();
    alert("Resolviendo Grande...");
    evaluarGrande();
    alert("Resolviendo Chica...");
    evaluarChica();
    alert("Resolviendo Pares...");
    evaluarPares();
    alert("Resolviendo Juego...");
    evaluarJuego();
    mostrarCartasRival();
    comportamientoRival();
    comprobarGanador();
}

// Eventos de botones
document.getElementById("iniciar").addEventListener("click", jugarRonda);
document.getElementById("mus").addEventListener("click", repartirCartas);

// Inicializar el juego
repartirCartas();
