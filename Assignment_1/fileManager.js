const fs = require('fs');
const path = require('path');

function createFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function updateFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, content, 'utf8', (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

async function runDemo() {
  const targetFile = path.join(__dirname, 'test.txt');

  try {
    console.log('Creating File...');
    await createFile(targetFile, 'Hello Node.js\n');
    console.log('File Created');

    console.log('Reading File');
    let content = await readFile(targetFile);
    process.stdout.write(content);

    console.log('File Updated');
    await updateFile(targetFile, 'Learning FS Module\n');

    content = await readFile(targetFile);
    process.stdout.write(content);

    await deleteFile(targetFile);
    console.log('File Deleted');
  } catch (err) {
    console.error(`File Manager Error: ${err.message}`);
  }
}

async function handleCLI(action, filename, extraContent) {
  if (!filename) {
    console.error('Error: Please specify a filename.');
    process.exit(1);
  }

  const filePath = path.isAbsolute(filename) ? filename : path.join(__dirname, filename);

  try {
    switch (action.toLowerCase()) {
      case 'create':
      case 'write': {
        let text = extraContent || '';
        if (text && !text.endsWith('\n')) {
          text += '\n';
        }
        await createFile(filePath, text);
        console.log(`File Created: ${filename}`);
        break;
      }

      case 'read': {
        const data = await readFile(filePath);
        console.log(`--- Content of ${filename} ---`);
        process.stdout.write(data);
        if (!data.endsWith('\n')) {
          console.log();
        }
        break;
      }

      case 'append':
      case 'update': {
        let text = extraContent || '';
        if (text && !text.endsWith('\n')) {
          text += '\n';
        }
        await updateFile(filePath, text);
        console.log(`File Updated: ${filename}`);
        break;
      }

      case 'delete':
      case 'remove':
      case 'unlink': {
        await deleteFile(filePath);
        console.log(`File Deleted: ${filename}`);
        break;
      }

      default:
        console.error(`Invalid action: "${action}". Use create, read, update, or delete.`);
        process.exit(1);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`Error: File "${filename}" does not exist.`);
    } else {
      console.error(`File Operation Failed: ${err.message}`);
    }
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  runDemo();
} else {
  const [action, filename, ...rest] = args;
  const content = rest.join(' ');
  handleCLI(action, filename, content);
}

module.exports = {
  createFile,
  readFile,
  updateFile,
  deleteFile,
};
