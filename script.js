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

// Referencias del DOM
const marcadorJugador = document.getElementById("piedras-jugador");
const marcadorRival = document.getElementById("piedras-rival");
const cartasJugadorDiv = document.getElementById("cartas-jugador");
const cartasRivalDiv = document.getElementById("cartas-rival");

// Mostrar cartas del jugador
function mostrarCartasJugador() {
    // Ordenar la mano de mayor a menor
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
    // Ordenar la mano de mayor a menor
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

// Fase de apuestas y resolución
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

// Evaluaciones y marcador
function evaluarGrande() { /* Sin cambios */ }
function evaluarChica() { /* Sin cambios */ }
function evaluarPares() { /* Sin cambios */ }
function evaluarJuego() { /* Sin cambios */ }
function actualizarMarcador() { /* Sin cambios */ }

// Eventos
document.getElementById("iniciar").addEventListener("click", repartirCartas);
document.getElementById("pedir-mus").addEventListener("click", pedirMus);
document.getElementById("no-hay-mus").addEventListener("click", cortarMus);

// Inicializar el juego
repartirCartas();
