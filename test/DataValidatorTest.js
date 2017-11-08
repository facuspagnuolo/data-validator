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

  describe('has many', () => {

    describe('nullable', () => {
      describe('when no nullable definition is given', () => {
        const model = {
          id: { type: DataTypes.INTEGER, many: true },
        }

        describe('when a value is present', () => {
          const data = { id: [1] }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('when the list is empty', () => {
          const data = { id: [] }

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
          id: { type: DataTypes.INTEGER, nullable: true, many: true },
        }

        describe('when the value is present', () => {
          const data = { id: [1] }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('when the list is empty', () => {
          const data = { id: [] }

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
          id: { type: DataTypes.INTEGER, nullable: false, many: true },
        }

        describe('when the value is present', () => {
          const data = { id: [1] }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('when the list is empty', () => {
          const data = { id: [] }

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
          jobs: {
            many: true,
            type: DataTypes.STRING,
            inclusion: ['first job', 'second job']
          },
        }

        describe('given some data that applies given definition', () => {
          const data = { id: 1, jobs: ['first job', 'second job'] }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('given non full data that applies given definition', () => {
          const data = { id: 1 }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('given some data with an null value for the list', () => {
          const data = { id: 1, jobs: [] }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('given some data with an invalid value for the list', () => {
          const data = { id: 2, jobs: [1] }

          it('returns an error', () => {
            const errors = validator(model, data).call()
            expect(errors.jobs).to.have.lengthOf(2)
            expect(errors.jobs[0]).to.equal('is not valid')
            expect(errors.jobs[1]).to.equal('is not included in the list')
          })
        })

        describe('given some data with an non-accepted value for the list', () => {
          const data = { id: 2, jobs: ['z'] }

          it('returns an error', () => {
            const errors = validator(model, data).call()
            expect(errors.jobs).to.have.lengthOf(1)
            expect(errors.jobs[0]).to.equal('is not included in the list')
          })
        })

        describe('given some invalid data', () => {
          const data = { id: /abc/, jobs: [2, 'second job'] }

          it('returns an error', () => {
            const errors = validator(model, data).call()

            expect(errors.id).to.have.lengthOf(1)
            expect(errors.id[0]).to.equal('is not valid')

            expect(errors.jobs).to.have.lengthOf(2)
            expect(errors.jobs[0]).to.equal('is not valid')
            expect(errors.jobs[1]).to.equal('is not included in the list')
          })
        })
      })

      describe('given a model with date type', () => {
        describe('when no format is specified', () => {
          const model = {
            birthDate: { type: DataTypes.DATE, many: true }
          }

          describe('given an invalid date', () => {
            const data = { birthDate: ['1-1-11-1'] }

            it('returns an error', () => {
              const errors = validator(model, data).call()
              expect(errors.birthDate).to.have.lengthOf(1)
              expect(errors.birthDate[0]).to.equal('is not valid')
            })
          })

          describe('given parseable dates', () => {
            const data = { birthDate: ['2017-1-1', '2017-1-1'] }

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
            const data = { birthDate: ['Z'] }

            it('returns an error', () => {
              const errors = validator(model, data).call()
              expect(errors.birthDate).to.have.lengthOf(1)
              expect(errors.birthDate[0]).to.equal('is not valid')
            })
          })

          describe('given a parseable date with invalid format', () => {
            const data = { birthDate: ['2017-1-1', '2017-01-01'] }

            it('returns an error', () => {
              const errors = validator(model, data).call()
              expect(errors.birthDate).to.have.lengthOf(2)
              expect(errors.birthDate[0]).to.equal('is not valid')
              expect(errors.birthDate[1]).to.equal('is not valid')
            })
          })

          describe('given a parseable date with a valid format', () => {
            const data = { birthDate: ['01/01/2017', '01/02/2017'] }

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
        files: {
          many: true,
          type: {
            id: { type: DataTypes.INTEGER, nullable: false },
            name: { type: DataTypes.STRING, nullable: false }
          }
        }
      }

      describe('given some data that applies given definition', () => {
        const data = { files: [{ id: 1, name: 'charly' }, { id: 2, name: 'john' }] }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })

      describe('given some data with extra types', () => {
        const data = { files: [{ id: 1, name: 'charly', extra: true }, { id: 2, name: 'john' }] }

        it('does not return any errors', () => {
          const errors = validator(model, data).call()
          expect(errors).to.equal(null)
        })
      })

      describe('given some data with invalid types', () => {
        const data = { files: [{ id: 1, name: 2 }, { id: 2, name: 'john' }] }

        it('returns an errors', () => {
          const errors = validator(model, data).call()
          expect(errors.files).to.have.lengthOf(1)
          expect(errors.files[0]).to.equal('is not valid')
        })
      })

      describe('given some data with missing types', () => {
        const data = { files: [{ id: 1, name: 'charly' }, { id: 2 }] }

        it('returns an errors', () => {
          const errors = validator(model, data).call()
          expect(errors.files).to.have.lengthOf(1)
          expect(errors.files[0]).to.equal('is not valid')
        })
      })

      describe('when composed type can be nullable', () => {
        describe('given null value', () => {
          const data = { files: null }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('given undefined value', () => {
          const data = { files: undefined }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })
      })

      describe('when composed type can not be nullable', () => {
        beforeEach(() => {
          model.files.nullable = false
        })

        describe('given null value', () => {
          const data = { files: null }

          it('returns an errors', () => {
            const errors = validator(model, data).call()
            expect(errors.files).to.have.lengthOf(1)
            expect(errors.files[0]).to.equal('must be given')
          })
        })

        describe('given undefined value', () => {
          const data = { files: undefined }

          it('returns an errors', () => {
            const errors = validator(model, data).call()
            expect(errors.files).to.have.lengthOf(1)
            expect(errors.files[0]).to.equal('must be given')
          })
        })
      })
    })
  })

  describe('metadata', () => {
    describe('ignore unknown fields', () => {
      describe('when no metadata was given', () => {
        const model = {
          id: { type: DataTypes.INTEGER, nullable: false },
          name: { type: DataTypes.STRING, nullable: false }
        }

        describe('when there are no extra attributes', () => {
          const data = { id: 1, name: 'charly' }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('when there is an extra attributes', () => {
          const data = { id: 1, name: 'file', extra: true }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })
      })

      describe('when rejectUnknownFields is not set', () => {
        const model = {
          metadata: {},
          id: { type: DataTypes.INTEGER, nullable: false },
          name: { type: DataTypes.STRING, nullable: false }
        }

        describe('when there are no extra attributes', () => {
          const data = { id: 1, name: 'charly' }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('when there is an extra attributes', () => {
          const data = { id: 1, name: 'file', extra: true }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })
      })

      describe('when rejectUnknownFields is set to false', () => {
        const model = {
          metadata: { rejectUnknownFields: false },
          id: { type: DataTypes.INTEGER, nullable: false },
          name: { type: DataTypes.STRING, nullable: false }
        }

        describe('when there are no extra attributes', () => {
          const data = { id: 1, name: 'charly' }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('when there is an extra attributes', () => {
          const data = { id: 1, name: 'file', extra: true }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })
      })

      describe('when rejectUnknownFields is set to true', () => {
        const model = {
          metadata: { rejectUnknownFields: true },
          id: { type: DataTypes.INTEGER },
          name: { type: DataTypes.STRING }
        }

        describe('when there are no extra attributes', () => {
          const data = { id: 1, name: 'charly' }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('when there are missing arguments', () => {
          const data = { id: 1 }

          it('does not return any errors', () => {
            const errors = validator(model, data).call()
            expect(errors).to.equal(null)
          })
        })

        describe('when there is an extra attributes', () => {
          const data = { id: 1, name: 'file', extra: true }

          it('returns an error', () => {
            const errors = validator(model, data).call()
            expect(errors.model).to.have.lengthOf(1)
            expect(errors.model[0]).to.equal('has unknown attributes')
          })
        })
      })
    })
  })

  function validator(model, data) {
    return new DataValidator(model, data)
  }
})
