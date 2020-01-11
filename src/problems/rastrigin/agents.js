function Brain(params) {
  this.params = params;
}
Brain.prototype.act = function(observation, environment) {
  return environment.step(this.params);
};

module.exports = {
  Brain: Brain,
};
