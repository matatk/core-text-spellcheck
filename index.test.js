'use strict'

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

	it('throws when no errors callback is specified', () => {
		expect(() => {
			require('./')({
				warnings: () => {}
			})
		}).toThrow(Error('No errors callback specified.'))

		expect(() => {
			require('./')({
				warnings: () => {},
				errors: 42
			})
		}).toThrow(Error('Errors callback is not a function.'))

		expect(() => {
			require('./')({
				warnings: () => {},
				errors: () => {}
			})
		}).not.toThrow()
	})

	it('throws when no warnings callback is specified', () => {
		expect(() => {
			require('./')({
				errors: () => {}
			})
		}).toThrow(Error('No warnings callback specified.'))

		expect(() => {
			require('./')({
				errors: () => {},
				warnings: 42
			})
		}).toThrow(Error('Warnings callback is not a function.'))

		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {}
			})
		}).not.toThrow()
	})

	it('throws if options.log is neither null nor a function', () => {
		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				log: 42
			})
		}).toThrow(Error('Log callback is neither null nor a function.'))

		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				log: null
			})
		}).not.toThrow()

		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				log: () => {}
			})
		}).not.toThrow()
	})

	it('throws if options.filter is not a function', () => {
		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				filter: 42
			})
		}).toThrow(Error('Filter callback is not a function.'))

		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				filter: () => {}
			})
		}).not.toThrow()
	})

	it('throws if validWords is not an array', () => {
		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				validWords: 42
			})
		}).toThrow(Error('validWords is not an array.'))

		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				validWords: []
			})
		}).toThrow(Error('validWords array is empty.'))

		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				validWords: ['forty-two']
			})
		}).not.toThrow()
	})

	it('throws if warnWords is not an array', () => {
		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				warnWords: 42
			})
		}).toThrow(Error('warnWords is not an array.'))

		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				warnWords: []
			})
		}).toThrow(Error('warnWords array is empty.'))

		expect(() => {
			require('./')({
				errors: () => {},
				warnings: () => {},
				warnWords: ['forty-two']
			})
		}).not.toThrow()
	})
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