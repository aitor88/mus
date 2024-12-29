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
let cartasSeleccionadas = [];
let mazoBarajado = [];
let faseActual = 0; // 0: Grande, 1: Chica, 2: Pares, 3: Juego

// Referencias del DOM
const marcadorJugador = document.getElementById("piedras-jugador");
const marcadorRival = document.getElementById("piedras-rival");
const cartasJugadorDiv = document.getElementById("cartas-jugador");
const cartasRivalDiv = document.getElementById("cartas-rival");

// Mostrar cartas del jugador
function mostrarCartasJugador() {
    cartasJugadorDiv.innerHTML = "";
    manoJugador.forEach((carta, index) => {
        const cartaHTML = `
            <img 
                id="carta-${index}" 
                class="carta" 
                src="assets/cartas/${formatoDosDigitos(carta.valor)}-${carta.palo}.png" 
                alt="${carta.valor} de ${carta.palo}" 
                onclick="seleccionarCarta(${index})"
            >
        `;
        cartasJugadorDiv.innerHTML += cartaHTML;
    });
}

// Mostrar cartas del rival
function mostrarCartasRival(revelar = false) {
    cartasRivalDiv.innerHTML = "";
    manoRival.forEach(carta => {
        const cartaHTML = revelar
            ? `<img 
                   class="carta" 
                   src="assets/cartas/${formatoDosDigitos(carta.valor)}-${carta.palo}.png" 
                   alt="${carta.valor} de ${carta.palo}"
               >`
            : `<img 
                   class="carta" 
                   src="assets/cartas/dorso.png" 
                   alt="Carta oculta"
               >`;
        cartasRivalDiv.innerHTML += cartaHTML;
    });
}

// Helper para formatear valores a dos dígitos
function formatoDosDigitos(valor) {
    return valor.toString().padStart(2, "0");
}

// Repartir cartas iniciales
function repartirCartas() {
    mazoBarajado = barajarMazo();
    manoJugador = mazoBarajado.splice(0, 4);
    manoRival = mazoBarajado.splice(0, 4);
    mostrarCartasJugador();
    mostrarCartasRival();
    cartasSeleccionadas = [];
    document.getElementById("pedir-mus").disabled = false;
    document.getElementById("no-hay-mus").disabled = false;
}

// Seleccionar carta
function seleccionarCarta(index) {
    const cartaElement = document.getElementById(`carta-${index}`);
    if (cartasSeleccionadas.includes(index)) {
        cartasSeleccionadas = cartasSeleccionadas.filter(i => i !== index);
        cartaElement.classList.remove("seleccionada");
    } else {
        cartasSeleccionadas.push(index);
        cartaElement.classList.add("seleccionada");
    }
}

// Pedir mus
function pedirMus() {
    if (cartasSeleccionadas.length === 0) {
        alert("Selecciona al menos una carta para descartar.");
        return;
    }

    cartasSeleccionadas.forEach(index => {
        manoJugador[index] = mazoBarajado.pop();
    });

    cartasSeleccionadas = [];
    mostrarCartasJugador();

    // Decisión del rival sobre el mus
    if (decidirRivalMus()) {
        alert("El rival también pide mus. Se reparten nuevas cartas.");
        repartirCartas();
    } else {
        alert("El rival corta el mus. Comienzan las apuestas.");
        empezarApuestas();
    }
}

// Decisión del rival sobre el mus
function decidirRivalMus() {
    return Math.random() < 0.5; // Probabilidad aleatoria de aceptar el mus
}

// Cortar el mus (No hay mus)
function cortarMus() {
    alert("No hay mus. Comienzan las apuestas.");
    document.getElementById("pedir-mus").disabled = true;
    document.getElementById("no-hay-mus").disabled = true;
    empezarApuestas();
}

// Evaluar Grande
function evaluarGrande() {
    const mayorJugador = Math.max(...manoJugador.map(carta => carta.valor));
    const mayorRival = Math.max(...manoRival.map(carta => carta.valor));

    if (mayorJugador > mayorRival) {
        alert("Jugador gana Grande.");
        piedrasJugador++;
    } else if (mayorRival > mayorJugador) {
        alert("Rival gana Grande.");
        piedrasRival++;
    } else {
        alert("Empate en Grande.");
    }
    actualizarMarcador();
}

// Evaluar Chica
function evaluarChica() {
    const menorJugador = Math.min(...manoJugador.map(carta => carta.valor));
    const menorRival = Math.min(...manoRival.map(carta => carta.valor));

    if (menorJugador < menorRival) {
        alert("Jugador gana Chica.");
        piedrasJugador++;
    } else if (menorRival < menorJugador) {
        alert("Rival gana Chica.");
        piedrasRival++;
    } else {
        alert("Empate en Chica.");
    }
    actualizarMarcador();
}

// Evaluar Pares
function evaluarPares() {
    const paresJugador = calcularPares(manoJugador);
    const paresRival = calcularPares(manoRival);

    if (paresJugador > paresRival) {
        alert("Jugador gana Pares.");
        piedrasJugador++;
    } else if (paresRival > paresJugador) {
        alert("Rival gana Pares.");
        piedrasRival++;
    } else {
        alert("Empate en Pares.");
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

    if (puntosJugador === 31) {
        alert("Jugador gana Juego con 31.");
        piedrasJugador += 3;
    } else if (puntosRival === 31) {
        alert("Rival gana Juego con 31.");
        piedrasRival += 3;
    } else {
        alert("Nadie gana Juego.");
    }
    actualizarMarcador();
}

function sumarPuntos(mano) {
    return mano.reduce((acc, carta) => acc + carta.valor, 0);
}

// Empezar apuestas
function empezarApuestas() {
    alert("Fase de apuestas: Grande.");
    evaluarGrande();
    alert("Fase de apuestas: Chica.");
    evaluarChica();
    alert("Fase de apuestas: Pares.");
    evaluarPares();
    alert("Fase de apuestas: Juego.");
    evaluarJuego();
}

// Actualizar marcador
function actualizarMarcador() {
    marcadorJugador.innerText = piedrasJugador;
    marcadorRival.innerText = piedrasRival;
}

// Eventos
document.getElementById("iniciar").addEventListener("click", repartirCartas);
document.getElementById("pedir-mus").addEventListener("click", pedirMus);
document.getElementById("no-hay-mus").addEventListener("click", cortarMus);

// Inicializar el juego
repartirCartas();
