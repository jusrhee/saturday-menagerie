 const { GPU } = require('gpu.js');

  const generateMatrices = () => {
    const matrices = [[], []]
    for (let y = 0; y < 50; y++){
      matrices[0].push([])
      matrices[1].push([])
      for (let x = 0; x < 50; x++){
        matrices[0][y].push(Math.random())
        matrices[1][y].push(Math.random())
      }
    }
    return matrices
  }

  const gpu = new GPU();
const multiplyMatrix = gpu.createKernel(function(a, b) {
  let sum = 0;
  for (let i = 0; i < 50; i++) {
    sum += a[this.thread.y][i] * b[i][this.thread.x];
  }
  return sum;
}).setOutput([50, 50])

const matrices = generateMatrices();
for (var c=0; c < 100000; c++) {
  const out = multiplyMatrix(matrices[0], matrices[1])
}

console.log('endgame')
