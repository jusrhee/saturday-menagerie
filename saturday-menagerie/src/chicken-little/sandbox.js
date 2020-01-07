const MultivariateNormal = require('multivariate-normal').default;
const env = require('./env');
const { Chicken } = require('./agents');
const math = require('mathjs');
const fs = require('fs');

var meanVector = math.random([3, 1], 0.1);
var covarianceMatrix = math.ones([3, 3]);
var distribution = MultivariateNormal(math.transpose(meanVector)[0], covarianceMatrix);
console.log(distribution.sample());
