const invariant = require('invariant')
const messages = require('./messages.json')
const FileBaseConfig = require('./FileBaseConfig')

// Optional dependencies
try {
  var yaml = require('js-yaml')
} catch (e) {
  yaml = null
}

class FileYamlConfig extends FileBaseConfig {
  constructor (path) {
    invariant(yaml, messages.DEPENDENCY_YAML_REQUIRED)
    super(path, (data) => yaml.safeLoad(data, { json: true }))
  }
}

module.exports = FileYamlConfig
