document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('result');
  let currentValue = '0';
  let previousValue = null;
  let operator = null;
  let waitingForSecondOperand = false;
  let maxDigits = 9;

  function updateDisplay() {
      let displayValue = currentValue;
      
      // Handle large numbers
      if (displayValue.length > maxDigits) {
          if (displayValue.includes('.')) {
              displayValue = parseFloat(displayValue).toFixed(
                  Math.max(0, maxDigits - displayValue.split('.')[0].length - 1)
              );
          } else {
              displayValue = parseFloat(displayValue).toExponential(maxDigits - 4);
          }
      }
      
      display.value = displayValue;
  }

  function clearCalculator() {
      currentValue = '0';
      previousValue = null;
      operator = null;
      waitingForSecondOperand = false;
      updateDisplay();
      
      // Reset all operator buttons
      document.querySelectorAll('.operator').forEach(btn => {
          btn.classList.remove('active');
      });
  }

  function handleNumber(num) {
      if (waitingForSecondOperand) {
          currentValue = num;
          waitingForSecondOperand = false;
      } else {
          currentValue = currentValue === '0' ? num : currentValue + num;
      }
      updateDisplay();
  }

  function handleDecimal() {
      if (waitingForSecondOperand) {
          currentValue = '0.';
          waitingForSecondOperand = false;
      } else if (!currentValue.includes('.')) {
          currentValue += '.';
      }
      updateDisplay();
  }

  function handleOperator(nextOperator) {
      const inputValue = parseFloat(currentValue);

      if (operator && waitingForSecondOperand) {
          operator = nextOperator;
          return;
      }

      if (previousValue === null) {
          previousValue = inputValue;
      } else if (operator) {
          const result = calculate(previousValue, inputValue, operator);
          currentValue = `${result}`;
          previousValue = result;
      }

      waitingForSecondOperand = true;
      operator = nextOperator;
      updateDisplay();
  }

  function calculate(first, second, op) {
      switch (op) {
          case '+': return first + second;
          case '-': return first - second;
          case '*': return first * second;
          case '/': return second !== 0 ? first / second : 'Error';
          default: return second;
      }
  }

  function handleSpecialFunction(func) {
      switch (func) {
          case 'AC':
              clearCalculator();
              break;
          case '+/-':
              currentValue = currentValue.startsWith('-') ? 
                  currentValue.slice(1) : `-${currentValue}`;
              updateDisplay();
              break;
          case '%':
              currentValue = `${parseFloat(currentValue) / 100}`;
              updateDisplay();
              break;
      }
  }

  // Add button press animation
  function addButtonAnimation(button) {
      button.classList.add('btn-pressed');
      setTimeout(() => {
          button.classList.remove('btn-pressed');
      }, 150);
  }

  // Event Listeners
  document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', (e) => {
          const value = button.dataset.value;
          addButtonAnimation(button);

          if (button.classList.contains('number')) {
              handleNumber(value);
          } else if (button.classList.contains('operator')) {
              // Remove active class from all operator buttons
              document.querySelectorAll('.operator').forEach(btn => {
                  btn.classList.remove('active');
              });
              
              if (value !== '=') {
                  button.classList.add('active');
                  handleOperator(value);
              } else {
                  if (operator && previousValue !== null) {
                      handleOperator('=');
                      operator = null;
                      previousValue = null;
                      waitingForSecondOperand = false;
                  }
              }
          } else if (button.classList.contains('function')) {
              handleSpecialFunction(value);
          }

          if (value === '.') {
              handleDecimal();
          }
      });
  });

  // Add keyboard support
  document.addEventListener('keydown', (e) => {
      const key = e.key;
      const button = document.querySelector(`[data-value="${key}"]`) ||
                    document.querySelector(`[data-value="${key === 'Enter' ? '=' : key}"]`) ||
                    document.querySelector(`[data-value="${key === '/' ? '/' : key}"]`);
                    
      if (button) {
          button.click();
          addButtonAnimation(button);
      }
  });
});