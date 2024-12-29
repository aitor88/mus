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
let turnoActual = "Jugador"; // Alterna entre "Jugador" y "Rival"
let apuestaActual = 0; // Cantidad de piedras apostadas en esta fase

// Referencias del DOM
const marcadorJugador = document.getElementById("piedras-jugador");
const marcadorRival = document.getElementById("piedras-rival");
const cartasJugadorDiv = document.getElementById("cartas-jugador");
const cartasRivalDiv = document.getElementById("cartas-rival");
const faseTexto = document.getElementById("fase-actual");
const turnoTexto = document.getElementById("turno-actual");
const apuestasDiv = document.getElementById("apuestas");

// Mostrar cartas del jugador
function mostrarCartasJugador() {
    const manoOrdenada = [...manoJugador].sort((a, b) => b.valor - a.valor);

    cartasJugadorDiv.innerHTML = "";
    manoOrdenada.forEach((carta, index) => {
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
    const manoOrdenada = [...manoRival].sort((a, b) => b.valor - a.valor);

    cartasRivalDiv.innerHTML = "";
    manoOrdenada.forEach(carta => {
        const cartaHTML = revelar
            ? `<img 
                   class="carta" 
                   src="assets/cartas/${formatoDosDigitos(carta.valor)}-${carta.palo}.png" 
                   alt="${carta.valor} de ${carta.palo}"
               >`
            : `<img 
                   class="carta" 
                   src="assets/cartas/reverso.png" 
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
    return Math.random() < 0.5;
}

// Cortar el mus (No hay mus)
function cortarMus() {
    faseActual = 0; // Inicia con Grande
    turnoActual = "Jugador"; // Siempre empieza el jugador
    actualizarFaseTexto();
    actualizarTurnoTexto();
    empezarApuestas();
}

// Actualizar indicadores
function actualizarFaseTexto() {
    const fases = ["Grande", "Chica", "Pares", "Juego"];
    faseTexto.innerText = `Fase: ${fases[faseActual]}`;
}

function actualizarTurnoTexto() {
    turnoTexto.innerText = `Turno: ${turnoActual}`;
}

// Cambiar turno
function cambiarTurno() {
    turnoActual = turnoActual === "Jugador" ? "Rival" : "Jugador";
    actualizarTurnoTexto();
}

// Empezar la fase de apuestas
function empezarApuestas() {
    actualizarFaseTexto();
    actualizarTurnoTexto();
    apuestasDiv.style.display = "block";

    if (turnoActual === "Jugador") {
        habilitarBotonesApuesta(true);
    } else {
        habilitarBotonesApuesta(false);
        setTimeout(accionRival, 1000); // Simula la respuesta del rival
    }
}

// Habilitar/Deshabilitar botones de apuesta
function habilitarBotonesApuesta(habilitar) {
    document.getElementById("apostar").disabled = !habilitar;
    document.getElementById("subir").disabled = !habilitar;
    document.getElementById("pasar").disabled = !habilitar;
}

// Acciones del jugador
document.getElementById("apostar").addEventListener("click", () => {
    apuestaActual = 1; // Inicia con una apuesta básica
    cambiarTurno();
    setTimeout(accionRival, 1000); // Espera la respuesta del rival
});

document.getElementById("subir").addEventListener("click", () => {
    apuestaActual += 1;
    cambiarTurno();
    setTimeout(accionRival, 1000); // Espera la respuesta del rival
});

document.getElementById("pasar").addEventListener("click", () => {
    cambiarTurno();
    setTimeout(accionRival, 1000); // Espera la respuesta del rival
});

// Acción del rival
function accionRival() {
    const decision = Math.random();
    if (decision < 0.4) {
        alert("Rival pasa.");
        cambiarTurno();
    } else if (decision < 0.7) {
        alert("Rival iguala la apuesta.");
        cambiarTurno();
    } else {
        alert("Rival sube la apuesta.");
        apuestaActual += 1;
        cambiarTurno();
    }
}

// Avanzar a la siguiente fase
function avanzarFase() {
    if (faseActual < 3) {
        faseActual += 1;
        empezarApuestas();
    } else {
        mostrarCartasRival(true); // Revelar cartas del rival
        alert("Ronda terminada. ¡Prepárate para la siguiente ronda!");
        faseActual = 0;
        repartirCartas();
    }
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
