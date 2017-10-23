const chai = require('chai');
const expect = chai.expect;
const InclusionValidator = require('../../src/validators/InclusionValidator')

describe("InclusionValidator", () => {
  it('returns true for a value included in the list', () => {
    expect(InclusionValidator.call(2, [2, 3])).to.equal(true)
  })

  it('returns false for a value not included in the list', () => {
    expect(InclusionValidator.call(1, [2, 4])).to.equal(false)
  })
})
