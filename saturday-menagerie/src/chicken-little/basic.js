const env = require('./env');
const { DeterminedChicken } = require('./agents');
const math = require('mathjs');
const fs = require('fs');

// Settings
const maxGenerations = 20000;
const alpha = 0.00005;
const sigma = 0.05;
const population = 1000;
const numTrials = 1;
const elite = 100;
const rand = 20;
const mutaterate = 0.014;
const maxperturb = 0.09;

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
  var accEpsilon = math.zeros([83, 1]);
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

var breed = (ppl) => {
  var newp = [];
  var select = [];
  var guy = []
  for (var i=0; i < elite; i++) {
    select.push(ppl[i][0])
  } for (var i=0; i < rand; i++) {
    guy = []
    for (var j=0; j < 83; j++) {
      var x = math.random() * 5;
      x *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
      guy.push(x)
    }
    select.push(guy)
  } for (var i = select.length - 1; i>0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = select[i]
    select[i] = select[j]
    select[j] = temp
  }


  for (var i = 0; i < (elite/2); i++) {
    for (var j = 0; j < population/(elite/2); j++) {
      var child = [];
      for (var k = 0; k < select[0].length; k++) {
        var p = 0;
        if (Math.random() < mutaterate) {
          p = Math.random() * maxperturb;
          p *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
          child[k] = [select[i*2], select[(i*2) + 1]][Math.round(Math.random())][k] + p;
        } else {
          child[k] = [select[i*2], select[(i*2) + 1]][Math.round(Math.random())][k];
        }
      }
      newp.push(child);
    }
  }

  return newp;
}

// Main learning loop
var theta = math.random([83, 1], 0.1);
var averageFitness = 0;
var theworldsfirstnextgenchicken = [];
for (var g=0; g < maxGenerations; g++) {
  var epsilons = [];
  var rewards = [];
  var genes = [];
  var maxFitness = -999999;
  var championParams;
  var op = [];

  for (var i=0; i < population; i++) {
    var params;
    if (g !== 0) {
      params = theworldsfirstnextgenchicken[i];
    } else {
      params = []
      for (var j=0; j < 83; j++) {
        var x = math.random() * 5;
        x *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        params.push(x)
      }
    }

    var agent = new DeterminedChicken(params);
    var reward = 0;
    for (var t=0; t < numTrials; t++) {
      reward += evaluateAgent(agent);
    }
    rewards.push(reward/numTrials);

    if (reward/numTrials > maxFitness) {
      maxFitness = reward/numTrials;
    }

    op.push([params, rewards[i]])
  }

  fitnesses = remapFitnesses(rewards);
  averageFitness = rewards.reduce((a,b) => a + b, 0)/population;
  console.log('Generation: ' + g + ', Max: ' + maxFitness + ', Average: ' + averageFitness);

  op.sort(function(a, b){return a[1] - b[1];});
  op.reverse();

  theworldsfirstnextgenchicken = breed(op);

  if (g % 100 === 0) {
    var encoded = JSON.stringify(championParams)
    encoded = 'var data = ' + encoded + '\nmodule.exports = { data: data };'
    fs.writeFileSync("./freezer/" + g + ".js", encoded);
  }
}
