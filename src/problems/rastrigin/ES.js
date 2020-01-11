const env = require('./env');
const { Brain: Agent } = require('./agents');
const math = require('mathjs');
const fs = require('fs');

// Settings
const maxGenerations = 100;
const alpha = 0.008;
const sigma = 0.4;
const population = 200;
const numTrials = 1;
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

// Processes a single update to theta
var updateTheta = (theta, epsilons, rewards) => {
  var accEpsilon = math.zeros([numParams, 1]);
  for (var j=0; j < population; j++) {
    var weighedEpsilon = math.multiply(rewards[j], epsilons[j]);
    accEpsilon = math.add(accEpsilon, weighedEpsilon);
  }
  accEpsilon = math.multiply(alpha/(population*sigma), accEpsilon);
  return math.add(theta, accEpsilon);
}

// Fitness shaping function
var remapFitnesses = (rewards) => {
  var sorted = rewards.slice();
  sorted.sort((a, b) => a - b);
  return rewards.map((x, i) => {
    return sorted.indexOf(x);
  })
}

// Main learning loop
var theta = math.random([2, 1], 4, 5);
var averageFitness = 0;
var trace = [];
for (var g=0; g < maxGenerations; g++) {

  var epsilons = [];
  var rewards = [];
  var maxFitness = -999999;
  var gen = [];
  for (var i=0; i < population; i++) {

    // Generate epsilon/perturbation vector
    var perturbVec = []
    for (var p=0; p < numParams; p++) {
      perturbVec.push(randn_bm());
    }
    perturbVec = math.reshape(perturbVec, [numParams, 1]);
    epsilons.push(perturbVec);

    // Create and evaluate agent
    var params = math.add(theta, math.multiply(sigma, perturbVec));
    var agent = new Agent(params);
    gen.push(params);
    var reward = 0;
    for (var t=0; t < numTrials; t++) {
      //map = refreshState(map);
      reward += evaluateAgent(agent);
    }
    rewards.push(reward);

    if (reward > maxFitness) {
      maxFitness = reward;
      championParams = params;
    }
  }
  trace.push(gen);

  fitnesses = remapFitnesses(rewards);
  theta = updateTheta(theta, epsilons, fitnesses);
  averageFitness = rewards.reduce((a,b) => a + b, 0)/population;
  console.log('Generation: ' + g + ', Max: ' + maxFitness + ', Average: ' + averageFitness);

  if (g === maxGenerations - 1) {
    var encoded = JSON.stringify(trace)
    encoded = 'var data = ' + encoded + '\nmodule.exports = { data: data };'
    fs.writeFileSync("./freezer/ES.js", encoded);
  }
}
