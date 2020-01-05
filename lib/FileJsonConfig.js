const FileBaseConfig = require('./FileBaseConfig')

class FileJsonConfig extends FileBaseConfig {
  constructor (path) {
    super(path, JSON.parse)
  }
}

module.exports = FileJsonConfig
