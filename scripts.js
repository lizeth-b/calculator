function Calculator() {
  this.operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
  };

  this.calculate = function(str) {
    let array = str.split(' ');
    return this.operations[array[1]](Number(array[0]), Number(array[2]));
  };
}