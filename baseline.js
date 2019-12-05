const math = require('mathjs');

const x = math.ones(50, 50);
const y = math.ones(50, 50);

for (var c=0; c < 100000; c++) {
  const res = math.multiply(x, y);
}

console.log('finnito');
