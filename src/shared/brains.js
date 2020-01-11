const math = require('mathjs');

// ReLU activation
var activate = (vec) => {
  return math.map(vec, (x) => { return Math.max(x, 0) });
}

// Standard feedforward neural network
function Feedforward(params, architecture) {
  this.network = [];
  var from = 0;
  for (var l=0; l < architecture.length - 1; l++) {
    var bias = 1;
    if (l === 0) {
      bias = 0;
    }

    var j = architecture[l] + bias;
    var i = architecture[l + 1];
    var to = from + (j * i);

    var layer = math.reshape(params.slice(from, to), [j, i]);
    this.network.push(layer);
    from = to;
  }
}
Feedforward.prototype.fire = function(input) {
  var output = input;
  for (var l=0; l < this.network.length; l++) {
    var currentLayer = this.network[l];
    output = math.multiply(output, currentLayer);
    if (l !== this.network.length - 1) {
      output = math.concat([1], activate(output));
    }
  }
  return output;
};

module.exports = {
  Feedforward: Feedforward,
};
