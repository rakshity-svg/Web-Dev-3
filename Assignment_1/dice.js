const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, 'dice_history.txt');

const DICE_FACES = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅',
};

function rollSingleDice(min = 1, max = 6) {
  if (typeof crypto.randomInt === 'function') {
    return crypto.randomInt(min, max + 1);
  }

  const range = max - min + 1;
  const byte = crypto.randomBytes(1)[0];
  return min + (byte % range);
}

function saveHistory(rolls) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const logEntry = `[${timestamp}] Rolls (${rolls.length}): ${rolls.join(', ')}\n`;

  fs.appendFile(HISTORY_FILE, logEntry, 'utf8', (err) => {
    if (err) {
      console.error(`Warning: Failed to save dice history (${err.message})`);
    }
  });
}

function showHistory() {
  if (!fs.existsSync(HISTORY_FILE)) {
    console.log('No dice roll history recorded yet.');
    return;
  }
  const history = fs.readFileSync(HISTORY_FILE, 'utf8');
  console.log('\n--- Dice Roll History ---');
  console.log(history.trim() || 'History file is empty.');
}

function main() {
  const arg = process.argv[2];

  if (arg === '--history' || arg === '-h') {
    showHistory();
    return;
  }

  const rollCount = arg ? parseInt(arg, 10) : 1;

  if (isNaN(rollCount) || rollCount < 1) {
    console.error('Error: Number of rolls must be a positive integer.');
    console.log('Usage: node dice.js [numberOfRolls]');
    process.exit(1);
  }

  const results = [];

  if (rollCount === 1) {
    const value = rollSingleDice(1, 6);
    results.push(value);
    console.log(`🎲 Dice Rolled: ${value} ${DICE_FACES[value] || ''}`);
  } else {
    console.log(`Simulating ${rollCount} dice rolls:\n`);
    for (let i = 1; i <= rollCount; i++) {
      const value = rollSingleDice(1, 6);
      results.push(value);
      console.log(`  Roll #${i.toString().padStart(2)}: 🎲 Dice Rolled: ${value} ${DICE_FACES[value] || ''}`);
    }

    const sum = results.reduce((acc, v) => acc + v, 0);
    const avg = (sum / results.length).toFixed(2);
    console.log(`\nSummary: Total = ${sum}, Average = ${avg}`);
  }

  saveHistory(results);
}

main();

module.exports = {
  rollSingleDice,
  saveHistory,
  DICE_FACES,
};
