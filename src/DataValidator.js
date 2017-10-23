const TypeValidator = require('./validators/TypeValidator')
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
    if(this._isInvalidType(attribute)) this._addError(attribute, 'is not valid');
    if(this._isIncluded(attribute)) this._addError(attribute, 'is not included in the list');
  }

  _isInvalidType(attribute) {
    const type = this._type(attribute);
    const validator = TypeValidator.typeValidatorFor(type);
    const validType = validator(this.data[attribute], this.model[attribute]);
    return !validType
  }

  _isIncluded(attribute) {
    const list = this._inclusion(attribute);
    const acceptedValue = list ? InclusionValidator.call(attribute, list) : true;
    return !acceptedValue
  }

  _type(attribute) {
    return this.model[attribute].type;
  }

  _inclusion(attribute) {
    return this.model[attribute].inclusion;
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
