const merge = require('lodash/merge')
const { fromJS } = require('immutable')
const { MergeRules } = require('./constants')
const BaseConfig = require('./BaseConfig')

const mergeConfigs = (configs, rules) => {
  const configData = configs.map(config => config.toJS())
  switch (rules) {
    case MergeRules.OVERRIDE:
      return Object.assign({}, ...configData)
    case MergeRules.LEVEL:
      return configData.reduce((config, data) => {
        for (const prop in data) {
          config[prop] = Object.assign({}, config[prop], data[prop])
        }
        return config
      }, {})
    case MergeRules.DEEP:
      return merge({}, ...configData)
  }
}

const promisify = (emitter, event) =>
  new Promise(resolve => emitter.on(event, resolve))

class MergedConfig extends BaseConfig {
  constructor (configs, rules = MergeRules.OVERRIDE) {
    super()
    const notLoadedConfigs = configs.filter(config => !config.isLoaded)
    const promises = notLoadedConfigs.map(config => promisify(config, 'load'))

    const processConfigs = () => {
      this._loaded = true
      const config = mergeConfigs(configs, rules)
      this.emit('validate', config)
      this._config = fromJS(config)
      this.emit('load')
    }
    const catchErrors = err => {
      this._loaded = true
      this.emit('error', err)
    }

    if (promises.length !== 0) {
      Promise.all(promises).then(processConfigs)
      Promise.race(configs.map(config => promisify(config, 'error'))).then(catchErrors)
    } else {
      processConfigs()
    }
  }
}

module.exports = MergedConfig
