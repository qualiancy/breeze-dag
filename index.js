module.exports = process.env.dag_COV
  ? require('./lib-cov/dag')
  : require('./lib/dag');
