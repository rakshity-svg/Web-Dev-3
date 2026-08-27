const http = require('http');

const PORT = process.argv[2] ? parseInt(process.argv[2], 10) : (process.env.PORT || 3000);

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  let responseBody = '';
  let statusCode = 200;

  switch (pathname) {
    case '/':
      statusCode = 200;
      responseBody = 'Welcome to Node Server';
      break;

    case '/about':
      statusCode = 200;
      responseBody = 'About Page';
      break;

    case '/contact':
      statusCode = 200;
      responseBody = 'Contact Page';
      break;

    default:
      statusCode = 404;
      responseBody = '404 Not Found: The requested route does not exist.';
      break;
  }

  res.writeHead(statusCode);
  res.end(responseBody);

  console.log(`\nVisit: http://localhost:${PORT}${pathname}`);
  console.log(`Status: ${statusCode}`);
  console.log(`Response: ${responseBody}`);
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
  console.log(`Available routes:`);
  console.log(`  http://localhost:${PORT}/`);
  console.log(`  http://localhost:${PORT}/about`);
  console.log(`  http://localhost:${PORT}/contact`);
  console.log(`Press Ctrl + C to stop the server.\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use.`);
  } else {
    console.error(`Server error: ${err.message}`);
  }
  process.exit(1);
});
