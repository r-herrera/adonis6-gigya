import type { GigyaConfig } from '../types/index.js'

export default class GigyaProvider {
  constructor(protected app: any) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('gigya', async () => {
      const gigyaConfig = this.app.config.get('gigya') as GigyaConfig
      const gigyaModule = await import('../services/gigya.js')
      const GigyaService = gigyaModule.GigyaService

      return new GigyaService(gigyaConfig)
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
