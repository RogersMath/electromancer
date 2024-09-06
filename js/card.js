// card.js
class Card {
    constructor(value, type) {
        this.value = value;
        this.type = type;
        this.color = this.getColor();
        this.binary = this.getBinary();
    }

    getColor() {
        const colors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'];
        return this.type === 'number' ? colors[this.value] : 'silver';
    }

    getBinary() {
        return this.type === 'number' ? this.value.toString(2).padStart(4, '0') : '';
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        // Add number cards
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 3; j++) {
                this.cards.push(new Card(i, 'number'));
            }
        }

        // Add operation cards
        const operations = ['AND', 'OR', 'NOT', 'PRIORITY'];
        for (let op of operations) {
            for (let i = 0; i < 3; i++) {
                this.cards.push(new Card(op, 'operation'));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(n) {
        return this.cards.splice(0, n);
    }
}
