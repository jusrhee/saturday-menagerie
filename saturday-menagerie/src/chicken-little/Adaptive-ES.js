const env = require('./env');
const { Chicken: Agent } = require('./agents');
const math = require('mathjs');
const fs = require('fs');

// Settings
const maxGenerations = 5000;
const alpha = 0.0003;
const populationSize = 200;
const numTrials = 5;
const numParams = 83;
const numElite = 20;
const metaSigma = 1;

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
  var done = false
  while (!done) {
    var feedback = agent.act(observation, env);
    var delta = feedback.reward;
    done = feedback.done;
    observation = feedback.observation;
    reward += delta;
  }
  return reward;
}

// Processes a single update to theta
var updateTheta = (theta, epsilons, rewards, sigmaVec) => {
  var accEpsilon = math.zeros([numParams, 1]);
  for (var j=0; j < populationSize; j++) {
    var weighedEpsilon = math.multiply(rewards[j], epsilons[j]);
    accEpsilon = math.add(accEpsilon, weighedEpsilon);
  }
  accEpsilon = math.multiply(alpha / populationSize, accEpsilon);
  accEpsilon = math.dotDivide(accEpsilon, sigmaVec);
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

// Processes an update to the sigma vector (hopefully the money shot)
var updateSigmaVec = (theta, epsilons, rewards, sigmaVec) => {
  var meanVec = math.divide(math.sum(epsilons, 0), populationSize);
  var interleaved = []
  for (var i=0; i < populationSize; i++) {
    interleaved.push([epsilons[i], rewards[i]]);
  }
  interleaved.sort((a, b) => b[1] - a[1]);
  var elite = interleaved.map((x, i) => {
    return x[0];
  }).slice(0, numElite);

  var result = math.zeros([numParams, 1]);
  for (var i=0; i < numElite; i++) {
    var squareDiff = math.square(math.subtract(elite[i], meanVec));
    result = math.add(result, squareDiff);
  }
  result = math.sqrt(math.divide(result, numElite));
  result = math.multiply(result, metaSigma);
  return result;
}

// Main learning loop
var theta = math.random([numParams, 1], 0.1);
var sigmaVec = math.random([numParams, 1], 0.1);
for (var g=0; g < maxGenerations; g++) {
  var epsilons = [];
  var rewards = [];
  var maxFitness = -999999;
  var championParams;
  for (var i=0; i < populationSize; i++) {

    // Generate epsilon/perturbation vector
    var perturbVec = []
    for (var p=0; p < numParams; p++) {
      perturbVec.push(randn_bm());
    }
    perturbVec = math.reshape(perturbVec, [numParams, 1]);

    // Jitter with sigma vector
    perturbVec = math.dotMultiply(sigmaVec, perturbVec);
    epsilons.push(perturbVec);

    // Create and evaluate agent
    var params = math.add(theta, perturbVec);
    var agent = new Agent(params);
    var reward = 0;
    for (var t=0; t < numTrials; t++) {
      reward += evaluateAgent(agent) / numTrials;
    }
    rewards.push(reward);

    if (reward > maxFitness) {
      maxFitness = reward;
      championParams = params;
    }
  }

  // Update theta and sigmas
  fitnesses = remapFitnesses(rewards);
  theta = updateTheta(theta, epsilons, fitnesses, sigmaVec);
  sigmaVec = updateSigmaVec(theta, epsilons, fitnesses, sigmaVec);

  // Log and freeze
  var averageFitness = rewards.reduce((a,b) => a + b, 0) / populationSize;
  console.log('Generation: ' + g + ', Max: ' + maxFitness + ', Average: ' + averageFitness);
  if (g % 100 === 0) {
    var encoded = JSON.stringify(championParams)
    encoded = 'var data = ' + encoded + '\nmodule.exports = { data: data };'
    fs.writeFileSync("./freezer/" + g + ".js", encoded);
  }
}
