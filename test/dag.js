describe('dag', function () {
  it('should run a set of edges in threads', function (done) {
    var deps = [
        [ null, 'a' ]
      , [ 'a', 'b' ]
      , [ 'a', 'c' ]
      , [ 'a', 'f' ]
      , [ 'd', 'e' ]
      , [ 'b', 'd' ]
    ];

    var spy = chai.spy(function (e, next) {
      setTimeout(next, 100);
    });

    dag(deps, 2, spy, function (err) {
      should.not.exist(err);
      spy.should.have.been.called.exactly(6);
      done();
    });
  });

  it('should bail on error', function (done) {
    var deps = [
        [ 'a', 'b' ]
      , [ 'a', 'c' ]
      , [ 'd', 'e' ]
      , [ 'b', 'd' ]
    ];

    var spy = chai.spy(function (e, next) {
      if (e === 'c') return next('err');
      setTimeout(next, 100);
    });

    dag(deps, 2, spy, function (err) {
      err.should.equal('err');
      spy.should.have.been.called.exactly(3);
      done();
    });
  });

  it('should detect cyclical error', function (done) {
    var deps = [
        [ 'a', 'b' ]
      , [ 'b', 'a' ]
    ];

    var spy = chai.spy(function (e, next) {
      setTimeout(next, 10);
    });

    dag(deps, 2, spy, function (err) {
      should.exist(err);
      err.should.be.instanceof(Error)
        .with.property('message', 'b can not come before a');
      spy.should.have.not.been.called();
      done();
    });
  });
});
