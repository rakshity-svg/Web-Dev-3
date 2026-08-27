const { isEven, isOdd, filterEven, filterOdd } = require('./modules/isEven');
const logger = require('./modules/logger');

logger.header('SMART UTILITY TOOLKIT - MODULE DEMO & EXECUTION FLOW');

logger.info(`Process ID: ${process.pid}`);
logger.info(`Node Version: ${process.version}`);
logger.info(`CLI Arguments received: ${JSON.stringify(process.argv.slice(2))}`);

logger.header('1. Custom Module: isEven / isOdd Demonstration');

const testNumbers = [0, 1, 2, 7, 14, 25, 42, 99, 100];
console.log('Testing individual numbers:');
testNumbers.forEach((num) => {
  const result = isEven(num);
  const type = result ? 'EVEN' : 'ODD';
  logger.info(`Number ${num.toString().padStart(3)} is ${type} (isEven: ${result}, isOdd: ${isOdd(num)})`);
});

logger.header('2. Array Filtering with Custom Module');

const sampleArray = [12, 5, 8, 130, 44, 3, 9, 21, 50, 77];
logger.info(`Original Array: [ ${sampleArray.join(', ')} ]`);

const evenList = filterEven(sampleArray);
logger.success(`Filtered Even Numbers: [ ${evenList.join(', ')} ]`);

const oddList = filterOdd(sampleArray);
logger.success(`Filtered Odd Numbers:  [ ${oddList.join(', ')} ]`);

const customInput = process.argv[2];
if (customInput !== undefined) {
  logger.header('3. CLI User Input Evaluation');
  const parsed = Number(customInput);
  if (isNaN(parsed)) {
    logger.warn(`Provided input "${customInput}" is not a valid number.`);
  } else {
    logger.info(`Custom input: ${parsed}`);
    if (isEven(parsed)) {
      logger.success(`${parsed} is an EVEN number.`);
    } else {
      logger.info(`${parsed} is an ODD number.`);
    }
  }
}

logger.header('4. Execution Flow Analysis (Sync vs Async in Node.js)');

console.log('[Step 1] Synchronous code started.');

setTimeout(() => {
  logger.info('[Step 4] Asynchronous callback executed (from Event Loop timers queue).');
}, 0);

Promise.resolve().then(() => {
  logger.info('[Step 3] Microtask (Promise) executed before next event loop turn.');
});

console.log('[Step 2] Synchronous code completed.');
