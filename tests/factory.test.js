const factory = require('../lib/factory')

test('config factory', async (done) => {
  const config = factory([
    {
      type: 'StaticConfig',
      config: { bar: { two: 2 } }
    },
    {
      type: 'FileJsonConfig',
      dir: __dirname,
      base: 'config.json'
    }
  ])

  config.on('load', () => {
    expect(config.toJS()).toEqual({ foo: { bar: 1 }, bar: { two: 2 } })
    done()
  })
})
