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
let mazoBarajado = [];

// Mostrar cartas del jugador
function mostrarCartasJugador() {
    const cartasJugadorDiv = document.getElementById("cartas-jugador");
    cartasJugadorDiv.innerHTML = "";
    manoJugador.forEach(carta => {
        const cartaHTML = `
            <img 
                class="carta" 
                src="assets/cartas/${formatoDosDigitos(carta.valor)}-${carta.palo}.png" 
                alt="${carta.valor} de ${carta.palo}">
        `;
        cartasJugadorDiv.innerHTML += cartaHTML;
    });
}

// Formatear números con dos dígitos
function formatoDosDigitos(valor) {
    return valor.toString().padStart(2, "0");
}

// Función para repartir cartas
function repartirCartas() {
    mazoBarajado = barajarMazo();
    manoJugador = mazoBarajado.splice(0, 4);
    manoRival = mazoBarajado.splice(0, 4);

    mostrarCartasJugador();

    console.log("Cartas repartidas correctamente.");
}

// Evento para el botón "Iniciar Ronda"
document.getElementById("iniciar").addEventListener("click", repartirCartas);
