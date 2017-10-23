const _ = require('lodash')
const moment = require('moment')
const DataTypes = require('../DataTypes')

const TypeValidator = {

  typeValidatorFor(type) {
    const validators = {}
    validators[DataTypes.DATE] = this.isDate
    validators[DataTypes.STRING] = this.isString
    validators[DataTypes.BOOLEAN] = this.isBoolean
    validators[DataTypes.INTEGER] = this.isInteger
    const validator = validators[type];
    if(validator === undefined) throw new Error('Cannot pick validator for undefined type')
    return validator
  },

  isString(data, rules = {}) {
    if(TypeValidator._isNullOrUndefined(data)) return true
    return _.isString(data)
  },

  isBoolean(data, rules = {}) {
    if(TypeValidator._isNullOrUndefined(data)) return true
    return _.isBoolean(data)
  },

  isInteger(data, rules = {}) {
    if(TypeValidator._isNullOrUndefined(data)) return true
    return _.isInteger(data, rules)
  },

  isDate(data, rules = {}) {
    if(TypeValidator._isNullOrUndefined(data)) return true
    const dateFormat = rules.dateFormat;
    if (!dateFormat) return moment(data).isValid()
    else return TypeValidator.isString(data, rules) && moment(data, dateFormat).isValid()
  },

  _isNullOrUndefined(data) {
    return _.isNull(data) || _.isUndefined(data)
  }
}

module.exports = TypeValidator
