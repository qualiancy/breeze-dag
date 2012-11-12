TESTS = test/*.js
REPORTER = spec

build: components lib/*
	@./node_modules/.bin/component-build --dev

components: 
	@./node_modules/.bin/component-install --dev

test: build
	@printf "\n  ==> [Node.js]"
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require ./test/bootstrap \
		--reporter $(REPORTER) \
		$(TESTS)
	@printf "\n  ==> [Phantom.Js]"
	@./node_modules/.bin/mocha-phantomjs \
		--R ${REPORTER} \
		./test/browser/index.html

test-cov: lib-cov
	@dag_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov: clean
	@jscoverage lib lib-cov

clean:
	@rm -rf lib-cov
	@rm -f coverage.html
	@rm -rf build
	@rm -rf components

.PHONY: build test lib-cov test-cov clean
