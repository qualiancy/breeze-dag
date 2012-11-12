# breeze-dag [![Build Status](https://secure.travis-ci.org/qualiancy/breeze-dag.png?branch=master)](https://travis-ci.org/qualiancy/breeze-dag)

> Async flow control for directed-acyclic-graph iteration.

## Installation

### Node.js

`breeze-dag` is available on [npm](http://npmjs.org).

    $ npm install breeze-dag

### Component

`breeze-dag` is available as a [component](https://github.com/component/component).

    $ component install qualiancy/breeze-dag

## Usage

### dag (edges, concurrency, iterator[, done])

* **@param** _{Array}_ edges 
* **@param** _{Number}_ concurrency 
* **@param** _{Function}_ iterator 
* **@param** _{Function}_ callback 

DAG, directed-acyclic-graph, is a graph of nodes in
which there are no cyclic references, and therefor has
a specific starting and ending point. The `dag` async
method will take an array of edges and resolve a best
fit path of execution. It will then iterate over each
edge in parallel up to a set amount of threads (concurrency).
Furthermore, an edge will not begin it's processing until
all of its dependancies have indicated successful execution.

A set of edges is defined as an array, with each element being
an array of x, y pairs, where `x` must complete before `y`
can begin.

```js
var edges = [
    [ 'a', 'b' ]
  , [ 'a', 'c' ]
  , [ 'd', 'e' ]
  , [ 'b', 'd' ]
];
```

With the above edges, we expect `a` to start processing. Upon
completion, `b` and `c` will start. Upon `b` completion, `d`
will execute, then `e`.

```js
var dag = require('breeze-dag');

dag(edges, 2, function (e, next) {
  setTimeout(function () {
    next(); // or next(err);
  }, 1000);
}, function (err) {
  // our done callback
  should.not.exist(err);
});
```

If there are cyclical references in the set of edges, the `done`
callback will be immediately called with an error indicating
the problem.

If an error occurs the `done` callback will
be executed immediately. No more items will begin processing,
but items that have already started will run to completion.

## License

(The MIT License)

Copyright (c) 2012 Jake Luer <jake@qualiancy.com> (http://qualiancy.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
