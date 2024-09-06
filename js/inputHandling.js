// inputHandling.js
function initializeInputHandling() {
    const playerHand = document.getElementById('player-hand');
    const spellChain = document.getElementById('spell-chain');

    playerHand.addEventListener('click', (e) => {
        if (e.target.classList.contains('card')) {
            moveCard(e.target, playerHand, spellChain);
        }
    });

    spellChain.addEventListener('click', (e) => {
        if (e.target.classList.contains('card')) {
            moveCard(e.target, spellChain, playerHand);
        }
    });
}

function moveCard(card, from, to) {
    from.removeChild(card);
    to.appendChild(card);
}

export { initializeInputHandling };
