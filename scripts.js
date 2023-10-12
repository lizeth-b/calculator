function Calculator() {
  this.operations = {
    '+': (a, b) => a + b,
    '−': (a, b) => a - b,
    '×': (a, b) => a * b,
    '÷': (a, b) => a / b,
  };

  this.calculate = function(arr) {
    if (arr[1] != '' && !isNaN(+arr[0]) && !isNaN(+[2])) {
      return String(this.operations[arr[1]](+arr[0], +arr[2]));
    } else {
      return NaN;
    }
  };
}

function isValidOperator(str) {
  let operators = ['+', '−', '×', '÷'];
  if (operators.includes(str)) return true;
  return false;
}

function findOperator(str) {
  if (str.includes('+')) {
    return '+';
  } else if (str.includes('−')) {
    return '−';
  } else if (str.includes('×')) {
    return '×';
  } else if (str.includes('÷')) {
    return '÷';
  }
  return '';
}

function parseDisplay(str) {
  let input = [];
  let oper = findOperator(str);
  input.push(str.slice(0, str.indexOf(oper)));
  input.push(oper);
  input.push(str.slice(str.indexOf(oper) + 1, str.length));
  return input
}

const calc = new Calculator;
const display = document.querySelector('[data-display]');

const ac = document.querySelector('[data-ac]');
ac.addEventListener('click', () => display.textContent = '0');

const undo = document.querySelector('[data-undo]');
undo.addEventListener('click', () => {
  if (display.textContent.length > 1) {
    let text = display.textContent.split('');
    text.pop();
    display.textContent = text.join('');
  } else {
    display.textContent = '0';
  }
});

const nums = document.querySelectorAll('[data-num]');
nums.forEach((num) => {
  num.addEventListener('click', (e) => {
    if (!isNaN(+e.target.innerText)) {
      if (display.textContent === '0') {
        display.textContent = e.target.innerText;
      } else {
        display.textContent += e.target.innerText;
      }
    }
  });
});

const operators = document.querySelectorAll('[data-oper]');
operators.forEach((oper) => {
  oper.addEventListener('click', (e) => {
    if (isValidOperator(e.target.innerText)) {
      let currentOper = findOperator(display.textContent);
      if (currentOper === '') {
        display.textContent += e.target.innerText;
      } else if (
        currentOper != ''
        && display.textContent.indexOf(currentOper) === display.textContent.length - 1
        ) {
        display.textContent = display.textContent.replace(currentOper, e.target.innerText);
      } else {
        display.textContent = calc.calculate(parseDisplay(display.textContent));
        display.textContent += e.target.innerText;
      }
    }
  });
});

const equals = document.querySelector('[data-equal]');