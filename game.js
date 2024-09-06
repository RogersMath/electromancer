// Card definitions
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const operations = ['AND', 'OR', 'NOT', 'PRIORITY'];
const colors = ['BLACK', 'BROWN', 'RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'VIOLET', 'GRAY', 'WHITE'];

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
            deck.push({
                type: 'operation',
                value: op,
                color: 'SILVER'
            });
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
let playerHand = drawCards(deck, 5);
let spellConstruction = [];

// DOM elements
const handCardsElement = document.getElementById('hand-cards');
const spellCardsElement = document.getElementById('spell-cards');
const executeSpellButton = document.getElementById('execute-spell');
const resultElement = document.getElementById('result');

// Render cards
function renderCards(cards, container) {
    container.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `w-16 h-24 rounded border ${card.type === 'number' ? 'bg-' + card.color.toLowerCase() + '-200' : 'bg-gray-200'} flex items-center justify-center cursor-pointer`;
        cardElement.textContent = card.value;
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
    resultElement.textContent = `Your spell dealt ${result} damage. Enemy dealt ${enemyDamage} damage.`;
    
    // Reset spell construction and draw new cards
    spellConstruction = [];
    playerHand = playerHand.concat(drawCards(deck, 5 - playerHand.length));
    renderCards(playerHand, handCardsElement);
    renderCards(spellConstruction, spellCardsElement);
}

// Evaluate spell
function evaluateSpell(spell) {
    // This is a simplified version and doesn't handle all cases
    let result = 0;
    let currentOperation = 'OR';

    for (let i = 0; i < spell.length; i++) {
        const card = spell[i];
        if (card.type === 'number') {
            if (currentOperation === 'OR') {
                result += card.value;
            } else if (currentOperation === 'AND') {
                result *= card.value;
            }
        } else if (card.type === 'operation') {
            currentOperation = card.value;
        }
    }

    return Math.max(0, Math.floor(result));
}

// Event listeners
executeSpellButton.addEventListener('click', executeSpell);

// Initial render
renderCards(playerHand, handCardsElement);
renderCards(spellConstruction, spellCardsElement);
