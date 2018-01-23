'use strict'
const fs = require('fs')

const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.boolean('filenames')
	.describe('filenames', 'List files being checked')
	.alias('f', 'filenames')
	.boolean('debug')
	.describe('debug', 'Show debugging info')
	.alias('d', 'debug')
	.help()
	.alias('h', 'help')
	.argv

function findErrorsInFile(spellCore, fileName) {
	if (argv.filenames) {
		console.log(`Checking file: "${fileName}"...`)
	}

	spellCore.check(fs.readFileSync(fileName).toString())
}

function main() {
	let foundErrors = 0
	let foundWarnings = 0
	let currentFile

	const sc = require('./')({
		log: argv.debug ? console.log : null,
		errors: (errors) => {
			console.log(`Error: ${currentFile}: ${errors.join(', ')}`)
			foundErrors++
		},
		warnings: (warnings) => {
			console.log(`Warning: ${currentFile}: ${warnings.join(', ')}`)
			foundWarnings++
		},
		filter: (text) => text.replace(/@!@.+@!@/g, ''),
		warnWords: ['colour', 'color'],
		validWords: ['wibble']
	})

	for (const fileToCheck of ['example.txt']) {
		currentFile = fileToCheck
		findErrorsInFile(sc, fileToCheck)
	}

	if (foundErrors > 0 || foundWarnings > 0) {
		console.log()
	}

	console.log(`Check complete; there were ${foundErrors} errors and ${foundWarnings} warnings.`)
	process.exit(foundErrors)
}

main()
