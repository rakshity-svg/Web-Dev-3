function add(a,b)
{
  return a + b;
}

module.exports = { add }  


if (req.url === '/add' && req.method === 'POST') {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { a, b } = JSON.parse(body);
    const result = add(a, b);
    res.end(JSON.stringify({ result }));
  });
}