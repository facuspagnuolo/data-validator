const chai = require('chai');
const expect = chai.expect;
const DataTypes = require('../src/DataTypes')
const DataValidator = require('../src/DataValidator')

describe("DataValidatorTest", () => {
  let validator = null;

  describe('given a simple model', () => {
    const model = {
      id: { type: DataTypes.INTEGER },
      name: { type: DataTypes.STRING },
      acceptTerms: { type: DataTypes.BOOLEAN }
    }

    describe('given some data that applies given definition', () => {
      const data = { id: 1, name: 'charly', acceptTerms: true }

      beforeEach(() => {
        validator = new DataValidator(model, data)
      })

      it('does not return any errors', () => {
        const errors = validator.call()
        expect(errors).to.equal(null)
      })
    })

    describe('given some data with an null integer', () => {
      const data = { id: null, name: 'charly', acceptTerms: true }

      beforeEach(() => {
        validator = new DataValidator(model, data)
      })

      it('returns an error', () => {
        const errors = validator.call()
        expect(errors.id).to.have.lengthOf(1)
        expect(errors.id[0]).to.equal('is not valid')
      })
    })

    describe('given some data with an invalid integer', () => {
      const data = { id: 'a', name: 'charly', acceptTerms: true }

      beforeEach(() => {
        validator = new DataValidator(model, data)
      })

      it('returns an error', () => {
        const errors = validator.call()
        expect(errors.id).to.have.lengthOf(1)
        expect(errors.id[0]).to.equal('is not valid')
      })
    })

    describe('given some data with an invalid string', () => {
      const data = { id: 2, name: true, acceptTerms: true }

      beforeEach(() => {
        validator = new DataValidator(model, data)
      })

      it('returns an error', () => {
        const errors = validator.call()
        expect(errors.name).to.have.lengthOf(1)
        expect(errors.name[0]).to.equal('is not valid')
      })
    })

    describe('given some data with an invalid boolean', () => {
      const data = { id: 2, name: 'charly', acceptTerms: 2 }

      beforeEach(() => {
        validator = new DataValidator(model, data)
      })

      it('returns an error', () => {
        const errors = validator.call()
        expect(errors.acceptTerms).to.have.lengthOf(1)
        expect(errors.acceptTerms[0]).to.equal('is not valid')
      })
    })

    describe('given some invalid data', () => {
      const data = { id: null, name: 2, acceptTerms: 'yes' }

      beforeEach(() => {
        validator = new DataValidator(model, data)
      })

      it('returns an error', () => {
        const errors = validator.call()

        expect(errors.id).to.have.lengthOf(1)
        expect(errors.id[0]).to.equal('is not valid')

        expect(errors.name).to.have.lengthOf(1)
        expect(errors.name[0]).to.equal('is not valid')

        expect(errors.acceptTerms).to.have.lengthOf(1)
        expect(errors.acceptTerms[0]).to.equal('is not valid')
      })
    })
  })

  describe('given a model with date type', () => {
    describe('when no format is specified', () => {
      const model = {
        birthDate: { type: DataTypes.DATE }
      }

      describe('given an invalid date', () => {
        const data = { birthDate: '1-1-11-1' }

        beforeEach(() => {
          validator = new DataValidator(model, data)
        })

        it('returns an error', () => {
          const errors = validator.call()
          expect(errors.birthDate).to.have.lengthOf(1)
          expect(errors.birthDate[0]).to.equal('is not valid')
        })
      })

      describe('given a parseable date', () => {
        const data = { birthDate: '2017-1-1' }

        beforeEach(() => {
          validator = new DataValidator(model, data)
        })

        it('does not return an error', () => {
          const errors = validator.call()
          expect(errors).to.equal(null)
        })
      })
    })

    describe('when a format is specified', () => {
      const model = {
        birthDate: { type: DataTypes.DATE, dateFormat: 'DD/MM/YYYY' }
      }

      describe('given an invalid date', () => {
        const data = { birthDate: 'Z' }

        beforeEach(() => {
          validator = new DataValidator(model, data)
        })

        it('returns an error', () => {
          const errors = validator.call()
          console.log(errors)
          expect(errors.birthDate).to.have.lengthOf(1)
          expect(errors.birthDate[0]).to.equal('is not valid')
        })
      })

      describe('given a parseable date with invalid format', () => {
        const data = { birthDate: '2017-1-1' }

        beforeEach(() => {
          validator = new DataValidator(model, data)
        })

        it('returns an error', () => {
          const errors = validator.call()
          expect(errors.birthDate).to.have.lengthOf(1)
          expect(errors.birthDate[0]).to.equal('is not valid')
        })
      })

      describe('given a parseable date with a valid format', () => {
        const data = { birthDate: '01/01/2017' }

        beforeEach(() => {
          validator = new DataValidator(model, data)
        })

        it('does not return an error', () => {
          const errors = validator.call()
          expect(errors).to.equal(null)
        })
      })
    })
  })
  
  describe('given a nested model', () => {
    const model = {
      file: {
        type: {
          id: { type: DataTypes.INTEGER },
          name: { type: DataTypes.STRING }
        }
      }
    }

    describe('given some data that applies given definition', () => {
      const data = { file: { id: 1, name: 'charly' } }

      beforeEach(() => {
        validator = new DataValidator(model, data)
      })

      it('does not return any errors', () => {
        const errors = validator.call()
        expect(errors).to.equal(null)
      })
    })

    describe('given some data with extra types', () => {
      const data = { file: { id: 1, name: 'file', extra: true } }

      beforeEach(() => {
        validator = new DataValidator(model, data)
      })

      it('does not return any errors', () => {
        const errors = validator.call()
        expect(errors).to.equal(null)
      })
    })

    describe('given some data with invalid types', () => {
      const data = { file: { id: 1, name: 2 } }

      beforeEach(() => {
        validator = new DataValidator(model, data)
      })

      it('returns an errors', () => {
        const errors = validator.call()
        expect(errors.file).to.have.lengthOf(1)
        expect(errors.file[0]).to.equal('is not valid')
      })
    })

    describe('given some data with missing types', () => {
      const data = { file: { id: 1 } }

      beforeEach(() => {
        validator = new DataValidator(model, data)
      })

      it('returns an errors', () => {
        const errors = validator.call()
        expect(errors.file).to.have.lengthOf(1)
        expect(errors.file[0]).to.equal('is not valid')
      })
    })
  })
})
