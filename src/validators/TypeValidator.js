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
    return validators[type]
  },

  isString(data, rules = {}) {
    return _.isString(data)
  },

  isBoolean(data, rules = {}) {
    return _.isBoolean(data)
  },

  isInteger(data, rules = {}) {
    return _.isInteger(data, rules)
  },

  isDate(data, rules = {}) {
    const dateFormat = rules.dateFormat;
    if (!dateFormat) return moment(data).isValid()
    else return TypeValidator.isString(data, rules) && moment(data, dateFormat).isValid()
  },
}

module.exports = TypeValidator
