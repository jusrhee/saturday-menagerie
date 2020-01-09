const MultivariateNormal = require('multivariate-normal').default;
const numeric = require('numeric');
const { create, all } = require('mathjs');
const math = create(all);

math.import(numeric, { wrap: true, silent: true });

const numParams = 83;
const numElite = 1;

var covarianceMatrix = math.identity([numParams, numParams]);
var meanVec = math.zeros([1, numParams])[0];
var distribution = MultivariateNormal(meanVec, covarianceMatrix);
var zK = distribution.sample();

var a = math.random([numParams, numParams]);
var scope = {
  a: a,
}
var d = math.diag(math.evaluate('eig(a)', scope).lambda.x);
var b = math.evaluate('eig(a)', scope).E.x;

console.log(math.multiply(a, b));
console.log(math.multiply(b, d));

// y_k = (B)(D)(z_k), x_k = m + sigma(y_k)
