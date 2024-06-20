const attributes = {
    "Good at Cooking": 50,
    "Can Fix Anything": 100,
    "Great Sense of Humor": 75,
    "Knows All the Best Jokes": 60,
    "Has a Cool Accent": 90,
    "Always Wins at Board Games": 80,
    "Can Dance Like a Pro": 70,
    "Super Friendly": 85,
    "Loves Adventure": 65,
    "Master of Sarcasm": 55
};

document.addEventListener('DOMContentLoaded', () => {
    const attributesList = document.getElementById('attributes-list');
    const selectedAttributesDiv = document.getElementById('selected-attributes');

    // Populate the attributes list
    for (let attr in attributes) {
        const div = document.createElement('div');
        div.className = 'attribute-item';
        div.innerHTML = `
            <span>${attr} (Cost: ${attributes[attr]})</span>
            <button>Select</button>
        `;
        div.querySelector('button').addEventListener('click', () => selectAttribute(attr));
        attributesList.appendChild(div);
    }

    document.getElementById('finish-button').addEventListener('click', finishSelection);
});

let selectedAttributes = [];
let totalCost = 0;

function selectAttribute(attr) {
    const budget = parseInt(document.getElementById('budget').value);
    if (totalCost + attributes[attr] > budget) {
        alert("Not enough budget for this attribute.");
        return;
    }

    selectedAttributes.push(attr);
    totalCost += attributes[attr];
    updateSelectedAttributes();
}

function removeAttribute(attr) {
    const index = selectedAttributes.indexOf(attr);
    if (index > -1) {
        selectedAttributes.splice(index, 1);
        totalCost -= attributes[attr];
        updateSelectedAttributes();
    }
}

function updateSelectedAttributes() {
    const selectedAttributesDiv = document.getElementById('selected-attributes');
    selectedAttributesDiv.innerHTML = `<h3>Selected Attributes (Total Cost: ${totalCost}):</h3>`;
    selectedAttributes.forEach(attr => {
        const div = document.createElement('div');
        div.className = 'selected-attribute-item';
        div.innerHTML = `
            <span>${attr}</span>
            <button>Remove</button>
        `;
        div.querySelector('button').addEventListener('click', () => removeAttribute(attr));
        selectedAttributesDiv.appendChild(div);
    });
}

function finishSelection() {
    const name = document.getElementById('partner-name').value;
    if (!name) {
        alert("Please enter a name for your partner.");
        return;
    }
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3>Your Partner</h3><p>Name: ${name}</p><p>Attributes: ${selectedAttributes.join(', ')}</p><p>Total Cost: ${totalCost}</p>`;
}
