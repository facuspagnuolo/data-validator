const chai = require('chai');
const expect = chai.expect;
const PresenceValidator = require('../../src/validators/PresenceValidator')

describe("PresenceValidator", () => {
  describe('when nullable is undefined', () => {
    const nullable = undefined

    it('returns true for null or undefined values', () => {
      expect(PresenceValidator.call(null, nullable)).to.equal(true)
      expect(PresenceValidator.call(undefined, nullable)).to.equal(true)
    })
  })

  describe('when nullable is true', () => {
    const nullable = true

    it('returns true for null or undefined values', () => {
      expect(PresenceValidator.call(null, nullable)).to.equal(true)
      expect(PresenceValidator.call(undefined, nullable)).to.equal(true)
    })
  })

  describe('when nullable is false', () => {
    const nullable = false

    it('returns false for null or undefined values', () => {
      expect(PresenceValidator.call(null, nullable)).to.equal(false)
      expect(PresenceValidator.call(undefined, nullable)).to.equal(false)
    })
  })

  describe('when nullable is not a boolean', () => {
    const nullable = 1

    it('throws an error', () => {
      expect(PresenceValidator.call(null, nullable)).to.throw
    })
  })
})
