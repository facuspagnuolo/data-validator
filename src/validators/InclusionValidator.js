const _ = require('lodash')

const InclusionValidator = {
  call(data, list) {
    if(list === undefined) return true
    return _.includes(list, data)
  }
}

module.exports = InclusionValidator
