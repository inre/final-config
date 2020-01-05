const fs = require('fs')
const path = require('path')
const { fromJS } = require('immutable')
const BaseConfig = require('./BaseConfig')

const parse = (data) => ({ data })

class FileBaseConfig extends BaseConfig {
  constructor (file, parseFn = parse) {
    super()
    if (typeof file === 'object') {
      const { root, dir, base, ext, name } = file
      this._path = path.format({ root, dir, base, ext, name })
    } else {
      this._path = path.parse(file)
    }

    fs.readFile(this._path, 'utf8', (error, data) => {
      this._loaded = true
      if (error) {
        this.emit('error', new Error(error))
      } else {
        try {
          const config = parseFn(data)
          this.emit('validate', config)
          this._config = fromJS(config)
          this.emit('load')
        } catch (e) {
          this.emit('error', e)
        }
      }
    })
  }
}

module.exports = FileBaseConfig
