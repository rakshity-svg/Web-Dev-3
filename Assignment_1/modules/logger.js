const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

function info(message) {
  console.log(`${COLORS.gray}[${getTimestamp()}]${COLORS.reset} ${COLORS.cyan}[INFO]${COLORS.reset} ${message}`);
}

function success(message) {
  console.log(`${COLORS.gray}[${getTimestamp()}]${COLORS.reset} ${COLORS.green}[SUCCESS]${COLORS.reset} ${message}`);
}

function warn(message) {
  console.warn(`${COLORS.gray}[${getTimestamp()}]${COLORS.reset} ${COLORS.yellow}[WARN]${COLORS.reset} ${message}`);
}

function error(message) {
  console.error(`${COLORS.gray}[${getTimestamp()}]${COLORS.reset} ${COLORS.red}[ERROR]${COLORS.reset} ${message}`);
}

function debug(message) {
  console.log(`${COLORS.gray}[${getTimestamp()}]${COLORS.reset} ${COLORS.magenta}[DEBUG]${COLORS.reset} ${message}`);
}

function header(title) {
  console.log(`\n${COLORS.bright}${COLORS.blue}=== ${title} ===${COLORS.reset}`);
}

module.exports = {
  info,
  success,
  warn,
  error,
  debug,
  header,
  COLORS,
};
