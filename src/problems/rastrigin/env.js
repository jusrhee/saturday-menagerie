// Resets the environment (returns observation)
var reset = () => {
  // Empty reset
}

// Updates the environment
var step = (action) => {
  var x = action[0];
  var y = action[1];

  var reward = 20 + Math.pow(x, 2) - 10 * Math.cos(2 * Math.PI * x) + Math.pow(y, 2) - 10 * Math.cos(2 * Math.PI * y);
  reward = 1/reward;

  return ({
    observation: {},
    reward: reward,
    done: false,
  });
}

var getEnv = () => {
  return {};
}

module.exports = {
  step: step,
  reset: reset,
  getEnv: getEnv,
};
