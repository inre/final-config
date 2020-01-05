const BaseConfig = require('../lib/BaseConfig')

test('load BaseConfig', async (done) => {
  const config = new BaseConfig()
  config.on('error', (e) => {
    expect(e).toBeInstanceOf(Error)
    done()
  })
})
