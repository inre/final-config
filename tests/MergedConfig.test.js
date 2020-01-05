const StaticConfig = require('../lib/StaticConfig')
const MergedConfig = require('../lib/MergedConfig')
const { MergeRules } = require('../lib/constants')

test('load merged config (override)', async (done) => {
  const config1 = new StaticConfig({ config: { foo: { bar: 1 } } })
  const config2 = new StaticConfig({ config: { foo: { two: 2 } } })

  const config = new MergedConfig([config1, config2])
  config.on('load', () => {
    expect(config.toJS()).toEqual({ foo: { two: 2 } })
    done()
  })
})

test('load merged config (level)', async (done) => {
  const config1 = new StaticConfig({ config: { foo: { bar: 1 } } })
  const config2 = new StaticConfig({ config: { foo: { two: 2 } } })

  const config = new MergedConfig([config1, config2], MergeRules.LEVEL)
  config.on('load', () => {
    expect(config.toJS()).toEqual({ foo: { bar: 1, two: 2 } })
    done()
  })
})

test('load merged config (deep)', async (done) => {
  const config1 = new StaticConfig({ config: { foo: { bar: { two: 2 } } } })
  const config2 = new StaticConfig({ config: { foo: { bar: { three: 3 } } } })

  const config = new MergedConfig([config1, config2], MergeRules.DEEP)
  config.on('load', () => {
    expect(config.toJS()).toEqual({ foo: { bar: { two: 2, three: 3 } } })
    done()
  })
})
