const invariant = require('invariant')
const messages = require('./messages.json')
const FileBaseConfig = require('./FileBaseConfig')
const FileJsonConfig = require('./FileJsonConfig')
const FileYamlConfig = require('./FileYamlConfig')
const MergedConfig = require('./MergedConfig')
const StaticConfig = require('./StaticConfig')

const mapSources = (classes) => classes.map(ref => ({
  name: ref.name,
  ref
}))
const CONFIG_SOURCES = mapSources([
  StaticConfig, MergedConfig, FileBaseConfig, FileJsonConfig, FileYamlConfig
])

const findSource = (type, configSources) =>
  configSources.find((config) => config.name === type)

const createSource = (source, configSources) => {
  const config = findSource(source.type, configSources)
  invariant(config, messages.SOURCE_NOT_FOUND, source.type)
  const Class = config.ref
  return new Class(source)
}

function factory (sources, rules = undefined, configSources = CONFIG_SOURCES) {
  if (!Array.isArray(sources)) {
    return createSource(sources, configSources)
  }

  const mapConfigs = sources.map((source) => createSource(source, configSources))
  return new MergedConfig(mapConfigs, rules)
}

factory.CONFIG_SOURCES = CONFIG_SOURCES
module.exports = factory
