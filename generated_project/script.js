// script.js
// Calculator implementation
// This script assumes the DOM is already loaded (deferred script).

class Calculator {
    // Private fields
    #displayElement;
    #currentInput = '';
    #previousValue = null; // number or null
    #operator = null; // string or null
    #shouldResetDisplay = false;

    constructor() {
        const display = document.getElementById('display');
        if (!display) {
            throw new Error('Display element not found');
        }
        this.#displayElement = display;
        this.updateDisplay('0');
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Button clicks
        const buttons = document.querySelectorAll('.buttons-grid button');
        buttons.forEach(btn => btn.addEventListener('click', this.handleButtonClick.bind(this)));
        // Keyboard
        window.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    handleButtonClick(event) {
        const target = event.currentTarget;
        const action = target.dataset.action;
        const value = target.dataset.value;
        switch (action) {
            case 'digit':
                this.inputDigit(value);
                break;
            case 'decimal':
                this.inputDigit('.');
                break;
            case 'operator':
                this.inputOperator(value);
                break;
            case 'clear':
                this.clear();
                break;
            case 'equals':
                this.calculate();
                break;
            default:
                // Unsupported action – ignore
                break;
        }
    }

    handleKeyPress(event) {
        const key = event.key;
        // Allow only relevant keys
        if ((key >= '0' && key <= '9') || key === '.') {
            event.preventDefault();
            this.inputDigit(key);
            return;
        }
        switch (key) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
                event.preventDefault();
                this.inputOperator(key);
                break;
            case 'Enter':
                event.preventDefault();
                this.calculate();
                break;
            case 'Escape':
                event.preventDefault();
                this.clear();
                break;
            case 'Backspace':
                // Simple backspace handling: remove last character
                event.preventDefault();
                this.#currentInput = this.#currentInput.slice(0, -1);
                if (this.#currentInput === '') {
                    this.#currentInput = '0';
                }
                this.updateDisplay(this.#currentInput);
                break;
            default:
                // ignore other keys
                break;
        }
    }

    inputDigit(digit) {
        if (this.#shouldResetDisplay) {
            this.#currentInput = '';
            this.#shouldResetDisplay = false;
        }
        // Prevent multiple leading zeros
        if (digit === '0' && this.#currentInput === '0') return;
        // Handle decimal point
        if (digit === '.') {
            if (this.#currentInput.includes('.')) return; // ignore second decimal
            if (this.#currentInput === '' || this.#shouldResetDisplay) {
                this.#currentInput = '0';
            }
        }
        this.#currentInput += digit;
        this.updateDisplay(this.#currentInput);
    }

    inputOperator(op) {
        // Only allow supported operators for calculation
        const supported = ['+', '-', '*', '/', '%'];
        if (!supported.includes(op)) {
            // Unsupported operator (e.g., parentheses) – ignore for now
            return;
        }
        // If an operator is already set and we are not resetting, compute intermediate result
        if (this.#operator && !this.#shouldResetDisplay) {
            this.calculate();
        }
        // Store the current input as previous value
        const currentNumber = parseFloat(this.#currentInput);
        this.#previousValue = isNaN(currentNumber) ? 0 : currentNumber;
        this.#operator = op;
        this.#shouldResetDisplay = true;
    }

    clear() {
        this.#currentInput = '';
        this.#previousValue = null;
        this.#operator = null;
        this.#shouldResetDisplay = false;
        this.updateDisplay('0');
    }

    calculate() {
        if (!this.#operator || this.#previousValue === null) {
            return; // nothing to calculate
        }
        const currentNumber = parseFloat(this.#currentInput);
        const a = this.#previousValue;
        const b = isNaN(currentNumber) ? 0 : currentNumber;
        let result;
        switch (this.#operator) {
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case '*':
                result = a * b;
                break;
            case '/':
                if (b === 0) {
                    this.updateDisplay('Error');
                    this.clear();
                    return;
                }
                result = a / b;
                break;
            case '%':
                result = a % b;
                break;
            default:
                // Unsupported operator – ignore
                return;
        }
        // Format result to avoid floating point artifacts
        const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(10).replace(/\.?(0)+$/,'' );
        this.updateDisplay(resultStr);
        // Prepare for next input
        this.#currentInput = resultStr;
        this.#previousValue = null;
        this.#operator = null;
        this.#shouldResetDisplay = true;
    }

    updateDisplay(value) {
        this.#displayElement.value = value;
    }
}

// Expose to global scope for potential external use
window.Calculator = Calculator;

// Instantiate the calculator when script loads
const calc = new Calculator();
