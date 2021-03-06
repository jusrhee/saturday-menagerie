const MultivariateNormal = require('multivariate-normal').default;
const env = require('./env');
const { DeterminedChicken: Agent } = require('./agents');
const numeric = require('numeric');
const { create, all } = require('mathjs');
const math = create(all);
const fs = require('fs');

math.import(numeric, { wrap: true, silent: true });

// Settings
const maxGenerations = 5000;
const populationSize = 800;
const numParams = 83;
const sigma = 0.3;
const numTrials = 5;
const numElite = 30;

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
    var part = math.multiply(math.reshape(diff, [numParams, 1]), [diff]);
    result = math.add(result, part);
  }
  return result;
}

// Main learning loop
var mean = math.random([1, numParams], 1)[0];

/* Eigendecomposition method
var b = math.identity([numParams, numParams]);
var d = math.identity([numParams, numParams]);
var c;
// TODO: replace with simple gaussian vector
var distribution = MultivariateNormal(math.zeros([1, numParams])[0], math.identity([numParams, numParams]));
*/

var covarianceMatrix = math.identity([numParams, numParams]);

for (var g=0; g < maxGenerations; g++) {
  var genMaxReward = -999999;

  var distribution = MultivariateNormal(mean, math.multiply(Math.pow(sigma, 2), covarianceMatrix));

  // An array storing "(agent-params, reward)" tuples
  var paramRewards = [];
  for (var i=0; i < populationSize; i++) {

    /* Eigendecomposition method
    // Create and evaluate agent
    var z = distribution.sample();

    // TODO: scale by sigma
    var params = math.add(mean, math.multiply(b, math.multiply(d, z)));
    */

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

  /* Eigendecomposition method
  // Adapt covariance matrix
  c = adaptCovMat(sortedParams);
  var scope = {
    c: c,
  }
  d = math.sqrt(math.diag(math.evaluate('eig(c)', scope).lambda.x));
  b = math.evaluate('eig(c)', scope).E.x;
  */

  covarianceMatrix = adaptCovMat(sortedParams);

  averageFitness = paramRewards.reduce((a, b) => a + b[1], 0) / populationSize;
  console.log('Generation: ' + g + ', Max: ' + genMaxReward + ', Average: ' + averageFitness);
}
