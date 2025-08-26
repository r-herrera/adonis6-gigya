import { Gigya } from '@cambridge-pte/gigya'
import type { GigyaConfig } from '../types/index.js'

export class GigyaService {
  private gigyaClient: Gigya
  private secret?: string

  constructor(config: GigyaConfig) {
    // Store the secret for signature operations
    this.secret = config.secretKey || config.secret

    // Initialize the Gigya client based on available authentication method
    if (config.rsa) {
      this.gigyaClient = new Gigya(config.apiKey, config.dataCenter, config.rsa)
    } else if (config.userKey && (config.secretKey || config.secret)) {
      this.gigyaClient = new Gigya(
        config.apiKey,
        config.dataCenter,
        config.userKey,
        config.secretKey || config.secret
      )
    } else if (config.secretKey || config.secret) {
      this.gigyaClient = new Gigya(
        config.apiKey,
        config.dataCenter,
        config.secretKey || config.secret!
      )
    } else {
      throw new Error(
        'Gigya configuration requires either secret, secretKey, userKey+secret, or rsa credentials'
      )
    }

    if (config.debug) {
      console.log('Gigya client initialized with config:', {
        apiKey: config.apiKey ? '***' : 'missing',
        dataCenter: config.dataCenter,
        authMethod: config.rsa ? 'RSA' : config.userKey ? 'UserKey' : 'SecretKey',
      })
    }
  }

  /**
   * Get the underlying Gigya client for full API access
   */
  getClient(): Gigya {
    return this.gigyaClient
  }

  /**
   * Accounts API methods
   */
  get accounts() {
    return this.gigyaClient.accounts
  }

  /**
   * Socialize API methods
   */
  get socialize() {
    return this.gigyaClient.socialize
  }

  /**
   * DS (Data Store) API methods
   */
  get ds() {
    return this.gigyaClient.ds
  }

  /**
   * GM (Game Mechanics) API methods
   */
  get gm() {
    return this.gigyaClient.gm
  }

  /**
   * Reports API methods
   */
  get reports() {
    return this.gigyaClient.reports
  }

  /**
   * Admin API methods
   */
  get admin() {
    return this.gigyaClient.admin
  }

  /**
   * FIDM (Federated Identity Management) API methods
   */
  get fidm() {
    return this.gigyaClient.fidm
  }

  /**
   * IDX (Identity Experience) API methods
   */
  get idx() {
    return this.gigyaClient.idx
  }

  /**
   * SigUtils for signature validation
   */
  get sigUtils() {
    return this.gigyaClient.sigUtils
  }

  /**
   * Generate signature (convenience method)
   */
  getSignature(timestamp: string, uid: string): string {
    const baseString = timestamp + '_' + uid
    return this.gigyaClient.sigUtils.calcSignature(baseString, this.secret)
  }

  /**
   * Validate signature (convenience method)
   */
  validateSignature(timestamp: string, uid: string, signature: string): boolean {
    return this.gigyaClient.sigUtils.validateUserSignature(
      uid,
      Number.parseInt(timestamp),
      signature,
      this.secret
    )
  }
}

export { GigyaService as Gigya }
