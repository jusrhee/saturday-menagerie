/*

  Sean's Chicken Little environment [7]

  Permissible actions:
  - 0: stay still
  - 1: move left
  - 2: move right

*/

var order = [2, 3, 3, 2, 3, 0, 0, 0, 2, 1, 0, 1, 0, 4, 0, 1, 4, 0, 2, 0, 1, 1, 0, 2, 0, 1, 1, 2, 4, 1, 0, 3, 4, 3, 1, 3, 1, 4, 3, 4, 0, 0, 4, 0, 1, 0, 4, 4, 0, 2, 1, 3, 2, 2, 0, 4, 3, 4, 0, 0, 2, 2, 4, 3, 2, 4, 4, 0, 3, 2, 1, 1, 0, 1, 0, 1, 2, 1, 0, 2, 4, 2, 2, 3, 2, 3, 2, 1, 1, 3, 1, 2, 4, 0, 3, 1, 1, 4, 1, 1, 2, 1, 2, 1, 0, 4, 1, 4, 1, 2, 1, 1, 1, 3, 4, 2, 3, 0, 0, 1, 3, 1, 3, 4, 0, 4, 3, 2, 4, 4, 3, 3, 2, 3, 0, 0, 0, 4, 0, 0, 3, 4, 2, 0, 1, 4, 4, 3, 1, 1, 4, 0, 3, 4, 1, 4, 3, 2, 1, 4, 4, 1, 4, 2, 3, 2, 0, 0, 4, 1, 2, 3, 1, 3, 1, 4, 0, 1, 3, 1, 4, 0, 0, 0, 4, 3, 4, 4, 1, 4, 1, 0, 4, 3, 0, 0, 1, 1, 2, 2]

var state = {
  x: 2,
  aX: 5,
  aY: 8,
  bX: 5,
  bY: 11,
  cX: 5,
  cY: 14,
}

var actionLog = null;

// Resets the environment (returns observation)
var reset = () => {
  state.x = 2;
  state.aX = 5;
  state.aY = 8;
  state.bX = 5;
  state.bY = 11;
  state.cX = 5;
  state.cY = 14;

  order = [2, 3, 3, 2, 3, 0, 0, 0, 2, 1, 0, 1, 0, 4, 0, 1, 4, 0, 2, 0, 1, 1, 0, 2, 0, 1, 1, 2, 4, 1, 0, 3, 4, 3, 1, 3, 1, 4, 3, 4, 0, 0, 4, 0, 1, 0, 4, 4, 0, 2, 1, 3, 2, 2, 0, 4, 3, 4, 0, 0, 2, 2, 4, 3, 2, 4, 4, 0, 3, 2, 1, 1, 0, 1, 0, 1, 2, 1, 0, 2, 4, 2, 2, 3, 2, 3, 2, 1, 1, 3, 1, 2, 4, 0, 3, 1, 1, 4, 1, 1, 2, 1, 2, 1, 0, 4, 1, 4, 1, 2, 1, 1, 1, 3, 4, 2, 3, 0, 0, 1, 3, 1, 3, 4, 0, 4, 3, 2, 4, 4, 3, 3, 2, 3, 0, 0, 0, 4, 0, 0, 3, 4, 2, 0, 1, 4, 4, 3, 1, 1, 4, 0, 3, 4, 1, 4, 3, 2, 1, 4, 4, 1, 4, 2, 3, 2, 0, 0, 4, 1, 2, 3, 1, 3, 1, 4, 0, 1, 3, 1, 4, 0, 0, 0, 4, 3, 4, 4, 1, 4, 1, 0, 4, 3, 0, 0, 1, 1, 2, 2];

  actionLog = null;
  return state;
}

var isDead = (x, aX, aY, bX, bY, cX, cY) => {
  if (x === aX) {
    if (aY === 0 || aY === 1) {
      return true
    }
  }
  if (x === bX) {
    if (bY === 0 || bY === 1) {
      return true
    }
  }
  if (x === cX) {
    if (cY === 0 || cY === 1) {
      return true
    }
  }
  return false
}

// Updates the environment
var step = (action) => {
  actionLog = action;

  var done = false;
  var reward = 1;
  if (order.length < 4) {
    done = true
  }

  state.aY -= 1
  state.bY -= 1
  state.cY -= 1

  if (state.aY === 7) {
    state.aX = order.pop()
  } else if (state.bY === 7) {
    state.bX = order.pop()
  } else if (state.cY === 7) {
    state.cX = order.pop()
  }
  if (state.aY === -1) {
    state.aY = 8
  } else if (state.bY === -1) {
    state.bY = 8
  } else if (state.cY === -1) {
    state.cY = 8
  }

  switch (action) {
    case 0:
      break;
    case 1:
      if (state.x > 0) {
        state.x -= 1;
      }
      break;
    case 2:
      if (state.x < 4) {
        state.x += 1;
      }
      break;
    default:
  }

  if (isDead(state.x, state.aX, state.aY, state.bX, state.bY, state.cX, state.cY)) {
    done = true
  }

  return ({
    observation: state,
    reward: reward,
    done: done,
    info: { actionLog },
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
