const math = require('mathjs');
const fs = require('fs');

// Default settings
var maxGenerations = 300;
var alpha = 0.0003;
var sigma = 0.1;
var population = 200;
var numTrials = 3;

var numParams = null;

// [Borrowed] Standard Normal variate using Box-Muller transform.
var randn_bm = () => {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Evaluates a single agent in an environment
var evaluateAgent = (agent, env) => {
  var reward = 0;
  var observation = env.reset();
  var done = false
  while (!done) {
    var feedback = agent.act(observation, env);
    var delta = feedback.reward;
    reward += delta;
    observation = feedback.observation;
    done = feedback.done;
  }
  return reward;
}

// Processes a single update to theta
var updateTheta = (theta, epsilons, rewards) => {
  var accEpsilon = math.zeros([numParams, 1]);
  for (var j=0; j < population; j++) {
    var weighedEpsilon = math.multiply(rewards[j], epsilons[j]);
    accEpsilon = math.add(accEpsilon, weighedEpsilon);
  }
  accEpsilon = math.multiply(alpha / (population * sigma), accEpsilon);
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

var run = (env, e, settings, agentClass, config, sessionName, logFreq) => {

  // Override settings [can probably use spread syntax here..]
  maxGenerations = settings.maxGenerations || maxGenerations;
  alpha = settings.alpha || alpha;
  sigma = settings.sigma || sigma;
  population = settings.population || population;
  numTrials = settings.numTrials || numTrials;

  numParams = settings.numParams;

  // Main learning loop [TODO: parameterize initialization range]
  var theta = math.random([numParams, 1], 0.1);
  var averageFitness = 0;
  fs.writeFileSync('./logs.json', '');
  for (var g=0; g < maxGenerations; g++) {
    var epsilons = [];
    var rewards = [];
    var maxFitness = -9999999;
    var championParams;
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
      var agent = new agentClass(params, config);
      var reward = 0;
      for (var t=0; t < numTrials; t++) {
        reward += evaluateAgent(agent, env) / numTrials;
      }
      rewards.push(reward);

      if (reward > maxFitness) {
        maxFitness = reward;
        championParams = params;
      }
    }

    fitnesses = remapFitnesses(rewards);
    theta = updateTheta(theta, epsilons, fitnesses);
    averageFitness = rewards.reduce((a,b) => a + b, 0) / population;
    var msg = 'Generation: ' + g + ', Max: ' + maxFitness + ', Average: ' + averageFitness;

    /*
    var data = fs.readFileSync('./logs.json', 'utf8')
    data = data.replace('[', '')
    data = data.replace(']', '');
    if (g > 0) {
      data += ',';
    }
    var asdf = '[' + data + '"' + msg + '"' + ']';
    console.log(asdf);
    fs.writeFileSync("./logs.json", asdf);
    */

    console.log(msg);
    /*
      var encoded = JSON.stringify(championParams)
      encoded = 'var data = ' + encoded + '\nmodule.exports = { data: data };'
      fs.writeFileSync("../problems/freezer/" + g + ".js", encoded);
    */

    if (g%(Math.round(1/logFreq)) === 0) {
      var encoded = JSON.stringify(championParams);
      encoded = 'var data = ' + encoded + '\nvar config = ' + JSON.stringify(config) + '\nmodule.exports = { data: data, config: config };'
      fs.writeFileSync("./problems/" + e + "/freezer/" + sessionName + "_" + g + ".js", encoded);
    }
  }
}

module.exports = {
  run: run,
};
