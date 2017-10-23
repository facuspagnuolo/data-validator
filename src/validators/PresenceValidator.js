const _ = require('lodash')
const TypeValidator = require('./TypeValidator')

const PresenceValidator = {
  call(value, nullable) {
    if(nullable === undefined || nullable) return true
    if(!TypeValidator.isBoolean(nullable)) throw new Error('presence validator must be boolean')
    return PresenceValidator._isPresent(value)
  },

  _isPresent(value) {
    return PresenceValidator._isNotNull(value) && PresenceValidator._isNotUndefined(value)
  },

  _isNotNull(value) {
    return !_.isNull(value)
  },

  _isNotUndefined(value) {
    return !_.isUndefined(value)
  }
}

module.exports = PresenceValidator
