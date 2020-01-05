const { EventEmitter } = require('events')
const { Map } = require('immutable')
const invariant = require('invariant')
const messages = require('./messages.json')
const { inspect } = require('util')

class BaseConfig extends EventEmitter {
  constructor (source) {
    super()
    this._source = source
    this._loaded = false

    if (this.constructor.name === 'BaseConfig') {
      this._config = Map()

      setImmediate(() => {
        this._loaded = true
        this.emit('error', new Error(messages.USING_BASE_CONFIG_ERROR))
      })
    }
  }

  get (key, notSetValue) {
    invariant(this._loaded, messages.ASSERT_LOAD)
    if (typeof notSetValue === 'undefined') {
      invariant(this._config.has(key), messages.MISSING_SECTION, key)
    }
    return this._config.get(key, notSetValue)
  }

  getIn (searchKeyPath, notSetValue) {
    invariant(this._loaded, messages.ASSERT_LOAD)
    if (typeof notSetValue === 'undefined') {
      invariant(this._config.has(searchKeyPath[0]), messages.MISSING_SECTION, searchKeyPath)
    }
    return this._config.getIn(searchKeyPath, notSetValue)
  }

  has (key) {
    invariant(this._loaded, messages.ASSERT_LOAD)
    return this._config.has(key)
  }

  hasIn (key) {
    invariant(this._loaded, messages.ASSERT_LOAD)
    return this._config.hasIn(key)
  }

  get isLoaded () {
    return this._loaded
  }

  onLoad () {
    return new Promise((resolve, reject) => {
      if (this._loaded) {
        resolve(this)
      }
      this.on('load', () => {
        resolve(this)
      })
      this.on('error', err => {
        reject(err)
      })
    })
  }

  toJS () {
    invariant(this._loaded, messages.ASSERT_LOAD)
    return this._config.toJS()
  }

  [inspect.custom] (depth, options = undefined) {
    if (depth < 0) {
      return '[Config]'
    }
    const object = (this._loaded)
      ? this.toJS()
      : { isLoaded: false }

    const config = inspect(object, options)
    return `${this.constructor.name} < ${config} >`
  }
}

module.exports = BaseConfig
