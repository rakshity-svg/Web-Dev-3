# Lab Assignment 1 – Smart Utility Toolkit

**Course:** Web Dev III (Node.js & Express Backend)  
**Unit Covered:** Unit–1  
**Mode:** 100% In-Class (Lab Practicals)  

---

## 📁 Directory Structure

```text
Assignment_1/
├── modules/
│   ├── isEven.js         # Custom module exporting even/odd validators & array filters
│   └── logger.js         # Custom module with timestamps & ANSI color codes (Bonus)
├── calculator.js         # CLI calculator using process.argv (add, sub, mul, div, mod, pow)
├── app.js                # Module reusability demo & sync vs async execution flow analysis
├── server.js             # HTTP server handling /, /about, /contact, and 404 responses
├── fileManager.js        # File CRUD manager using fs (writeFile, readFile, appendFile, unlink)
├── dice.js               # Cryptographically secure dice roll simulator using crypto module
├── test.txt              # Test file used during fileManager CRUD lifecycle
├── dice_history.txt      # Dice roll history log (Bonus)
└── README.md             # Complete assignment documentation
```

---

## 🚀 Utilities & Usage Guide

### 1. CLI-Based Calculator (`calculator.js`)
Performs arithmetic operations using `process.argv` with input validation and error handling (e.g. division by zero).

**Syntax:**
```bash
node calculator.js <operation> <num1> <num2>
```

**Supported Operations:**
- `add` or `+` : Addition
- `sub` or `-` : Subtraction
- `mul` or `*` : Multiplication
- `div` or `/` : Division
- `mod` or `%` : Modulo (Bonus)
- `pow` or `^` : Exponentiation (Bonus)

**Examples:**
```bash
node calculator.js add 10 5
# Output: Result: 15

node calculator.js sub 20 8
# Output: Result: 12

node calculator.js mul 6 7
# Output: Result: 42

node calculator.js div 50 5
# Output: Result: 10

node calculator.js mod 17 5
# Output: Result: 2

node calculator.js pow 2 8
# Output: Result: 256
```

---

### 2. Custom Modules & Reusability (`modules/` and `app.js`)
Demonstrates modular programming using `module.exports` and `require()`.

- **`modules/isEven.js`**: Exports `isEven`, `isOdd`, `filterEven`, and `filterOdd`.
- **`modules/logger.js`**: Exports formatted logging methods (`info`, `success`, `warn`, `error`, `debug`, `header`) with ANSI terminal colors and timestamps.
- **`app.js`**: Reuses both modules and demonstrates synchronous vs. asynchronous execution order.

**Run Demo:**
```bash
node app.js
node app.js 42
```

---

### 3. Basic HTTP Server (`server.js`)
A lightweight HTTP server built with the core `http` module listening on port `3000` (or custom port).

**Start Server:**
```bash
node server.js
```

**Routes & Responses:**
| Route | Method | Status | Response |
|---|---|---|---|
| `/` | `GET` | `200` | `Welcome to Node Server` |
| `/about` | `GET` | `200` | `About Page` |
| `/contact` | `GET` | `200` | `Contact Page` |
| Any other path | `GET` | `404` | `404 Not Found: The requested route does not exist.` |

**Test in terminal with curl / browser:**
```bash
curl http://localhost:3000/
curl http://localhost:3000/about
curl http://localhost:3000/contact
curl http://localhost:3000/non-existent
```

---

### 4. File Manager using `fs` Module (`fileManager.js`)
Implements full CRUD operations on files using `fs.writeFile()`, `fs.readFile()`, `fs.appendFile()`, and `fs.unlink()`.

**1. Automated Lifecycle Demo (Matches Assignment Output):**
```bash
node fileManager.js
```
*Output:*
```text
Creating File...
File Created
Reading File
Hello Node.js
File Updated
Hello Node.js
Learning FS Module
File Deleted
```

**2. Interactive CLI Mode:**
```bash
# Create / overwrite a file
node fileManager.js create notes.txt "My Note Content"

# Read file
node fileManager.js read notes.txt

# Append / update file
node fileManager.js append notes.txt "Added new line"

# Delete file
node fileManager.js delete notes.txt
```

---

### 5. Random Dice Generator (`dice.js`)
Simulates dice rolls (1–6) using Node.js `crypto` module (`crypto.randomInt`) for cryptographically secure randomness.

**Roll a single dice:**
```bash
node dice.js
# Output: 🎲 Dice Rolled: 4 ⚃
```

**Simulate multiple rolls (loop):**
```bash
node dice.js 5
```

**View stored roll history (Bonus):**
```bash
node dice.js --history
```

---

## 🌟 Bonus Challenges Implemented

1. **Colored Terminal Outputs:** Implemented in `modules/logger.js` using standard ANSI escape codes.
2. **Timestamped Logs:** Automatic ISO timestamp prefix in logger output.
3. **Extended Calculator Operations:** Added `mod` (modulus) and `pow` (exponentiation) with zero-division / invalid-input validation.
4. **Dice Roll History File:** Saves each dice roll session with timestamps into `dice_history.txt`.
