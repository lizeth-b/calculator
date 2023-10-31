const PLUS = '+';
const MINUS = '−';
const TIMES = '×';
const DIV = '÷';

function Calculator() {
  this.operations = {
    [PLUS]: (a, b) => a + b,
    [MINUS]: (a, b) => a - b,
    [TIMES]: (a, b) => a * b,
    [DIV]: (a, b) => a / b,
  };

  this.calculate = function(arr) {
    if (
      arr.length === 3
      && (arr[1] === PLUS || arr[1] === MINUS || arr[1] === TIMES || arr[1] === DIV)
      && !isNaN(+arr[0])
      && !isNaN(+arr[2])
      ) {
      if (!(arr[1] === DIV && +arr[2] === 0)) {
        return String(this.operations[arr[1]](+arr[0], +arr[2]));
      } else {
        hasErrorMsg = true;
        resetOnNumInput = true;
        return errorMsgs[Math.floor(Math.random() * 6)];
      }
    } else if ((arr.length === 1 || arr.length === 2) && !isNaN(+arr[0])) {
      return arr[0];
    } else {
      hasErrorMsg = true;
      resetOnNumInput = true;
      return "Not a number";
    }
  };
}

function isValidOperator(str) {
  let operators = [PLUS, MINUS, TIMES, DIV];
  return operators.includes(str) ? true : false;
}

function findOperator(str) {
  if (str.includes(PLUS)) {
    return PLUS;
  } else if (str.includes(MINUS)) {
    return MINUS;
  } else if (str.includes(TIMES)) {
    return TIMES;
  } else if (str.includes(DIV)) {
    return DIV;
  }
  return '';
}

function parseDisplay(str) {
  let input = [];
  let oper = findOperator(str);
  if (isValidOperator(oper)) {
    input.push(str.slice(0, str.lastIndexOf(oper)));
    input.push(oper);
    if (str.lastIndexOf(oper) + 1 < str.length) {
      input.push(str.slice(str.lastIndexOf(oper) + 1, str.length));
    }
    return input;
  } else {
    return [str];
  }
}

function allClear() {
  display.textContent = '0';
  hasErrorMsg = false;
  resetOnNumInput = false;
}

function backSpace() {
  if (display.textContent.length > 1) {
    let text = display.textContent.split('');
    text.pop();
    display.textContent = text.join('');
  } else {
    display.textContent = '0';
  }
}

function inputNum(e) {
  if (!isNaN(+e.target.dataset.num)) {
    if (resetOnNumInput || hasErrorMsg) {
      display.textContent = '0';
      hasErrorMsg = false;
      resetOnNumInput = false;
    }
    if (display.textContent === '0') {
      display.textContent = e.target.dataset.num;
    } else {
      if (countDigits(parseDisplay(display.textContent).at(-1)) > 14) return;
      display.textContent += e.target.dataset.num; 
    }
  } else if (!errorMsgs.includes(display.textContent)) {
    display.textContent = errorMsgs[Math.floor(Math.random() * 6)];
    hasErrorMsg = true;
    resetOnNumInput = true;
  }
}

function countDigits(str) {
  return str.split('').filter((x) => !isNaN(+x) && (+x >= 0 && +x <= 9)).length;
}

function inputOper(e) {
  if (isValidOperator(e.target.dataset.oper)) {
    if (!hasErrorMsg) {
      let currentOper = findOperator(display.textContent);
      if (currentOper === '') {
        display.textContent += e.target.dataset.oper;
        resetOnNumInput = false;
      } else if (
        currentOper != ''
        && currentOper === display.textContent.at(-1)
        ) {
        display.textContent = display.textContent.replace(currentOper, e.target.dataset.oper);
      } else {
        display.textContent = calc.calculate(parseDisplay(display.textContent));
        if (!hasErrorMsg) {
          display.textContent += e.target.dataset.oper;
          resetOnNumInput = false;
        }
      }
    }
  } else if (!errorMsgs.includes(display.textContent)) {
    display.textContent = errorMsgs[Math.floor(Math.random() * 6)];
    hasErrorMsg = true;
    resetOnNumInput = true;
  }
}

function inputDot() {
  if (!parseDisplay(display.textContent).at(-1).includes('.')) {
    if (hasErrorMsg || resetOnNumInput) {
      display.textContent = '0.';
      hasErrorMsg = false;
      resetOnNumInput = false;
    } else {
      display.textContent += '.';
    }
  }
}

function inputEquals() {
  if (!hasErrorMsg) {
    display.textContent = calc.calculate(parseDisplay(display.textContent));
    resetOnNumInput = true;
  }
}

const errorMsgs = ['What are you doing?', 
  'I can\'t compute that!',
  'Are you for real?',
  'I\'ll pretend I didn\'t see that.',
  'Excuse me?',
  'You\'re not even making sense!'];
let hasErrorMsg = false;
let resetOnNumInput = false;

const calc = new Calculator;
const display = document.querySelector('[data-display]');

const ac = document.querySelector('[data-ac]');
ac.addEventListener('click', allClear);

const undo = document.querySelector('[data-undo]');
undo.addEventListener('click', backSpace);

const nums = document.querySelectorAll('[data-num]');
nums.forEach((num) => {
  num.addEventListener('click', inputNum);
});

const operators = document.querySelectorAll('[data-oper]');
operators.forEach((oper) => {
  oper.addEventListener('click', inputOper);
});

const dot = document.querySelector('[data-dot]');
dot.addEventListener('click', inputDot);

const equals = document.querySelector('[data-equal]');
equals.addEventListener('click', inputEquals);

document.body.addEventListener(
  'keydown',
  (e) => {
    if (e.key === 'Escape') {
      document.querySelector('[data-ac]').classList.add('pressed');
      allClear();
    } else if (e.key === 'Backspace') {
      document.querySelector('[data-undo]').classList.add('pressed');
      backSpace();
    } else if (+e.key >= 0 && +e.key <= 9) {
      let element = document.querySelector(`[data-num="${e.key}"]`);
      element.classList.add('pressed');
      element.click();
    } else if (e.key === '+') {
      let element = document.querySelector(`[data-oper="${PLUS}"]`);
      element.classList.add('pressed');
      element.click();
    } else if (e.key === '-') {
      let element = document.querySelector(`[data-oper="${MINUS}"]`);
      element.classList.add('pressed');
      element.click();
    } else if (e.key === '*') {
      let element = document.querySelector(`[data-oper="${TIMES}"]`);
      element.classList.add('pressed');
      element.click();
    } else if (e.key === '/') {
      let element = document.querySelector(`[data-oper="${DIV}"]`);
      element.classList.add('pressed');
      element.click();
    } else if (e.key === '.') {
      document.querySelector('[data-dot]').classList.add('pressed');
      inputDot();
    } else if (e.key === '=' || e.key === 'Enter') {
      document.querySelector('[data-equal]').classList.add('pressed');
      inputEquals();
    } else {
      return;
    }
  },
  true,
);

document.body.addEventListener(
  'keyup',
  (e) => {
    if (e.key === 'Escape') {
      document.querySelector('[data-ac]').classList.remove('pressed');
    } else if (e.key === 'Backspace') {
      document.querySelector('[data-undo]').classList.remove('pressed');
    } else if (+e.key >= 0 && +e.key <= 9) {
      document.querySelector(`[data-num="${e.key}"]`).classList.remove('pressed');
    } else if (e.key === '+') {
      document.querySelector(`[data-oper="${PLUS}"]`).classList.remove('pressed');
    } else if (e.key === '-') {
      document.querySelector(`[data-oper="${MINUS}"]`).classList.remove('pressed');
    } else if (e.key === '*') {
      document.querySelector(`[data-oper="${TIMES}"]`).classList.remove('pressed');
    } else if (e.key === '/') {
      document.querySelector(`[data-oper="${DIV}"]`).classList.remove('pressed');
    } else if (e.key === '.') {
      document.querySelector('[data-dot]').classList.remove('pressed');
    } else if (e.key === '=' || e.key === 'Enter') {
      document.querySelector('[data-equal]').classList.remove('pressed');
    } else {
      return;
    }
  },
  true,
);