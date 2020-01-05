const { Map } = require('immutable')
const matchers = require('jest-immutable-matchers')
const FileYamlConfig = require('../lib/FileYamlConfig')

beforeEach(() => {
  jest.addMatchers(matchers)
})

test('load yaml config', async (done) => {
  const config = new FileYamlConfig({ dir: __dirname, base: 'config.yml' })
  config.on('load', () => {
    expect(config.get('foo')).toEqualImmutable(Map({ bar: 1 }))
    done()
  })
})
