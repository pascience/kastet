all:
	browserify -o thirdparty_bundle.js thirdparty_requires.js

clean:
	rm thirdparty_bundle.js
