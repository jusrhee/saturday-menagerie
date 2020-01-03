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
  taxiRow: 2,
  taxiColumn: 2,
  passenger: 2,
  destination: 3,
  actionLog: null,
}

// Resets the environment (returns observation)
var reset = () => {
  state.taxiRow = Math.floor(Math.random() * 5);
  state.taxiColumn = Math.floor(Math.random() * 5);

  // Ensure pickup !== dropoff w/ randomization
  var locations = [0, 1, 2, 3];
  locations.sort(() => Math.random() - 0.5);
  state.passenger = locations[0];
  state.destination = locations[1];

  state.actionLog = null;
  return state;
}

// Move to pickup reset
var mTPReset = () => {
  state.taxiRow = 2;
  state.taxiColumn = 2;
  state.passenger = 2;
  state.destination = 3;

  state.actionLog = null;
  return state;
}

// Check for a wall on move attempt
var canMove = (row, column, dir) => {
  if (dir === -1) {
    if (row < 2 && column === 2) {
      return false;
    }
    if (row > 2 && (column === 1 || column === 3)) {
      return false;
    }
  } else {
    if (row < 2 && column === 1) {
      return false;
    }
    if (row > 2 && (column === 0 || column === 2)) {
      return false;
    }
  }
  return true;
}

// Check for valid pickup attempt
var validPickup = (row, column, passenger) => {
  if (passenger === 0 && row === 0 && column === 0) {
    return true;
  } else if (passenger === 1 && row === 0 && column === 4) {
    return true;
  } else if (passenger === 2 && row === 4 && column === 0) {
    return true;
  } else if (passenger === 3 && row === 4 && column === 3) {
    return true;
  }
  return false;
}

// Check for correct dropoff attempt
var correctDropoff = (state) => {
  let { taxiRow, taxiColumn, passenger, destination } = state;
  if (passenger !== 4) {
    return false;
  } else if (destination === 0 && taxiRow === 0 && taxiColumn === 0) {
    return true;
  } else if (destination === 1 && taxiRow === 0 && taxiColumn === 4) {
    return true;
  } else if (destination === 2 && taxiRow === 4 && taxiColumn === 0) {
    return true;
  } else if (destination === 3 && taxiRow === 4 && taxiColumn === 3) {
    return true;
  }
  return false;
}

// Check valid dropoff (-1 for invalid, 0-3 for location)
var validDropoff = (taxiRow, taxiColumn) => {
  if (taxiRow === 0 && taxiColumn === 0) {
    return 0;
  } else if (taxiRow === 0 && taxiColumn === 4) {
    return 1;
  } else if (taxiRow === 4 && taxiColumn === 0) {
    return 2;
  } else if (taxiRow === 4 && taxiColumn === 3) {
    return 3;
  }
  return -1;
}

// Updates the environment
var step = (action) => {
  state.actionLog = action;
  let { taxiRow, taxiColumn, passenger, destination } = state;

  var reward = -1;
  var done = false;
  switch (action) {
    case 0:
      if (taxiRow < 4) {
        state.taxiRow += 1;
      }
      break;
    case 1:
      if (taxiRow > 0) {
        state.taxiRow -= 1;
      }
      break;
    case 2:
      if (taxiColumn < 4 && canMove(taxiRow, taxiColumn, 1)) {
        state.taxiColumn += 1;
      }
      break;
    case 3:
      if (taxiColumn > 0 && canMove(taxiRow, taxiColumn, -1)) {
        state.taxiColumn -= 1;
      }
      break;
    case 4:
      if (validPickup(taxiRow, taxiColumn, passenger)) {
        state.passenger = 4;
      } else {
        reward = -10;
      }
      break;
    default:
      if (correctDropoff(state)) {
        reward = 20;
        done = true;
      } else if (validDropoff(state) !== -1 && state.passenger === 4) {
        state.passenger = validDropoff(state);
      } else {
        reward = -10;
      }
  }

  return ({
    observation: state,
    reward: reward,
    done: done,
  });
}

var getEnv = () => {
  return state;
}

module.exports = {
  step: step,
  reset: reset,
  getEnv: getEnv,
  mTPReset: mTPReset,
};
