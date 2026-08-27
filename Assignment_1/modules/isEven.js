function isEven(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError(`Expected a valid number, but received: ${num}`);
  }
  return num % 2 === 0;
}

function isOdd(num) {
  return !isEven(num);
}

function filterEven(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array of numbers');
  }
  return arr.filter(isEven);
}

function filterOdd(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array of numbers');
  }
  return arr.filter(isOdd);
}

module.exports = {
  isEven,
  isOdd,
  filterEven,
  filterOdd,
};
