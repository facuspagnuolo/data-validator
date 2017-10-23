const _ = require('lodash')

const InclusionValidator = {
  call(data, list) {
    return _.includes(list, data)
  }
}

module.exports = InclusionValidator
