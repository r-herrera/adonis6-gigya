export interface GigyaConfig {
  /**
   * Gigya API key
   */
  apiKey: string

  /**
   * Gigya data center (e.g., 'us1', 'eu1', 'au1', 'ru1', 'cn1')
   */
  dataCenter: 'us1' | 'eu1' | 'au1' | 'ru1' | 'cn1' | 'il1'

  /**
   * Gigya secret key (for secret-based authentication)
   */
  secret?: string

  /**
   * Legacy secretKey property (for backward compatibility)
   */
  secretKey?: string

  /**
   * User key (for user-based authentication)
   */
  userKey?: string

  /**
   * RSA configuration (for RSA-based authentication)
   */
  rsa?: {
    userKey: string
    privateKey: string
  }

  /**
   * HTTP timeout in milliseconds
   * @default 10000
   */
  timeout?: number

  /**
   * Enable debug mode
   * @default false
   */
  debug?: boolean
}

export interface GigyaResponse<T = any> {
  statusCode: number
  errorCode: number
  statusReason: string
  callId: string
  time: string
  data?: T
  [key: string]: any
}

export interface GigyaUser {
  UID?: string
  profile?: {
    firstName?: string
    lastName?: string
    email?: string
    [key: string]: any
  }
  data?: {
    [key: string]: any
  }
  [key: string]: any
}

export interface GigyaLoginParams {
  loginID: string
  password: string
  include?: string
  extraProfileFields?: string
  sessionExpiration?: number
  targetEnv?: string
}

export interface GigyaAccountParams {
  UID: string
  include?: string
  extraProfileFields?: string
}

export interface GigyaSearchParams {
  query: string
  openCursor?: boolean
  cursorId?: string
  timeout?: number
}
