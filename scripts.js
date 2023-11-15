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
      && !isNaN(+arr[0].replace(/,/g, ''))
      && !isNaN(+arr[2].replace(/,/g, ''))
      ) {
      if (!(arr[1] === DIV && +arr[2] === 0)) {
        let result = this.operations[arr[1]](+arr[0].replace(/,/g, ''), +arr[2].replace(/,/g, ''));
        return String(result).includes('e') ? String(result) : result.toLocaleString('en-US', {maximumFractionDigits: 15});
      } else {
        hasErrorMsg = true;
        resetOnNumInput = true;
        return errorMsgs[Math.floor(Math.random() * 6)];
      }
    } else if ((arr.length === 1 || arr.length === 2) && !isNaN(+arr[0].replace(/,/g, ''))) {
      let firstNum = +arr[0].replace(/,/g, '');
      return arr[0].includes('e') ? arr[0] : firstNum.toLocaleString('en-US', {maximumFractionDigits: 15});
    } else {
      hasErrorMsg = true;
      resetOnNumInput = true;
      return "Not a number";
    }
  };
}

function isValidOperator(str) {
  return [PLUS, MINUS, TIMES, DIV].includes(str) ? true : false;
}

function findOperator(str) {
  return str[str.split('').findLastIndex((ch, index) => [PLUS, MINUS, TIMES, DIV].includes(ch) && str[index - 1] != 'e')];
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

function formatDisplay(arr) {
  let result = arr.map((item) => {
    if (!isNaN(+item.replace(/,/g, '')) && !item.includes('e')) {
      let num = +item.replace(/,/g, '');
      return num.toLocaleString('en-US', {maximumFractionDigits: 15});
    } else {
      return item;
    }
  });
  display.textContent = result.join('');
}

function allClear(e) {
  e.target.blur();
  display.textContent = '0';
  hasErrorMsg = false;
  resetOnNumInput = false;
}

function backSpace(e) {
  e.target.blur();
  if (display.textContent.length > 1) {
    let text = display.textContent.split('');
    text.pop();
    display.textContent = text.join('');
    formatDisplay(parseDisplay(display.textContent));
  } else {
    display.textContent = '0';
  }
}

function inputNum(e) {
  e.target.blur();
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
    if (e.target.dataset.num != '0') formatDisplay(parseDisplay(display.textContent));
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
  e.target.blur();
  if (isValidOperator(e.target.dataset.oper)) {
    if (!hasErrorMsg) {
      let currentOper = findOperator(display.textContent);
      if (currentOper === undefined) {
        display.textContent += e.target.dataset.oper;
        resetOnNumInput = false;
      } else if (
        currentOper != undefined
        && currentOper === display.textContent.at(-1)
        ) {
        display.textContent = display.textContent.slice(0, -1) + e.target.dataset.oper;
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

function inputDot(e) {
  e.target.blur();
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

function inputEquals(e) {
  e.target.blur();
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
      let element = document.querySelector('[data-ac]');
      element.classList.add('pressed');
      element.click();
    } else if (e.key === 'Backspace') {
      let element = document.querySelector('[data-undo]');
      element.classList.add('pressed');
      element.click();
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
      let element = document.querySelector('[data-dot]');
      element.classList.add('pressed');
      element.click();
    } else if (e.key === '=' || e.key === 'Enter') {
      let element = document.querySelector('[data-equal]');
      element.classList.add('pressed');
      element.click();
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