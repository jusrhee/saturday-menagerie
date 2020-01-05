const env = require('./env');
const { Chicken } = require('./agents');
const math = require('mathjs');
const fs = require('fs');

// Settings
const maxGenerations = 5000;
const alpha = 0.00005;
const sigma = 0.05;
const population = 200;
const numTrials = 3;

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
var updateTheta = (theta, epsilons, rewards) => {
  var accEpsilon = math.zeros([53, 1]);
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
var theta = math.random([53, 1], 0.1);
var averageFitness = 0;
for (var g=0; g < maxGenerations; g++) {
  var epsilons = [];
  var rewards = [];
  var maxFitness = -999999;
  var championParams;
  for (var i=0; i < population; i++) {

    // Generate epsilon/perturbation vector
    var perturbVec = []
    for (var p=0; p < 53; p++) {
      perturbVec.push(randn_bm());
    }
    perturbVec = math.reshape(perturbVec, [53, 1]);
    epsilons.push(perturbVec);

    // Create and evaluate agent
    var params = math.add(theta, math.multiply(sigma, perturbVec));
    var agent = new Chicken(params);
    var reward = 0;
    for (var t=0; t < numTrials; t++) {
      reward += evaluateAgent(agent);
    }
    rewards.push(reward/numTrials);

    if (reward/numTrials > maxFitness) {
      maxFitness = reward/numTrials;
      championParams = params;
    }
  }

  fitnesses = remapFitnesses(rewards);
  theta = updateTheta(theta, epsilons, fitnesses);
  averageFitness = rewards.reduce((a,b) => a + b, 0)/population;
  console.log('Generation: ' + g + ', Max: ' + maxFitness + ', Average: ' + averageFitness);

  if (g % 100 === 0) {
    var encoded = JSON.stringify(championParams)
    encoded = 'var data = ' + encoded + '\nmodule.exports = { data: data };'
    fs.writeFileSync("./freezer/" + g + ".js", encoded);
  }
}
