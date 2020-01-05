const { Map } = require('immutable')
const matchers = require('jest-immutable-matchers')
const StaticConfig = require('../lib/StaticConfig')

beforeEach(() => {
  jest.addMatchers(matchers)
})

test('load static config', async (done) => {
  const config = new StaticConfig({ config: { foo: { bar: true } } })
  config.on('load', () => {
    expect(config.get('foo')).toEqualImmutable(Map({ bar: true }))
    done()
  })
})
