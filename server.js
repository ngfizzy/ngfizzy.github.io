const express = require('express');

const app = express()
app.use(express.static('.'));

app.listen(process.env.NODE_ENV === "prod"? 80: 4000);