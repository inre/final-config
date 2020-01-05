const { Map } = require('immutable')
const matchers = require('jest-immutable-matchers')
const FileJsonConfig = require('../lib/FileJsonConfig')

beforeEach(() => {
  jest.addMatchers(matchers)
})

test('load json config', async (done) => {
  const config = new FileJsonConfig({ dir: __dirname, base: 'config.json' })
  config.on('load', () => {
    expect(config.get('foo')).toEqualImmutable(Map({ bar: 1 }))
    done()
  })
})
