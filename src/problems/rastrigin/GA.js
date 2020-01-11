const env = require('./env');
const { Brain: Agent } = require('./agents');
const math = require('mathjs');
const fs = require('fs');

// Settings
const maxGenerations = 100;
const population = 100;
const numTrials = 1;
const numElite = 10
const mutateChance = 0.3;
const mutateSigma = 0.4;
const numParams = 2;

// [Borrowed] Standard Normal variate using Box-Muller transform.
var randn_bm = () => {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

// Evaluates a single agent
var evaluateAgent = (agent) => {
  var reward = 0;
  var observation = env.reset();
  var feedback = agent.act(observation, env);
  var delta = feedback.reward;
  reward += delta;
  return reward;
}

// Fitness shaping function
var remapFitnesses = (rewards) => {
  var sorted = rewards.slice();
  sorted.sort((a, b) => b - a);
  return rewards.map((x, i) => {
    return sorted.indexOf(x);
  })
}

var breed = (sortedPopulation) => {
  var newPop = [];
  var pool = [];
  var guy = [];

  // Create breeding pool
  for (var i=0; i < numElite; i++) {
    pool.push(sortedPopulation[i][0]);
    newPop.push(sortedPopulation[i][0]);
  }

  // Main repopulation loop
  for (var i=0; i < population - numElite; i++) {
    var elites = pool.slice();
    var parentOneIndex = Math.floor(Math.random() * numElite);
    var parentOne = elites[parentOneIndex];
    elites.splice(parentOneIndex, 1);
    var parentTwoIndex = Math.floor(Math.random() * (numElite - 1));
    var parentTwo = elites[parentTwoIndex];

    // Crossover
    var child = [];
    for (var w=0; w < numParams; w++) {
      var gene;
      if (Math.random() < 0.5) {
        gene = parentOne[w]
      } else {
        gene = parentTwo[w];
      }

      if (Math.random() < mutateChance) {
        var randNegative = 1;
        if (Math.random() < 0.5) {
          randNegative = -1;
        }
        gene += randNegative * randn_bm() * mutateSigma;
      }

      child.push(gene);
    }

    newPop.push(child);
  }

  return newPop;
}

// Main learning loop
var theta = math.random([numParams, 1], -0.5, 0.5);
var averageFitness = 0;
var currentPopulation = [];
var trace = [];
for (var g=0; g < maxGenerations; g++) {
  var epsilons = [];
  var rewards = [];
  var genes = [];
  var maxFitness = -999999;
  var championParams;
  var op = [];
  var gen = [];

  for (var i=0; i < population; i++) {
    var params;
    if (g !== 0) {
      params = currentPopulation[i];
    } else {
      params = []
      for (var j=0; j < numParams; j++) {
        var x = math.random(3, 5);
        params.push(x)
      }
    }

    var agent = new Agent(params);
    var reward = 0;
    for (var t=0; t < numTrials; t++) {
      reward += evaluateAgent(agent);
    }
    rewards.push(reward/numTrials);

    if (reward/numTrials > maxFitness) {
      maxFitness = reward/numTrials;
      championParams = params;
    }

    op.push([params, rewards[i]])
    gen.push([[params[0]], [params[1]]]);
  }

  fitnesses = rewards;
  averageFitness = rewards.reduce((a,b) => a + b, 0)/population;
  console.log('Generation: ' + g + ', Max: ' + maxFitness + ', Average: ' + averageFitness);

  op.sort(function(a, b){return a[1] - b[1];});
  op.reverse();

  currentPopulation = breed(op);
  trace.push(gen);

  if (g === maxGenerations - 1) {
    var encoded = JSON.stringify(trace)
    encoded = 'var data = ' + encoded + '\nmodule.exports = { data: data };'
    fs.writeFileSync("./freezer/GA.js", encoded);
  }
}
