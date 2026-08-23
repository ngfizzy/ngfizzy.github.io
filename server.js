const express = require('express');

const host = process.env.HOST;
const port = process.env.PORT || 4000;
const app = express();

app.use(express.static(__dirname));

app.listen(port, host, () => {
  const address = host ? `http://${host}:${port}` : `port ${port}`;
  console.log(`Site preview: ${address}`);
});
