const express = require('express');
const bodyParser = require("body-parser");
const { train } = require('./meta-train.js');
const app = express();

const port = 8000;
app.listen(port, () => console.log(`Training server listening on port ${port}!`));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.post('/train', (req, res) => {
  res.send('Metatrain requested');
  var data = req.body.data;
  train(data.env, data.heuristic, data.settings, data.agent, data.config, data.title, data.logFreq);
});

app.get('/testOne', (req, res) => {
  res.send('Test #1');
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
  res.send('Test #2');
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
