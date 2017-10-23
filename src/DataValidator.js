const TypeValidator = require('./validators/TypeValidator')
const PresenceValidator = require('./validators/PresenceValidator')
const InclusionValidator = require('./validators/InclusionValidator')

class DataValidator {
  constructor(model, data) {
    this.data = data
    this.model = model
    this.errors = null
    //TODO: validate model validators are well defined
  }

  call() {
    this._attributes().forEach(attribute => {
      const type = this._type(attribute);
      if (typeof type !== 'object') this._validate(attribute)
      else {
        const errors = new DataValidator(type, this.data[attribute]).call()
        if(errors) this._addError(attribute, 'is not valid')
      }
    })
    return this.errors
  }

  _validate(attribute) {
    this._validatePresence(attribute);
    this._validateType(attribute);
    this._validateInclusion(attribute);
  }

  _validatePresence(attribute) {
    const nullable = this._nullable(attribute);
    const isValid = PresenceValidator.call(this.data[attribute], nullable);
    if (!isValid) this._addError(attribute, 'must be given');
  }

  _validateType(attribute) {
    const type = this._type(attribute);
    const validator = TypeValidator.typeValidatorFor(type);
    const validType = validator(this.data[attribute], this.model[attribute]);
    if(!validType) this._addError(attribute, 'is not valid');
  }

  _validateInclusion(attribute) {
    const list = this._inclusion(attribute);
    const isIncluded = InclusionValidator.call(attribute, list);
    if (!isIncluded) this._addError(attribute, 'is not included in the list');
  }

  _type(attribute) {
    return this.model[attribute].type;
  }

  _inclusion(attribute) {
    return this.model[attribute].inclusion;
  }

  _nullable(attribute) {
    return this.model[attribute].nullable;
  }

  _attributes() {
    return Object.keys(this.model);
  }

  _addError(attribute, message) {
    const errors = this.errors || {}
    errors[attribute] = (errors[attribute] || []).concat(message)
    this.errors = errors
  }
}

module.exports = DataValidator
