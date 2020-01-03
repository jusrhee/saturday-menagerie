/*

  Custom JS implementation of the OpenAI Taxi-v3 environment
  https://gym.openai.com/envs/Taxi-v3/

  Permissible actions:
  - 0: move south
  - 1: move north
  - 2: move east
  - 3: move west
  - 4: pickup passenger
  - 5: dropoff passenger

*/

var state = {
  agentX: 3,
  aX: 7,
  aY: 7,
  bX: 7,
  bY: 7,
  cX: 7,
  cY: 7,
  actionLog: null,
}

// Resets the environment (returns observation)
var reset = () => {
  state.actionLog = null;
  return state;
}

// Updates the environment
var step = (action) => {
  state.actionLog = action;

  return ({
    observation: state,
    reward: 0,
    done: false,
  });
}

var getEnv = () => {
  return state;
}

module.exports = {
  step: step,
  reset: reset,
  getEnv: getEnv,
};
