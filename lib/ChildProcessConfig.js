const invariant = require('invariant')
const messages = require('./messages.json')
const { fromJS } = require('immutable')
const BaseConfig = require('./BaseConfig')

const defaultMessageParser = message => {
  if (typeof message === 'object' && message.type === 'CONFIG') {
    return message.payload
  }
}

class ChildProcessConfig extends BaseConfig {
  constructor (parseMessage = defaultMessageParser) {
    super()
    invariant(process.send, messages.NOT_IN_CHILD_PROCESS)

    const subscriber = message => {
      try {
        const config = parseMessage(message)
        if (config === undefined) return
        this._loaded = true
        process.off('message', subscriber)
        this.emit('validate', config)
        this._config = fromJS(config)
        this.emit('load')
      } catch (e) {
        this.emit('error', e)
      }
    }

    process.on('message', subscriber)
    process.send({ type: 'CONNECT' })
  }
}

module.exports = ChildProcessConfig
