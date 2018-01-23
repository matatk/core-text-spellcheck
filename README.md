core-text-spellcheck
====================

[![Build Status](https://travis-ci.org/matatk/core-text-spellcheck.svg?branch=master)](https://travis-ci.org/matatk/core-text-spellcheck)

This is a basic spell-checking library that can check the spelling of text. It is used as the basis for [markdown-it-spellcheck](https://github.com/matatk/markdown-it-spellcheck) and [html-spellcheck](https://github.com/matatk/html-spellcheck).

It gives you callbacks that you can use to track any spelling errors or warnings. You can also add words to the custom dictionary, and set up a filter function to allow some pre-processing.

You'll need to provide the code for those callbacks; the use-case envisaged is that your test suite checks spellings and can fail a build if errors are found.

Refer to [example.js](example.js) (and [example.txt](example.txt)) for a real-world example.

```javascript
const fs = require('fs')
const sc = require('core-text-spellcheck')({
		errors: (errors) => {
			console.log(`Errors: ${errors.join(', ')}`)
		},
		warnings: (warnings) => {
			console.log(`Warnings: ${warnings.join(', ')}`)
		}
	})

sc.check(fs.readFileSync('example.txt').toString())
```

Options
-------

### Required

#### errors

Callback taking a single parameter: an array of errant words that are being flagged as errors.

(It's recommended that when errors are encountered, they would make the overall spell-check fail.)

#### warnings

Callback taking a single parameter: an array of errant words that are being flagged as warnings.

(You might want to flag some things as warnings if they might be valid in certain situations, such as incorrect spellings that may be used as proper nouns in some cases.)

### Optional

#### log

Callback taking a single parameter: a debug/log message to output.

You can set this to `null` too, which allows you to easily make this setting mirror a "debug" option in your spell-checking program (as is done in [example.js](example.js)).

**Default value:** `null`

#### validWords

An array containing words that are to be treated as valid.

They will be added to the Hunspell custom dictionary. On most platforms, this is not persistent, but on macOS it is (in `~/Library/Spelling/[language-code]`).

There's [a GitHub issue on spellchecker](https://github.com/atom/node-spellchecker/issues/22) relating to this.

**Default value:** `[]`

#### warnWords

An array containing words that are to be treated as valid, but will trigger a warning when used.

This is not persistent on any platform.

**Default value:** `[]`

#### filter

A callback that is used to process some text before it's passed to the spellchecker.

Consult [example.js](example.js) and [example.txt](example.txt) for an example of how a filter can be used.

**Default value:** `null`

Development
-----------

### Set-up

* Check out the code.
* `npm install`

### Useful scripts

* `npm test`&mdash;runs the tests (which also happens on pre-commit).
* `npm run example`&mdash;runs the example script (it is expected that this returns an error, as it should correctly find a misspelling).
