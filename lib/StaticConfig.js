const { fromJS } = require('immutable')
const BaseConfig = require('./BaseConfig')

class StaticConfig extends BaseConfig {
  constructor ({ config }) {
    super()

    setImmediate(() => {
      this._loaded = true
      this.emit('validate', config)
      this._config = fromJS(config)
      this.emit('load')
    })
  }
}

module.exports = StaticConfig
