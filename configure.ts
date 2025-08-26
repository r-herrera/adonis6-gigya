import type { GigyaConfig } from './types/index.js'

/**
 * Configure function to setup Gigya provider in an AdonisJS application
 */
export function configure(config: GigyaConfig) {
  return {
    async register(app: any) {
      // Register the config
      app.config.set('gigya', config)

      // Register the provider
      const { default: GigyaProvider } = await import('./providers/gigya_provider.js')
      app.container.withBindings(['gigya'], () => {
        return new GigyaProvider(app)
      })
    },
  }
}
