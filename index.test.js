'use strict'
function capitalise(word) {
	return word.charAt(0).toUpperCase() + word.slice(1)
}

describe('options-checking', () => {
	it('throws when no options are specified', () => {
		expect(() => {
			require('./')()
		}).toThrow(Error('No options specified.'))
	})

	it('throws when a non-object is given', () => {
		expect(() => {
			require('./')(42)
		}).toThrow(Error('Non-object options specified.'))
	})

	for (const setting of ['errors', 'warnings']) {
		describe(`checks if ${setting} callback is not a function`, () => {
			let options

			beforeEach(() => {
				if (setting === 'errors') {
					options = { warnings: () => {} }
				} else {
					options = { errors: () => {} }
				}
			})

			it(`throws when no ${setting} callback is given`, () => {
				expect(() => {
					require('./')(options)
				}).toThrow(Error(`No ${setting} callback specified.`))
			})

			it(`throws when ${setting} is not a function`, () => {
				options[setting] = 42
				expect(() => {
					require('./')(options)
				}).toThrow(Error(`${capitalise(setting)} callback is not a function.`))
			})

			it(`doesn't throw when ${setting} is a function`, () => {
				options[setting] = () => {}
				expect(() => {
					require('./')(options)
				}).not.toThrow()
			})
		})
	}

	for (const setting of ['log', 'filter']) {
		describe(`checks if ${setting} is neither null nor a function`, () => {
			let options

			beforeEach(() => {
				options = {
					errors: () => {},
					warnings: () => {},
				}
			})

			it(`throws if ${setting} is a number`, () => {
				options[setting] = 42
				expect(() => {
					require('./')(options)
				}).toThrow(Error(`${capitalise(setting)} callback is neither null nor a function.`))
			})

			it(`doesn't throw if ${setting} is null`, () => {
				options[setting] = null
				expect(() => {
					require('./')(options)
				}).not.toThrow()
			})

			it(`doesn't throw when ${setting} is a function`, () => {
				options[setting] = () => {}
				expect(() => {
					require('./')(options)
				}).not.toThrow()
			})
		})
	}

	for (const list of ['validWords', 'warnWords']) {
		describe(`checks ${list} is either not given or is an array`, () => {
			let options

			beforeEach(() => {
				options = {
					errors: () => {},
					warnings: () => {},
				}
			})

			it(`doesn't throw if ${list} is not specified`, () => {
				options[list] = []
				expect(() => {
					require('./')(options)
				}).not.toThrow()
			})

			it(`throws if ${list} is not an array`, () => {
				options[list] = 42
				expect(() => {
					require('./')(options)
				}).toThrow(Error(`${list} is not an array.`))
			})

			it(`doesn't throw if ${list} is an emmpty array`, () => {
				options[list] = []
				expect(() => {
					require('./')(options)
				}).not.toThrow()
			})

			it(`doesn't throw if ${list} is a populated array`, () => {
				options[list] = ['forty-two']
				expect(() => {
					require('./')(options)
				}).not.toThrow()
			})
		})
	}
})

describe('spell-checking', () => {
	let sc
	let errorsMock
	let warningsMock

	beforeEach(() => {
		errorsMock = jest.fn()
		warningsMock = jest.fn()
		sc = require('./')({
			errors: errorsMock,
			warnings: warningsMock
		})
	})

	test('copes when everything is spelled correctly', () => {
		sc.check('Fun')
		expect(errorsMock.mock.calls.length).toBe(0)
		expect(warningsMock.mock.calls.length).toBe(0)
	})

	test('flags spelling errors', () => {
		sc.check('Spellrite')
		expect(errorsMock.mock.calls.length).toBe(1)
		expect(errorsMock.mock.calls[0][0]).toEqual(['Spellrite'])
		expect(warningsMock.mock.calls.length).toBe(0)
	})
})

describe('filtering', () => {
	it('filters text', () => {
		const errorsMock = jest.fn()
		const warningsMock = jest.fn()
		const filter = (text) => text.replace(/rite/, ' correctly')
		const sc = require('./')({
			errors: errorsMock,
			warnings: warningsMock,
			filter: filter
		})
		sc.check('Spellrite')
		expect(errorsMock.mock.calls.length).toBe(0)
	})
})

describe('valid words and warning words', () => {
	// TODO can't test spellings being added to the word list on macOS due to
	//      https://github.com/atom/node-spellchecker/issues/22
	/* it('treats valid words as valid', () => {
		const errorsMock = jest.fn()
		const warningsMock = jest.fn()
		const sc = require('./')({
			errors: errorsMock,
			warnings: warningsMock,
			validWords: ['Spellrite']
		})
		sc.check('Something about Spellrite')
		expect(errorsMock.mock.calls.length).toBe(0)
		expect(warningsMock.mock.calls.length).toBe(0)
	})*/

	it('flags warning words as warnings instead of errors', () => {
		const errorsMock = jest.fn()
		const warningsMock = jest.fn()
		const sc = require('./')({
			errors: errorsMock,
			warnings: warningsMock,
			warnWords: ['Spellrite']
		})
		sc.check('Something about Spellrite')
		expect(errorsMock.mock.calls.length).toBe(0)
		expect(warningsMock.mock.calls.length).toBe(1)
		expect(warningsMock.mock.calls[0][0]).toEqual(['Spellrite'])
	})
})
