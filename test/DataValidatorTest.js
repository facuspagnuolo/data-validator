const chai = require('chai');
const expect = chai.expect;
const DataTypes = require('../src/DataTypes')
const DataValidator = require('../src/DataValidator')

describe("DataValidatorTest", () => {

  describe('nullable', () => {
    describe('when no nullable definition is given', () => {
      const model = {
        id: { type: DataTypes.INTEGER },
      }

      describe('when the value is present', () => {
        const data = { id: 1 }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })

      describe('when the value is not present', () => {
        const data = { }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })
    })

    describe('when can be nullable', () => {
      const model = {
        id: { type: DataTypes.INTEGER, nullable: true },
      }

      describe('when the value is present', () => {
        const data = { id: 1 }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })

      describe('when the value is not present', () => {
        const data = { }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })
    })

    describe('when can not be nullable', () => {
      const model = {
        id: { type: DataTypes.INTEGER, nullable: false },
      }

      describe('when the value is present', () => {
        const data = { id: 1 }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })

      describe('when the value is not present', () => {
        const data = { }

        it('returns a must be given error', () => {
          const errors = validator(model, data).call()
          expect(errors.id).to.have.lengthOf(1)
          expect(errors.id[0]).to.equal('must be given')
        })
      })
    })
  })

  describe('primitive types', () => {

    describe('given a simple model', () => {
      const model = {
        id: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING },
        acceptTerms: { type: DataTypes.BOOLEAN }
      }

      describe('given some data that applies given definition', () => {
        const data = { id: 1, name: 'charly', acceptTerms: true }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })

      describe('given non full data that applies given definition', () => {
        const data = { id: 1, name: 'charly' }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })

      describe('given some data with an null integer', () => {
        const data = { id: null, name: 'charly', acceptTerms: true }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })

      describe('given some data with an invalid integer', () => {
        const data = { id: 'a', name: 'charly', acceptTerms: true }

        it('returns an error', () => {
          const errors = validator(model, data).call()
          expect(errors.id).to.have.lengthOf(1)
          expect(errors.id[0]).to.equal('is not valid')
        })
      })

      describe('given some data with an invalid string', () => {
        const data = { id: 2, name: true, acceptTerms: true }

        it('returns an error', () => {
          const errors = validator(model, data).call()
          expect(errors.name).to.have.lengthOf(1)
          expect(errors.name[0]).to.equal('is not valid')
        })
      })

      describe('given some data with an invalid boolean', () => {
        const data = { id: 2, name: 'charly', acceptTerms: 2 }

        it('returns an error', () => {
          const errors = validator(model, data).call()
          expect(errors.acceptTerms).to.have.lengthOf(1)
          expect(errors.acceptTerms[0]).to.equal('is not valid')
        })
      })

      describe('given some invalid data', () => {
        const data = { id: /abc/, name: 2, acceptTerms: 'yes' }

        it('returns an error', () => {
          const errors = validator(model, data).call()

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

          it('returns an error', () => {
            const errors = validator(model, data).call()
            expect(errors.birthDate).to.have.lengthOf(1)
            expect(errors.birthDate[0]).to.equal('is not valid')
          })
        })

        describe('given a parseable date', () => {
          const data = { birthDate: '2017-1-1' }

          it('does not return an error', () => {
            const errors = validator(model, data).call()
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

          it('returns an error', () => {
            const errors = validator(model, data).call()
            expect(errors.birthDate).to.have.lengthOf(1)
            expect(errors.birthDate[0]).to.equal('is not valid')
          })
        })

        describe('given a parseable date with invalid format', () => {
          const data = { birthDate: '2017-1-1' }

          it('returns an error', () => {
            const errors = validator(model, data).call()
            expect(errors.birthDate).to.have.lengthOf(1)
            expect(errors.birthDate[0]).to.equal('is not valid')
          })
        })

        describe('given a parseable date with a valid format', () => {
          const data = { birthDate: '01/01/2017' }

          it('does not return an error', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })
      })
    })
  })

  describe('composed types', () => {
    const model = {
      file: {
        type: {
          id: { type: DataTypes.INTEGER, nullable: false },
          name: { type: DataTypes.STRING, nullable: false }
        }
      }
    }

    describe('given some data that applies given definition', () => {
      const data = { file: { id: 1, name: 'charly' } }

      it('does not return any errors', () => {
        const errors = validator(model, data).call()
        expect(errors).to.equal(null)
      })
    })

    describe('given some data with extra types', () => {
      const data = { file: { id: 1, name: 'file', extra: true } }

      it('does not return any errors', () => {
        const errors = validator(model, data).call()
        expect(errors).to.equal(null)
      })
    })

    describe('given some data with invalid types', () => {
      const data = { file: { id: 1, name: 2 } }

      it('returns an errors', () => {
        const errors = validator(model, data).call()
        expect(errors.file).to.have.lengthOf(1)
        expect(errors.file[0]).to.equal('is not valid')
      })
    })

    describe('given some data with missing types', () => {
      const data = { file: { id: 1 } }

      it('returns an errors', () => {
        const errors = validator(model, data).call()
        expect(errors.file).to.have.lengthOf(1)
        expect(errors.file[0]).to.equal('is not valid')
      })
    })

    describe('when composed type can be nullable', () => {
      describe('given null value', () => {
        const data = { file: null }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })

      describe('given undefined value', () => {
        const data = { file: undefined }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })
    })

    describe('when composed type can not be nullable', () => {
      beforeEach(() => {
        model.file.nullable = false
      })

      describe('given null value', () => {
        const data = { file: null }

        it('returns an errors', () => {
          const errors = validator(model, data).call()
          expect(errors.file).to.have.lengthOf(1)
          expect(errors.file[0]).to.equal('must be given')
        })
      })

      describe('given undefined value', () => {
        const data = { file: undefined }

        it('returns an errors', () => {
          const errors = validator(model, data).call()
          expect(errors.file).to.have.lengthOf(1)
          expect(errors.file[0]).to.equal('must be given')
        })
      })
    })
  })

  function validator(model, data) {
    return new DataValidator(model, data)
  }
})
