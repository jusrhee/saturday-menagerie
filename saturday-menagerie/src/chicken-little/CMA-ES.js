const MultivariateNormal = require('multivariate-normal').default;
const env = require('./env');
const { Chicken: Agent } = require('./agents');
const math = require('mathjs');
const fs = require('fs');

// Settings
const maxGenerations = 5000;
const populationSize = 200;
const numParams = 83;
const metaSigma = 1;
const numTrials = 5;
const numElite = 50;

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

// Sorts params by associated fitness
var sortParams = (paramRewards) => {
  paramRewards.sort((a, b) => b[1] - a[1]);
  return paramRewards.map((x, i) => {
    return x[0];
  })
}

// Returns a new estimate covariance matrix
var adaptCovMat = (sortedParams) => {
  meanVec = math.divide(math.sum(sortedParams, 0), populationSize);
  var result = math.zeros([numParams, numParams]);
  for (var n=0; n < numElite; n++) {
    var indiv = sortedParams[n];
    var diff = math.subtract(indiv, meanVec);
    var part = math.divide(math.multiply(diff, math.transpose(diff)), numElite);
    result = math.add(result, part);
  }
  console.log(result)
  return result;
}

// Main learning loop
var mean = math.random([1, numParams], 0.1)[0];
var covarianceMatrix = math.identity([numParams, numParams]);
for (var g=0; g < maxGenerations; g++) {
  var genMaxReward = -999999;
  var distribution = MultivariateNormal(mean, covarianceMatrix)

  // An array storing "(agent-params, reward)" tuples
  var paramRewards = [];
  for (var i=0; i < populationSize; i++) {

    // Create and evaluate agent
    var params = distribution.sample();
    var agent = new Agent(params);
    var reward = 0;
    for (var t=0; t < numTrials; t++) {
      reward += evaluateAgent(agent) / numTrials;
    }
    paramRewards.push([params, reward]);

    if (reward > genMaxReward) {
      genMaxReward = reward;
      championParams = params;
    }
  }

  // Sample new mean from elite population
  var sortedParams = sortParams(paramRewards);
  var eliteParams = sortedParams.slice(0, numElite);
  mean = math.divide(math.sum(eliteParams, 0), numElite);

  // Adapt covariance matrix
  covarianceMatrix = adaptCovMat(sortedParams);

  averageFitness = paramRewards.reduce((a, b) => a + b[1], 0) / populationSize;
  console.log('Generation: ' + g + ', Max: ' + genMaxReward + ', Average: ' + averageFitness);
}
