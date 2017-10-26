const TypeValidator = require('./validators/TypeValidator')
const PresenceValidator = require('./validators/PresenceValidator')
const InclusionValidator = require('./validators/InclusionValidator')

class DataValidator {
  constructor(model, data) {
    this.data = data
    this.model = model
    this.errors = null
  }

  call() {
    this._attributes().forEach(attribute => {
      const type = this._type(attribute)
      if(type === undefined) throw new Error(`Missing type for attribute '${attribute}'`)
      else if (typeof type !== 'object') this._validate(attribute)
      else {
        this._validate(attribute)
        let values = this.data[attribute];
        const composedValidationFailed = this.errors && this.errors[attribute]
        if(!composedValidationFailed && values) {
          if(!Array.isArray(values)) values = [values]
          values.forEach(value => {
            const errors = new DataValidator(type, value).call()
            if(errors) this._addError(attribute, 'is not valid')
          })
        }
      }
    })
    return this.errors
  }

  _validate(attribute) {
    let values = this.data[attribute]
    if(!Array.isArray(values)) values = [values]
    values.forEach(value => {
      this._validatePresence(attribute, value)
      this._validateType(attribute, value)
      this._validateInclusion(attribute, value)
    })
  }

  _validatePresence(attribute, value) {
    const nullable = this._nullable(attribute)
    const isValid = PresenceValidator.call(value, nullable)
    if (!isValid) this._addError(attribute, 'must be given')
  }

  _validateType(attribute, value) {
    const type = this._type(attribute)
    if(typeof type === 'object') return
    const validator = TypeValidator.typeValidatorFor(type)
    const validType = validator(value, this.model[attribute])
    if(!validType) this._addError(attribute, 'is not valid')
  }

  _validateInclusion(attribute, value) {
    const list = this._inclusion(attribute)
    const isIncluded = InclusionValidator.call(value, list)
    if (!isIncluded) this._addError(attribute, 'is not included in the list')
  }

  _type(attribute) {
    return this.model[attribute].type
  }

  _inclusion(attribute) {
    return this.model[attribute].inclusion
  }

  _nullable(attribute) {
    return this.model[attribute].nullable
  }

  _attributes() {
    return Object.keys(this.model)
  }

  _addError(attribute, message) {
    const errors = this.errors || {}
    errors[attribute] = (errors[attribute] || []).concat(message)
    this.errors = errors
  }
}

module.exports = DataValidator
