/*!
 * breeze-dag - async flow control for dag iteration
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var Queue = require('breeze-queue')
  , tsort = require('gaia-tsort');

/*!
 * Helpers
 */

var noop = function () {};

/**
 * ### dag (edges, concurrency, iterator[, done])
 *
 * DAG, directed-acyclic-graph, is a graph of nodes in
 * which there are no cyclic references, and therefor has
 * a specific starting and ending point. The `dag` async
 * method will take an array of edges and resolve a best
 * fit path of execution. It will then iterate over each
 * edge in parallel up to a set amount of threads (concurrency).
 * Furthermore, an edge will not begin it's processing until
 * all of its dependancies have indicated successful execution.
 *
 * A set of edges is defined as an array, with each element being
 * an array of x, y pairs, where `x` must complete before `y`
 * can begin.
 *
 * ```js
 * var edges = [
 *     [ 'a', 'b' ]
 *   , [ 'a', 'c' ]
 *   , [ 'd', 'e' ]
 *   , [ 'b', 'd' ]
 * ];
 * ```
 *
 * With the above edges, we expect `a` to start processing. Upon
 * completion, `b` and `c` will start. Upon `b` completion, `d`
 * will execute, then `e`.
 *
 * ```js
 * var dag = require('breeze-dag');
 *
 * dag(edges, 2, function (e, next) {
 *   setTimeout(function () {
 *     next(); // or next(err);
 *   }, 1000);
 * }, function (err) {
 *   // our done callback
 *   should.not.exist(err);
 * });
 * ```
 *
 * If there are cyclical references in the set of edges, the `done`
 * callback will be immediately called with an error indicating
 * the problem.
 *
 * If an error occurs the `done` callback will
 * be executed immediately. No more items will begin processing,
 * but items that have already started will run to completion.
 *
 * @param {Array} edges
 * @param {Number} concurrency
 * @param {Function} iterator
 * @param {Function} callback
 * @name dag
 * @api public
 */

module.exports = function (edges, concurrency, iterator, cb) {
  cb = cb || noop;
  var sorted = tsort(edges)
  if (sorted.error) return cb(sorted.error);
  if (!sorted.path.length) return cb(null);

  // helper: get edge with id
  function selectEdge(id) {
    return graph.filter(function (e) {
      return e.id === id;
    })[0];
  }

  // queue iterator
  function action (e, next) {
    iterator(e, function done (err) {
      var edge = selectEdge(e);
      edge.children.forEach(function (n) {
        var notify = selectEdge(n);
        notify.fulfilled.push(e);
        var wl = notify.parents.length
          , fl = notify.fulfilled.length;
        if (wl === fl) queue.push(n, null, true);
      });
      next(err);
    });
  }

  // determine where to start
  function bootstrap (e) {
    e.fulfilled = [];
    if (!e.parents.length) queue.push(e.id);
  }

  // begin
  var graph = sorted.graph
    , queue = Queue(action, concurrency);
  graph.forEach(bootstrap);
  queue.onerror = cb;
  queue.drain = cb;
  queue.process();
};
