const math = require('mathjs');

// [Borrowed] Softmax
var softmax = (arr) => {
  return arr.map(function(value,index) {
    return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
  })
}

function Chicken(params) {
  this.l1 = math.reshape(params.slice(0, 35), [7, 5]);
  this.l2 = math.reshape(params.slice(35, 53), [6, 3]);
}
Chicken.prototype.act = function(observation, env) {
  // Fire neural network
  var { x, aX, aY, bX, bY, cX, cY } = observation;
  var input = [x, aX, aY, bX, bY, cX, cY];
  var h1 = math.multiply(input, this.l1);
  h1 = math.map(h1, (x) => { return Math.max(x, 0) });
  h1 = math.concat([1], h1);
  var output = math.multiply(h1, this.l2);


  // Executes one stochastic action
  var decision = Math.random();
  var soft = softmax(output);
  var threshOne = soft[0];
  var threshTwo = threshOne + soft[1];

  if (decision <= threshOne) {
    return env.step(0);
  } else if (decision <= threshTwo) {
    return env.step(1);
  }
  return env.step(2);
};

function DeterminedChicken(params) {
  this.l1 = math.reshape(params.slice(0, 35), [7, 5]);
  this.l2 = math.reshape(params.slice(35, 53), [6, 3]);
}
DeterminedChicken.prototype.act = function(observation, env) {
  // Fire neural network
  var { x, aX, aY, bX, bY, cX, cY } = observation;
  var input = [x, aX, aY, bX, bY, cX, cY];
  var h1 = math.multiply(input, this.l1);
  h1 = math.map(h1, (x) => { return Math.max(x, 0) });
  h1 = math.concat([1], h1);
  var output = math.multiply(h1, this.l2);


  // Executes one stochastic action
  var soft = softmax(output);
  let i = soft.indexOf(Math.max(...soft));
  return env.step(i);
};

module.exports = {
  Chicken: Chicken,
  DeterminedChicken: DeterminedChicken,
};
