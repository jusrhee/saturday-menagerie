// Import metaheuristics
const es = require('./metaheuristics/ES.js');

// Import environments
const chickenLittle = require('./problems/chicken-little/env.js');
const taxiV3 = require('./problems/taxi-v3/env.js');

// Import agents
const { StochasticAgent } = require('./shared/meta-agents.js');

// [Helper] Retrieves total number of network parameters
var getNumParams = (architecture) => {
  var total = 0;
  for (var i=0; i < architecture.length - 1; i++) {
    var bias = 1;
    if (i === 0) {
      bias = 0;
    }

    total += (architecture[i] + bias) * architecture[i + 1];
  }
  return total;
}

/**
 * @param e [str] - Environment title
 * @param mh [str] - Metaheuristic name
 * @param settings {...} - Metaheuristic settings
 * @param agentType [str] - Agent name
 * @param config {...} - Agent configuration options
 * @param sessionName [str] - Name for the training session
 */
var train = (e, mh, settings, agentType, config, sessionName, logFreq) => {

  // Set metaheuristic
  var heuristic;
  switch (mh) {
    case 'ES':
      heuristic = es;
      break;
    case 'GA':
      break;
    default:
      console.log('Received invalid metaheuristic');
  }

  // Set environment
  var env;
  switch (e) {
    case 'taxi-v3':
      env = taxiV3;
      break;
    case 'chicken-little':
      env = chickenLittle;
      break;
    default:
      console.log('Received invalid environment name');
  }

  // Set agent class
  var agentClass;
  switch (agentType) {
    case 'stochastic':
      agentClass = StochasticAgent;
      break;
    case 'deterministic':
      break;
    default:
      console.log('Received invalid agent type');
  }

  // Autofill numParams if an architecture is passed in
  if (config.architecture) {
    settings.numParams = getNumParams(config.architecture);
  }

  // [tentatively passing on agentType so we can log for rebuilding the agent during playback!]
  heuristic.run(env, e, settings, agentClass, config, sessionName, logFreq);
}

module.exports = {
  train: train,
};
