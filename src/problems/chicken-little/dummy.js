const MultivariateNormal = require('multivariate-normal').default;
const env = require('./env');
const { Chicken: Agent } = require('./agents');
const math = require('mathjs');
const fs = require('fs');

// Settings
const maxGenerations = 5000;
const populationSize = 5;
const numParams = 3;
const metaSigma = 1;
const numTrials = 5;
const numElite = 2;

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
  for (var i=0; i < numParams; i++) {
    for (var j=i; j < numParams; j++) {

      // Calculate sigma_{ij}
      var covariance = 0;
      for (var n=0; n < numElite; n++) {
        var indiv = sortedParams[n];
        covariance += (indiv[i] - meanVec[i]) * (indiv[j] - meanVec[j]);
      }
      covariance = covariance / numElite;
      result[i][j] = covariance;
      result[j][i] = covariance;
    }
  }
  console.log(result);
  console.log(math.det(result[0][0]));
  console.log(math.det(math.subset(result, math.index([0, 1], [0, 1]))));
  console.log(math.det(result));
  return result;
}

// Main learning loop
var mean = math.random([1, numParams], 10)[0];
var covarianceMatrix = math.identity([numParams, numParams]);
for (var g=0; g < maxGenerations; g++) {
  var genMaxReward = -999999;
  console.log(covarianceMatrix);
  var distribution = MultivariateNormal(mean, covarianceMatrix)

  // An array storing "(agent-params, reward)" tuples
  var paramRewards = [];
  for (var i=0; i < populationSize; i++) {

    // Create and evaluate agent
    var params = distribution.sample();
    var reward = i;

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
