let gameState = {
    money: 50,
    morale: 50,
    innovation: 50,
    reputation: 50
};

let events = [];
let currentEventIndex = 0;

async function loadEvents() {
    const response = await fetch("events.json");
    events = await response.json();
    showEvent();
}

function showEvent() {
    if (currentEventIndex >= events.length) {
        currentEventIndex = 0; // Reiniciar eventos cuando se terminen
    }

    const event = events[currentEventIndex];
    document.getElementById("event-text").innerText = event.text;
}

function updateStats(changes) {
    for (let key in changes) {
        if (gameState[key] !== undefined) {
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
        alert("¡Game Over! Tu startup ha fracasado.");
        location.reload();
    } else {
        currentEventIndex++;
        showEvent();
    }
}

function swipe(direction) {
    const card = document.querySelector(".event-card");
    card.classList.add(direction === "left" ? "swipe-left" : "swipe-right");

    setTimeout(() => {
        card.classList.remove("swipe-left", "swipe-right");
        checkGameOver();
    }, 300);
}

document.getElementById("option-left").addEventListener("click", () => {
    updateStats(events[currentEventIndex].left);
    swipe("left");
});

document.getElementById("option-right").addEventListener("click", () => {
    updateStats(events[currentEventIndex].right);
    swipe("right");
});

document.getElementById("option-left").addEventListener("click", () => {
    updateStats(events[currentEventIndex].left);
});

document.getElementById("option-right").addEventListener("click", () => {
    updateStats(events[currentEventIndex].right);
});

loadEvents();