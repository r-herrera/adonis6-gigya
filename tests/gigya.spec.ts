import { test } from '@japa/runner'
import { Gigya } from '../services/gigya.js'

test.group('Gigya Service', () => {
  test('should create instance with config', ({ assert }) => {
    const gigya = new Gigya({
      apiKey: 'test-api-key',
      secret: 'test-secret',
      dataCenter: 'us1',
    })

    assert.isTrue(gigya instanceof Gigya)
  })

  test('should validate signature correctly', ({ assert }) => {
    const gigya = new Gigya({
      apiKey: 'test-api-key',
      secret: 'dGVzdC1zZWNyZXQ=', // base64 encoded 'test-secret'
      dataCenter: 'us1',
    })

    const timestamp = '1234567890'
    const uid = 'test-uid'

    const signature = gigya.getSignature(timestamp, uid)
    const isValid = gigya.validateSignature(timestamp, uid, signature)

    assert.isTrue(isValid)
  })

  test('should validate invalid signature as false', ({ assert }) => {
    const gigya = new Gigya({
      apiKey: 'test-api-key',
      secret: 'dGVzdC1zZWNyZXQ=',
      dataCenter: 'us1',
    })

    const timestamp = '1234567890'
    const uid = 'test-uid'
    const invalidSignature = 'invalid-signature'

    const isValid = gigya.validateSignature(timestamp, uid, invalidSignature)

    assert.isFalse(isValid)
  })
})
