PATH := ./node_modules/.bin:$(PATH)

.PHONY: lint

lint:
	@echo "Linting server side scripts"
	jshint --config ./lib/.jshintrc --exclude-path lib/.jshintignore lib/
	@echo "Linting client side scripts"
	jshint --config ./lib/clients/.jshintrc lib/clients
	@echo "Linting examples"
	jshint --config ./lib/.jshintrc --exclude **/node_modules/** examples/

