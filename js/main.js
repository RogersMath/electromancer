// main.js
import { Card, Deck } from './card.js';
import { executeSpell } from './execute.js';
import { initializeInputHandling } from './inputHandling.js';

let playerDeck, computerDeck;
let playerScore = 0, computerScore = 0;
let currentRound = 0;

function initializeGame() {
    playerDeck = new Deck();
    computerDeck = new Deck();
    currentRound = 0;
    playerScore = 0;
    computerScore = 0;
    
    document.getElementById('start-game').addEventListener('click', startRound);
    document.getElementById('execute-attack').addEventListener('click', executeAttack);
    
    initializeInputHandling();
}

function startRound() {
    if (currentRound >= 5) {
        endGame();
        return;
    }

    currentRound++;
    playerDeck.shuffle();
    computerDeck.shuffle();

    let playerHand = playerDeck.draw(7);
    let computerHand = computerDeck.draw(7);

    displayHand(playerHand);
    // In a full implementation, we'd process the computer's turn here
}

function displayHand(hand) {
    const playerHandElement = document.getElementById('player-hand');
    playerHandElement.innerHTML = '';
    hand.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.color} p-2 m-1 rounded cursor-pointer`;
        cardElement.textContent = `${card.value} ${card.binary}`;
        cardElement.dataset.value = card.value;
        cardElement.dataset.type = card.type;
        playerHandElement.appendChild(cardElement);
    });
}

function executeAttack() {
    const spellChainElement = document.getElementById('spell-chain');
    const spellChain = Array.from(spellChainElement.children).map(cardElement => ({
        value: cardElement.dataset.value,
        type: cardElement.dataset.type
    }));

    const damage = executeSpell(spellChain);
    playerScore += damage;

    document.getElementById('result').textContent = `You dealt ${damage} damage!`;

    // In a full implementation, we'd process the computer's turn here

    startRound();
}

function endGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = `
        <h2>Game Over!</h2>
        <p>Your score: ${playerScore}</p>
        <p>Computer score: ${computerScore}</p>
        <p>${playerScore > computerScore ? 'You win!' : playerScore < computerScore ? 'Computer wins!' : 'It\'s a tie!'}</p>
    `;
}

document.addEventListener('DOMContentLoaded', initializeGame);
