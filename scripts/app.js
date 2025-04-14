import { createDeck, shuffleDeck, calculateHandValue } from './gameLogic.js';

const socket = io(); // Connect to the server

let deck = [];
let playerHand = [];
let dealerHand = [];

function startGame() {
    deck = shuffleDeck(createDeck());
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateUI();

    // Notify server about game start
    socket.emit('playerAction', { action: 'startGame', playerHand, dealerHand });
}

function hit() {
    playerHand.push(deck.pop());
    if (calculateHandValue(playerHand) > 21) {
        showMessage("You busted! Dealer wins.");
    } else {
        updateUI();
    }

    // Notify server about hit action
    socket.emit('playerAction', { action: 'hit', playerHand });
}

function stand() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (dealerValue > 21 || playerValue > dealerValue) {
        showMessage("You win!");
    } else if (playerValue < dealerValue) {
        showMessage("Dealer wins.");
    } else {
        showMessage("It's a tie.");
    }

    // Notify server about stand action
    socket.emit('playerAction', { action: 'stand', playerHand, dealerHand });
}

function updateUI() {
    document.getElementById('player-hand').textContent = `Player: ${JSON.stringify(playerHand)}`;
    document.getElementById('dealer-hand').textContent = `Dealer: ${JSON.stringify(dealerHand)}`;
}

function showMessage(message) {
    document.getElementById('message').textContent = message;
}

// Listen for game state updates from the server
socket.on('updateGameState', (data) => {
    console.log('Game state updated:', data);
    // Update UI or game state based on server data
});

document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
document.getElementById('restart-button').addEventListener('click', startGame);

startGame();