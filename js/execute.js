// execute.js
function executeSpell(spellChain) {
    try {
        let expression = buildExpression(spellChain);
        let result = eval(expression);
        return isNaN(result) || !isFinite(result) ? 0 : Math.floor(result);
    } catch (error) {
        console.error("Invalid spell:", error);
        return 0;
    }
}

function buildExpression(spellChain) {
    let expression = '';
    let previousType = null;

    for (let card of spellChain) {
        if (card.type === 'number') {
            expression += card.value;
        } else if (card.type === 'operation') {
            switch (card.value) {
                case 'AND':
                    expression += previousType === 'operation' ? '**' : '*';
                    break;
                case 'OR':
                    expression += '+';
                    break;
                case 'NOT':
                    if (previousType === 'operation') {
                        expression += expression.endsWith('*') ? '/' : '-';
                    } else {
                        expression += `(${binaryNot})(`;
                    }
                    break;
                case 'PRIORITY':
                    expression += '(';
                    break;
            }
        }
        previousType = card.type;
    }

    return expression;
}

function binaryNot(n) {
    return ~n & 0xF;  // Bitwise NOT limited to 4 bits
}

export { executeSpell };
