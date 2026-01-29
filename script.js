// Initialize variables
let output = document.getElementById('output-value');
let history = document.getElementById('history-value');
let currentInput = '0';
let previousInput = '';
let operator = '';
let result = null;
let decimalAdded = false;

// Update display
function updateDisplay() {
    output.innerText = currentInput;
    history.innerText = previousInput + (operator ? ' ' + operator : '');
}

// Reset calculator
function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    result = null;
    decimalAdded = false;
    updateDisplay();
}

// Delete last character
function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Handle number input
function inputNumber(num) {
    if (currentInput === '0' || result !== null) {
        currentInput = num;
        result = null;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

// Handle decimal point
function inputDecimal() {
    if (!decimalAdded) {
        if (currentInput === '' || result !== null) {
            currentInput = '0.';
        } else {
            currentInput += '.';
        }
        decimalAdded = true;
        updateDisplay();
    }
}

// Handle operator input
function inputOperator(op) {
    if (operator && previousInput && currentInput) {
        calculate();
    }
    
    if (result !== null) {
        previousInput = result.toString();
        result = null;
    } else {
        previousInput = currentInput;
    }
    
    operator = op;
    currentInput = '0';
    decimalAdded = false;
    updateDisplay();
}

// Calculate result
function calculate() {
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clearCalculator();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }
    
    // Handle floating point precision
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    previousInput = '';
    operator = '';
    decimalAdded = currentInput.includes('.');
    updateDisplay();
}

// Percentage calculation
function calculatePercentage() {
    if (currentInput === '0') return;
    
    let value = parseFloat(currentInput);
    result = value / 100;
    
    // Handle floating point precision
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    decimalAdded = currentInput.includes('.');
    updateDisplay();
}

// Keyboard support
function handleKeyboardInput(e) {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        inputOperator(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'Delete') {
        clearCalculator();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === '%') {
        calculatePercentage();
    }
}

// Add event listeners to buttons
document.addEventListener('DOMContentLoaded', function() {
    // Number buttons
    for (let i = 0; i <= 9; i++) {
        document.getElementById(i.toString())?.addEventListener('click', () => inputNumber(i.toString()));
    }
    
    // Operator buttons
    document.getElementById('+')?.addEventListener('click', () => inputOperator('+'));
    document.getElementById('-')?.addEventListener('click', () => inputOperator('-'));
    document.getElementById('*')?.addEventListener('click', () => inputOperator('*'));
    document.getElementById('/')?.addEventListener('click', () => inputOperator('/'));
    document.getElementById('%')?.addEventListener('click', calculatePercentage);
    
    // Other buttons
    document.getElementById('clear')?.addEventListener('click', clearCalculator);
    document.getElementById('backspace')?.addEventListener('click', backspace);
    document.getElementById('=')?.addEventListener('click', calculate);
    
    // Add decimal button (we need to add this button in HTML first)
    // For now, we'll handle decimal through keyboard or modify HTML
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
    
    // Initialize display
    updateDisplay();
});

// Add decimal point functionality to the empty button
document.querySelectorAll('.empty').forEach((btn, index) => {
    if (index === 0) { // First empty button becomes decimal
        btn.className = 'number';
        btn.id = 'decimal';
        btn.textContent = '.';
        btn.addEventListener('click', inputDecimal);
    }
});