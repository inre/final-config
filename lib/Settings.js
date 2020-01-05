const { fromJS } = require('immutable')
const BaseConfig = require('./BaseConfig')
const MergedConfig = require('./MergedConfig')
const StaticConfig = require('./StaticConfig')
const factory = require('./factory')
// const messages = require('./messages.json')

class Settings extends BaseConfig {
  constructor (config, configSources = factory.CONFIG_SOURCES) {
    super()
    this._configSource = configSources

    // No config inside
    if (!config) {
      config = new StaticConfig({ config: {} })
      /* setImmediate(() => {
        this._loaded = true
        this.emit('error', new Error(messages.NO_CONFIG))
      }) */
      return this
    }

    const loadConfig = () => {
      const configData = config.toJS()
      this._loaded = true
      this.emit('validate', configData)
      this._config = fromJS(configData)
      this.emit('load')
    }

    if (config.isLoaded) {
      setImmediate(loadConfig)
    } else {
      config.on('load', () => {
        loadConfig()
      })
      config.on('error', (e) => {
        this.emit('error', e)
      })
    }
  }

  replace (config) {
    this._loaded = false
    const reloadConfig = () => {
      const configData = config.toJS()
      this._loaded = true
      this.emit('validate', configData)
      this._config = fromJS(configData)
      this.emit('reload')
    }

    if (config.isLoaded) {
      setImmediate(reloadConfig)
    } else {
      config.on('reload', () => {
        reloadConfig()
      })
      config.on('error', (e) => {
        this.emit('error', e)
      })
    }
  }

  merge (configs, rules) {
    const config = new MergedConfig([this, ...configs], rules)
    this.replace(config)
  }
}

module.exports = Settings
