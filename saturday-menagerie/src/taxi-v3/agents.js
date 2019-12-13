const math = require('mathjs');

// [Borrowed] Softmax
var softmax = (arr) => {
  return arr.map(function(value,index) {
    return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
  })
}

function Driver(params) {
  this.l1 = math.reshape(params.slice(0, 20), [5, 4]);
  this.l2 = math.reshape(params.slice(20, 70), [5, 10]);
  this.l3 = math.reshape(params.slice(70, 136), [11, 6])
}
Driver.prototype.act = function(observation, environment) {
  // Fire neural network
  var { taxiRow, taxiColumn, passenger, destination } = observation;
  var input = [1, taxiRow, taxiColumn, passenger, destination];
  var h1 = math.multiply(input, this.l1);
  h1 = math.map(h1, (x) => { return Math.max(x, 0) });
  h1 = math.concat([1], h1);
  var h2 = math.multiply(h1, this.l2);
  h2 = math.map(h2, (x) => { return Math.max(x, 0) });
  h2 = math.concat([1], h2);
  var output = math.multiply(h2, this.l3);

  // Executes one stochastic action
  var decision = Math.random();
  var soft = softmax(output);
  var threshOne = soft[0];
  var threshTwo = threshOne + soft[1];
  var threshThree = threshTwo + soft[2];
  var threshFour = threshThree + soft[3];
  var threshFive = threshFour + soft[4];

  if (decision <= threshOne) {
    return environment.step(1);
  } else if (decision <= threshTwo) {
    return environment.step(0);
  } else if (decision <= threshThree) {
    return environment.step(3);
  } else if (decision <= threshFour) {
    return environment.step(2);
  } else if (decision <= threshFive) {
    return environment.step(4);
  }
  return environment.step(5);
};

module.exports = {
  Driver: Driver,
};
