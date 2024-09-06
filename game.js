// Card definitions
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const operations = ['AND', 'OR', 'NOT', 'PRIORITY'];
const colors = ['BLACK', 'BROWN', 'RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'VIOLET', 'GRAY', 'WHITE'];

// NOT operation lookup table
const notLookup = {
    0: 15, 1: 14, 2: 13, 3: 12, 4: 11, 5: 10, 6: 9, 7: 8, 8: 7, 9: 6
};

// Generate deck
function generateDeck() {
    let deck = [];
    for (let i = 0; i < 3; i++) {
        numbers.forEach(num => {
            deck.push({
                type: 'number',
                value: num,
                binary: num.toString(2).padStart(4, '0'),
                color: colors[num]
            });
        });
        operations.forEach(op => {
            if (op === 'PRIORITY') {
                deck.push({ type: 'operation', value: 'PRIORITY_OPEN', display: '(', color: 'SILVER' });
                deck.push({ type: 'operation', value: 'PRIORITY_CLOSE', display: ')', color: 'SILVER' });
            } else {
                deck.push({ type: 'operation', value: op, display: op, color: 'SILVER' });
            }
        });
    }
    return deck;
}

// Shuffle deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Draw cards
function drawCards(deck, count) {
    return deck.splice(0, count);
}

// Game state
let deck = shuffleDeck(generateDeck());
let playerHand = drawCards(deck, 7);
let spellConstruction = [];
let playerScore = 0;
let enemyScore = 0;
let currentRound = 1;

// DOM elements
const handCardsElement = document.getElementById('hand-cards');
const spellCardsElement = document.getElementById('spell-cards');
const executeSpellButton = document.getElementById('execute-spell');
const resultElement = document.getElementById('result');
const scoreElement = document.getElementById('score');

// Render cards
function renderCards(cards, container) {
    container.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `w-16 h-24 rounded border ${card.type === 'number' ? 'bg-' + card.color.toLowerCase() + '-200' : 'bg-gray-200'} flex items-center justify-center cursor-pointer`;
        cardElement.textContent = card.display || card.value;
        cardElement.onclick = () => moveCard(index, cards === playerHand ? playerHand : spellConstruction, cards === playerHand ? spellConstruction : playerHand);
        container.appendChild(cardElement);
    });
}

// Move card between hand and spell construction
function moveCard(index, fromArray, toArray) {
    const [card] = fromArray.splice(index, 1);
    toArray.push(card);
    renderCards(playerHand, handCardsElement);
    renderCards(spellConstruction, spellCardsElement);
}

// Execute spell
function executeSpell() {
    let result = evaluateSpell(spellConstruction);
    let enemyDamage = Math.floor(Math.random() * 1000) + 1;
    playerScore += result;
    enemyScore += enemyDamage;
    resultElement.textContent = `Round ${currentRound}: Your spell dealt ${result} damage. Enemy dealt ${enemyDamage} damage.`;
    scoreElement.textContent = `Player: ${playerScore} | Enemy: ${enemyScore}`;
    
    currentRound++;
    if (currentRound > 5) {
        endGame();
    } else {
        // Reset spell construction and draw new cards
        spellConstruction = [];
        deck = shuffleDeck(generateDeck());
        playerHand = drawCards(deck, 7);
        renderCards(playerHand, handCardsElement);
        renderCards(spellConstruction, spellCardsElement);
    }
}

// Evaluate spell
function evaluateSpell(spell) {
    let tokens = [];
    let applyNot = false;

    // Tokenize the spell, applying NOT operation
    for (let i = 0; i < spell.length; i++) {
        const card = spell[i];
        if (card.type === 'number') {
            let value = card.value;
            if (applyNot) {
                value = notLookup[value];
                applyNot = false;
            }
            tokens.push(value);
        } else if (card.value === 'NOT') {
            applyNot = true;
        } else {
            tokens.push(card.value);
        }
    }

    // Evaluate the tokenized spell
    return evaluateTokens(tokens);
}

// Evaluate tokenized spell
function evaluateTokens(tokens) {
    // Handle PRIORITY (parentheses)
    while (tokens.includes('PRIORITY_OPEN')) {
        let openIndex = tokens.indexOf('PRIORITY_OPEN');
        let closeIndex = tokens.indexOf('PRIORITY_CLOSE', openIndex);
        if (closeIndex === -1) break; // Mismatched parentheses, could handle this error

        let subExpression = tokens.slice(openIndex + 1, closeIndex);
        let result = evaluateTokens(subExpression);
        tokens.splice(openIndex, closeIndex - openIndex + 1, result);
    }

    // Evaluate AND operations
    while (tokens.includes('AND')) {
        let index = tokens.indexOf('AND');
        let result = tokens[index - 1] * tokens[index + 1];
        tokens.splice(index - 1, 3, result);
    }

    // Evaluate OR operations
    while (tokens.includes('OR')) {
        let index = tokens.indexOf('OR');
        let result = tokens[index - 1] + tokens[index + 1];
        tokens.splice(index - 1, 3, result);
    }

    return Math.max(0, Math.floor(tokens[0]));
}

// End game
function endGame() {
    executeSpellButton.disabled = true;
    let winner = playerScore > enemyScore ? "Player" : (playerScore < enemyScore ? "Enemy" : "It's a tie");
    resultElement.textContent = `Game Over! ${winner} wins!`;
}

// Event listeners
executeSpellButton.addEventListener('click', executeSpell);

// Initial render
renderCards(playerHand, handCardsElement);
renderCards(spellConstruction, spellCardsElement);
scoreElement.textContent = `Player: ${playerScore} | Enemy: ${enemyScore}`;
