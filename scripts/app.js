import { createDeck, shuffleDeck, calculateHandValue } from './gameLogic.js';

let deck = [];
let playerHand = [];
let dealerHand = [];

function startGame() {
    deck = shuffleDeck(createDeck());
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateUI();
}

function hit() {
    playerHand.push(deck.pop());
    if (calculateHandValue(playerHand) > 21) {
        showMessage("You busted! Dealer wins.");
    } else {
        updateUI();
    }
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
}

function updateUI() {
    document.getElementById('player-hand').textContent = `Player: ${JSON.stringify(playerHand)}`;
    document.getElementById('dealer-hand').textContent = `Dealer: ${JSON.stringify(dealerHand)}`;
}

function showMessage(message) {
    document.getElementById('message').textContent = message;
}

document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
document.getElementById('restart-button').addEventListener('click', startGame);

startGame();