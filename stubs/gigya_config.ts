import type { GigyaConfig } from '../types/index.js'

const gigyaConfig: GigyaConfig = {
  /*
  |--------------------------------------------------------------------------
  | Gigya API Key
  |--------------------------------------------------------------------------
  |
  | The API key for your Gigya application. You can find this in the Gigya
  | console under Site > Site Dashboard.
  |
  */
  apiKey: process.env.GIGYA_API_KEY || '',

  /*
  |--------------------------------------------------------------------------
  | Gigya Secret Key
  |--------------------------------------------------------------------------
  |
  | The secret key for your Gigya application. You can find this in the Gigya
  | console under Site > Site Dashboard.
  |
  */
  secret: process.env.GIGYA_SECRET_KEY || '',

  /*
  |--------------------------------------------------------------------------
  | Gigya Data Center
  |--------------------------------------------------------------------------
  |
  | The data center where your Gigya site is hosted. Common values are:
  | us1, eu1, au1, ru1, cn1
  |
  */
  dataCenter:
    (process.env.GIGYA_DATA_CENTER as 'us1' | 'eu1' | 'au1' | 'ru1' | 'cn1' | 'il1') || 'us1',

  /*
  |--------------------------------------------------------------------------
  | HTTP Timeout
  |--------------------------------------------------------------------------
  |
  | The timeout for HTTP requests to Gigya API in milliseconds.
  |
  */
  timeout: Number.parseInt(process.env.GIGYA_TIMEOUT || '10000'),

  /*
  |--------------------------------------------------------------------------
  | Debug Mode
  |--------------------------------------------------------------------------
  |
  | Enable debug mode to log all requests and responses to the console.
  |
  */
  debug: process.env.GIGYA_DEBUG === 'true',
}

export default gigyaConfig
