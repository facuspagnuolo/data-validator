const chai = require('chai');
const expect = chai.expect;
const TypeValidator = require('../../src/validators/TypeValidator')

describe("TypeValidatorTest", () => {
  describe('isString', () => {
    it('returns true for a string', () => {
      expect(TypeValidator.isString("a string")).to.equal(true)
    })

    it('returns true for null or undefined', () => {
      expect(TypeValidator.isString(null)).to.equal(true)
      expect(TypeValidator.isString(undefined)).to.equal(true)
    })

    it('returns false for anything else', () => {
      expect(TypeValidator.isString(1)).to.equal(false)
      expect(TypeValidator.isString({})).to.equal(false)
      expect(TypeValidator.isString(true)).to.equal(false)
      expect(TypeValidator.isString(/abc/)).to.equal(false)
      expect(TypeValidator.isString(() => {})).to.equal(false)
    })
  })

  describe('isInteger', () => {
    it('returns true for an integer', () => {
      expect(TypeValidator.isInteger(1)).to.equal(true)
      expect(TypeValidator.isInteger(1.4)).to.equal(false)
    })

    it('returns true for null or undefined', () => {
      expect(TypeValidator.isInteger(null)).to.equal(true)
      expect(TypeValidator.isInteger(undefined)).to.equal(true)
    })

    it('returns false for anything else', () => {
      expect(TypeValidator.isInteger("a")).to.equal(false)
      expect(TypeValidator.isInteger({})).to.equal(false)
      expect(TypeValidator.isInteger(true)).to.equal(false)
      expect(TypeValidator.isInteger(/abc/)).to.equal(false)
      expect(TypeValidator.isInteger(() => {})).to.equal(false)
    })
  })

  describe('isBoolean', () => {
    it('returns true for true/false values', () => {
      expect(TypeValidator.isBoolean(true)).to.equal(true)
      expect(TypeValidator.isBoolean(false)).to.equal(true)
    })

    it('returns true for null or undefined', () => {
      expect(TypeValidator.isBoolean(null)).to.equal(true)
      expect(TypeValidator.isBoolean(undefined)).to.equal(true)
    })

    it('returns false for anything else', () => {
      expect(TypeValidator.isBoolean(1)).to.equal(false)
      expect(TypeValidator.isBoolean("a")).to.equal(false)
      expect(TypeValidator.isBoolean({})).to.equal(false)
      expect(TypeValidator.isBoolean(/abc/)).to.equal(false)
      expect(TypeValidator.isBoolean(() => {})).to.equal(false)
    })
  })

  describe('isDate', () => {
    it('returns true for dates', () => {
      expect(TypeValidator.isDate('2017-01-01')).to.equal(true)
      expect(TypeValidator.isDate('01-01-2017')).to.equal(true)
      expect(TypeValidator.isDate('01/08/2017', { dateFormat: 'DD/MM/YYYY' })).to.equal(true)
      expect(TypeValidator.isDate('2017-02-30')).to.equal(false)
      expect(TypeValidator.isDate('2017-13-01')).to.equal(false)
    })

    it('returns true for null or undefined', () => {
      expect(TypeValidator.isDate(null)).to.equal(true)
      expect(TypeValidator.isDate(undefined)).to.equal(true)
    })

    it('returns false for anything else', () => {
      expect(TypeValidator.isDate("a")).to.equal(false)
      expect(TypeValidator.isDate(true)).to.equal(false)
      expect(TypeValidator.isDate(/abc/)).to.equal(false)
      expect(TypeValidator.isDate(() => {})).to.equal(false)
    })
  })
})
