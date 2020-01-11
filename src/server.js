const express = require('express');
const { train } = require('./meta-train.js');

const app = express();

const port = 8000;
app.listen(port, () => console.log(`Training server listening on port ${port}!`));

app.get('/train', (req, res) => {
  res.send('Uh oh.');
});

app.get('/testOne', (req, res) => {
  res.send('rough');
  var s = {
    maxGenerations: 5000,
    alpha: 0.00001,
    sigma: 0.01,
    population: 200,
    numTrials: 5,
  }
  var c = {
    architecture: [4, 4, 10, 6]
  }
  train('taxi-v3', 'ES', s, 'stochastic', c, 'baby-driver');
});

app.get('/testTwo', (req, res) => {
  res.send('idk');
  var s = {
    maxGenerations: 5000,
    alpha: 0.0003,
    sigma: 0.1,
    population: 200,
    numTrials: 5,
  }
  var c = {
    architecture: [7, 5, 3],
  }
  train('chicken-little', 'ES', s, 'stochastic', c, 'ugly-duckling');
});
