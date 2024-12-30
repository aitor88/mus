// Variables globales
let jugador1 = { nombre: "Jugador 1", piedras: 0, cartas: [] };
let jugador2 = { nombre: "Máquina", piedras: 0, cartas: [] };
let baraja = [];
let cartasDescartadas = []; // Cartas descartadas para reconstruir el mazo
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
    ordenarMano(jugador1.cartas);
    ordenarMano(jugador2.cartas);
    mostrarCartas();
}

function ordenarMano(cartas) {
    cartas.sort((a, b) => b.valor - a.valor); // Ordenar de mayor a menor
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

    // Crear botón de confirmar descarte si no existe
    let botonConfirmarDescarte = document.getElementById("confirmarDescarte");
    if (!botonConfirmarDescarte) {
        botonConfirmarDescarte = document.createElement("button");
        botonConfirmarDescarte.id = "confirmarDescarte";
        botonConfirmarDescarte.textContent = "Confirmar Descarte";
        const botonesMus = document.getElementById("botonesMus");
        botonesMus.appendChild(botonConfirmarDescarte);

        botonConfirmarDescarte.addEventListener("click", () => {
            if (cartasSeleccionadas.length > 0) {
                // Guardar las cartas descartadas para reconstruir el mazo si es necesario
                cartasSeleccionadas.forEach((index) => {
                    cartasDescartadas.push(jugador1.cartas[index]);
                    jugador1.cartas[index] = baraja.shift();
                });

                // Comprobar si quedan cartas en la baraja
                if (baraja.length === 0) {
                    rehacerMazo();
                }

                actualizarRegistro("Se han repartido nuevas cartas.");
                cartasSeleccionadas = [];
                ordenarMano(jugador1.cartas); // Ordenar las cartas después del descarte
                mostrarCartas();
                botonConfirmarDescarte.remove();

                // La máquina realiza su descarte
                maquinaDescarta();
            } else {
                actualizarRegistro("No seleccionaste cartas para descartar.");
            }
        });
    }
}

function maquinaDescarta() {
    const cantidadDescartar = Math.floor(Math.random() * 4); // Máquina descarta de 0 a 3 cartas
    for (let i = 0; i < cantidadDescartar; i++) {
        if (baraja.length === 0) {
            rehacerMazo();
        }
        cartasDescartadas.push(jugador2.cartas[i]);
        jugador2.cartas[i] = baraja.shift();
    }
    ordenarMano(jugador2.cartas); // Ordenar la mano de la máquina

    // Actualizar el registro para mostrar cuántas cartas descartó
    if (cantidadDescartar > 0) {
        actualizarRegistro(`La máquina ha descartado ${cantidadDescartar} carta(s).`);
    } else {
        actualizarRegistro("La máquina no ha descartado cartas.");
    }
}

function rehacerMazo() {
    baraja = [...cartasDescartadas];
    cartasDescartadas = [];
    barajarCartas();
    actualizarRegistro("La baraja se ha reconstruido con las cartas descartadas.");
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