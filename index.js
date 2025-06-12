class Calculator {
            constructor(previousOperandTextElement, currentOperandTextElement) {
                this.previousOperandTextElement = previousOperandTextElement;
                this.currentOperandTextElement = currentOperandTextElement;
                this.clear();
            }

            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.updateDisplay();
            }

            delete() {
                if (this.currentOperand === '0') return;
                this.currentOperand = this.currentOperand.toString().slice(0, -1);
                if (this.currentOperand === '') {
                    this.currentOperand = '0';
                }
                this.updateDisplay();
            }

            appendNumber(number) {
                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand = this.currentOperand.toString() + number.toString();
                }
                this.updateDisplay();
            }

            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                if (this.previousOperand !== '') {
                    this.compute();
                }
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
                this.updateDisplay();
            }

            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                if (isNaN(prev) || isNaN(current)) return;

                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '*':
                        computation = prev * current;
                        break;
                    case '÷':
                        computation = prev / current;
                        break;
                    default:
                        return;
                }

                this.currentOperand = computation.toString();
                this.operation = undefined;
                this.previousOperand = '';
                this.updateDisplay();
            }

            getDisplayNumber(number) {
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                let integerDisplay;
                
                if (isNaN(integerDigits)) {
                    integerDisplay = '';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', {
                        maximumFractionDigits: 0
                    });
                }
                
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }

            updateDisplay() {
                this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
                if (this.operation != null) {
                    this.previousOperandTextElement.innerText = 
                        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
                } else {
                    this.previousOperandTextElement.innerText = '';
                }
            }
        }

        const numberButtons = document.querySelectorAll('[data-number]');
        const operationButtons = document.querySelectorAll('[data-operation]');
        const equalsButton = document.querySelector('[data-equals]');
        const deleteButton = document.querySelector('[data-delete]');
        const clearButton = document.querySelector('[data-clear]');
        const previousOperandTextElement = document.querySelector('[data-previous-operand]');
        const currentOperandTextElement = document.querySelector('[data-current-operand]');

        const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.appendNumber(button.innerText);
            });
        });

        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.chooseOperation(button.innerText);
            });
        });

        equalsButton.addEventListener('click', () => {
            calculator.compute();
        });

        clearButton.addEventListener('click', () => {
            calculator.clear();
        });

        deleteButton.addEventListener('click', () => {
            calculator.delete();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= 0 && e.key <= 9) calculator.appendNumber(e.key);
            if (e.key === '.') calculator.appendNumber('.');
            if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                calculator.chooseOperation(e.key === '/' ? '÷' : e.key);
            }
            if (e.key === 'Enter' || e.key === '=') calculator.compute();
            if (e.key === 'Escape') calculator.clear();
            if (e.key === 'Backspace') calculator.delete();
        });