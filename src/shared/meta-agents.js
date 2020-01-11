const math = require('mathjs');
const { Feedforward } = require('./brains.js');

// [Borrowed] Softmax
var softmax = (arr) => {
  return arr.map(function(value,index) {
    return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
  })
}

// Simple stochastic agent for problems where Object.values(observation) = input
function StochasticAgent(params, config) {
  this.brain = new Feedforward(params, config.architecture);
}
StochasticAgent.prototype.act = function(observation, environment) {
  var input = Object.values(observation);
  var output = this.brain.fire(input);

  // Executes one stochastic action
  var decision = Math.random();
  var soft = softmax(output);
  var accum = 0;
  for (var i=0; i < soft.length; i++) {
    accum += soft[i];
    if (decision <= accum) {
      return environment.step(i);
    }
  }
};

module.exports = {
  StochasticAgent: StochasticAgent,
};
