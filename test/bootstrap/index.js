/*!
 * Attach chai to global should
 */

global.chai = require('chai');
global.should = global.chai.should();

/*!
 * Chai Plugins
 */

global.chai.use(require('chai-spies'));
//global.chai.use(require('chai-http'));

/*!
 * Import project
 */

global.dag = require('../..');

/*!
 * Helper to load internals for cov unit tests
 */

function req (name) {
  return process.env.dag_COV
    ? require('../../lib-cov/dag/' + name)
    : require('../../lib/dag/' + name);
}

/*!
 * Load unexposed modules for unit tests
 */

global.__dag = {};
