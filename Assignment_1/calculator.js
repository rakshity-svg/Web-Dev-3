const args = process.argv.slice(2);

function printHelp() {
  console.log(`\nUsage: node calculator.js <operation> <num1> <num2>`);
  console.log(`\nSupported Operations:`);
  console.log(`  add, +         Addition (num1 + num2)`);
  console.log(`  sub, -         Subtraction (num1 - num2)`);
  console.log(`  mul, *         Multiplication (num1 * num2)`);
  console.log(`  div, /         Division (num1 / num2)`);
  console.log(`  mod, %         Modulus / Remainder (num1 % num2) [Bonus]`);
  console.log(`  pow, ^         Power / Exponentiation (num1 ^ num2) [Bonus]`);
  console.log(`\nExample:`);
  console.log(`  node calculator.js add 10 5\n`);
}

function calculate(operation, num1, num2) {
  const op = operation.toLowerCase();

  switch (op) {
    case 'add':
    case '+':
      return num1 + num2;

    case 'sub':
    case 'subtract':
    case '-':
      return num1 - num2;

    case 'mul':
    case 'multiply':
    case '*':
      return num1 * num2;

    case 'div':
    case 'divide':
    case '/':
      if (num2 === 0) {
        throw new Error('Division by zero is not allowed.');
      }
      return num1 / num2;

    case 'mod':
    case 'modulus':
    case '%':
      if (num2 === 0) {
        throw new Error('Modulo by zero is not allowed.');
      }
      return num1 % num2;

    case 'pow':
    case 'power':
    case '^':
      return Math.pow(num1, num2);

    default:
      throw new Error(`Invalid operation: "${operation}". Supported: add, sub, mul, div, mod, pow`);
  }
}

function main() {
  if (args.length < 3) {
    console.error('Error: Insufficient arguments provided.');
    printHelp();
    process.exit(1);
  }

  const [op, rawNum1, rawNum2] = args;
  const num1 = Number(rawNum1);
  const num2 = Number(rawNum2);

  if (isNaN(num1) || isNaN(num2)) {
    console.error('Error: Both operands must be valid numbers.');
    printHelp();
    process.exit(1);
  }

  try {
    const result = calculate(op, num1, num2);
    console.log(`Result: ${result}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
