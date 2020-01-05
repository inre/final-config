const factory = require('./factory')
const Settings = require('./Settings')

const Global = new Settings()

Global.factory = function (sources, configSources = CONFIG_SOURCES) {
  Global.replace(factory(sources, configSources))
}

module.exports = Global
