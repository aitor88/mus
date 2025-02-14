let gameState = {
    money: 50,
    morale: 50,
    innovation: 50,
    reputation: 50
};

let events = [];
let currentEvent = null;

async function loadEvents() {
    const response = await fetch("events.json");
    events = await response.json();
    showRandomEvent();
}

function showRandomEvent() {
    currentEvent = events[Math.floor(Math.random() * events.length)];
    document.getElementById("event-text").innerText = currentEvent.text;
    document.getElementById("option-left").innerText = currentEvent.left.text;
    document.getElementById("option-right").innerText = currentEvent.right.text;
}

function updateStats(changes) {
    for (let key in changes) {
        if (gameState[key] !== undefined && key !== "text") {
            gameState[key] += changes[key];
        }
    }

    document.getElementById("money").innerText = gameState.money;
    document.getElementById("morale").innerText = gameState.morale;
    document.getElementById("innovation").innerText = gameState.innovation;
    document.getElementById("reputation").innerText = gameState.reputation;

    checkGameOver();
}

function checkGameOver() {
    if (gameState.money <= 0 || gameState.morale <= 0 || gameState.innovation <= 0 || gameState.reputation <= 0) {
        alert("💥 ¡Game Over! Tu startup ha fracasado.");
        location.reload();
    } else {
        showRandomEvent();
    }
}

document.getElementById("option-left").addEventListener("click", () => {
    updateStats(currentEvent.left);
});

document.getElementById("option-right").addEventListener("click", () => {
    updateStats(currentEvent.right);
});

loadEvents();