# AdonisJS v6 Gigya Integration

An AdonisJS v6 package that provides seamless integration with Gigya (SAP Customer Data Cloud) using the [@cambridge-pte/gigya](https://www.npmjs.com/package/@cambridge-pte/gigya) SDK.

[![npm version](https://badge.fury.io/js/adonis6-gigya.svg)](https://badge.fury.io/js/adonis6-gigya)
[![Build Status](https://github.com/your-org/adonis6-gigya/workflows/test/badge.svg)](https://github.com/your-org/adonis6-gigya/actions)
[![Coverage Status](https://coveralls.io/repos/github/your-org/adonis6-gigya/badge.svg?branch=main)](https://coveralls.io/github/your-org/adonis6-gigya?branch=main)

## Features

- 🚀 **AdonisJS v6 Compatible**: Built specifically for AdonisJS v6 with ESM support
- 🔐 **Multiple Authentication Methods**: Support for RSA, UserKey, and SecretKey authentication
- 📦 **Full Gigya SDK Access**: Access to all Gigya APIs through the underlying SDK
- 🛡️ **Type Safety**: Comprehensive TypeScript support with proper type definitions
- 🔧 **Easy Configuration**: Simple configuration through environment variables or config files
- 📝 **Signature Utilities**: Built-in signature generation and validation for webhooks
- 🧪 **Well Tested**: Comprehensive test suite with good coverage

## Installation

Install the package using npm, yarn, or pnpm:

```bash
npm install adonis6-gigya @cambridge-pte/gigya
# or
yarn add adonis6-gigya @cambridge-pte/gigya
# or
pnpm add adonis6-gigya @cambridge-pte/gigya
```

## Setup

### 1. Configure the Package

Add the provider to your `adonisrc.ts` file:

```typescript
{
  providers: [
    // ... other providers
    () => import('adonis6-gigya/providers/gigya_provider'),
  ]
}
```

### 2. Create Configuration File

Run the configure command to create the configuration file:

```bash
node ace configure adonis6-gigya
```

This will create a `config/gigya.ts` file with the following structure:

```typescript
import { defineConfig } from 'adonis6-gigya'

export default defineConfig({
  apiKey: process.env.GIGYA_API_KEY!,
  secret: process.env.GIGYA_SECRET,
  dataCenter: (process.env.GIGYA_DATA_CENTER as 'us1' | 'eu1' | 'au1' | 'ru1' | 'cn1' | 'il1') || 'us1',
  debug: process.env.NODE_ENV === 'development',
})
```

### 3. Set Environment Variables

Add the following variables to your `.env` file:

```env
GIGYA_API_KEY=your_api_key_here
GIGYA_SECRET=your_secret_key_here
GIGYA_DATA_CENTER=us1
```

## Authentication Methods

The package supports multiple authentication methods:

### 1. Secret Key Authentication (Most Common)

```typescript
export default defineConfig({
  apiKey: 'your_api_key',
  secret: 'your_secret_key', // or secretKey
  dataCenter: 'us1',
})
```

### 2. User Key Authentication

```typescript
export default defineConfig({
  apiKey: 'your_api_key',
  userKey: 'your_user_key',
  secret: 'your_secret_key',
  dataCenter: 'us1',
})
```

### 3. RSA Authentication

```typescript
export default defineConfig({
  apiKey: 'your_api_key',
  rsa: {
    privateKey: 'your_private_key',
    // ... other RSA options
  },
  dataCenter: 'us1',
})
```

## Usage

### Basic Usage in Controllers

```typescript
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { GigyaService } from 'adonis6-gigya/types'

@inject()
export default class AuthController {
  constructor(private gigya: GigyaService) {}

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const result = await this.gigya.accounts.login({
        loginID: email,
        password: password,
        include: 'profile,data',
      })

      if (result.errorCode === 0) {
        return response.ok({
          success: true,
          user: result.data,
          message: 'Login successful',
        })
      }

      return response.unauthorized({
        success: false,
        message: result.statusReason || 'Invalid credentials',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Login failed due to server error',
      })
    }
  }

  async register({ request, response }: HttpContext) {
    const { email, password, profile } = request.only(['email', 'password', 'profile'])

    try {
      const result = await this.gigya.accounts.register({
        email,
        password,
        profile: profile || {},
      })

      if (result.errorCode === 0) {
        return response.created({
          success: true,
          user: result.data,
          message: 'Registration successful',
        })
      }

      return response.badRequest({
        success: false,
        message: result.statusReason || 'Registration failed',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Registration failed due to server error',
      })
    }
  }
}
```

### Using Container Resolution

You can also resolve the service from the container:

```typescript
export default class UserController {
  async getAccount({ params, response, app }: HttpContext) {
    const gigya = await app.container.make('gigya')
    const { uid } = params

    try {
      const result = await gigya.accounts.getAccountInfo({
        UID: uid,
        include: 'profile,data',
      })

      if (result.errorCode === 0) {
        return response.ok({
          success: true,
          user: result.data,
        })
      }

      return response.notFound({
        success: false,
        message: result.statusReason || 'Account not found',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch account information',
      })
    }
  }
}
```

## API Reference

The `GigyaService` provides access to all Gigya APIs through the following properties:

### Core APIs

- `gigya.accounts` - User account management
- `gigya.socialize` - Social login functionality
- `gigya.ds` - Data Store operations
- `gigya.gm` - Game Mechanics
- `gigya.reports` - Analytics and reporting
- `gigya.admin` - Administrative operations
- `gigya.fidm` - Federated Identity Management
- `gigya.idx` - Identity Experience

### Utility Methods

- `gigya.getClient()` - Get the underlying Gigya SDK client
- `gigya.sigUtils` - Access to signature utilities
- `gigya.getSignature(timestamp, uid)` - Generate signature for webhooks
- `gigya.validateSignature(timestamp, uid, signature)` - Validate webhook signatures

### Example API Usage

```typescript
// User registration
const registerResult = await gigya.accounts.register({
  email: 'user@example.com',
  password: 'securePassword123',
  profile: {
    firstName: 'John',
    lastName: 'Doe',
  },
})

// User login
const loginResult = await gigya.accounts.login({
  loginID: 'user@example.com',
  password: 'securePassword123',
  include: 'profile,data',
})

// Get account information
const accountInfo = await gigya.accounts.getAccountInfo({
  UID: 'user_uid_here',
  include: 'profile,data,subscriptions',
})

// Search accounts
const searchResults = await gigya.accounts.search({
  query: 'SELECT * FROM accounts WHERE profile.email CONTAINS "@example.com"',
  limit: 10,
})

// Social login
const socialLogin = await gigya.socialize.getUserInfo({
  provider: 'facebook',
  // ... other parameters
})

// Data Store operations
const dataStore = await gigya.ds.store({
  UID: 'user_uid_here',
  type: 'preferences',
  data: {
    theme: 'dark',
    language: 'en',
  },
})
```

## Webhook Signature Validation

For webhook endpoints, you can validate signatures:

```typescript
export default class WebhookController {
  async handleGigyaWebhook({ request, response, app }: HttpContext) {
    const gigya = await app.container.make('gigya')
    const { timestamp, uid, sig } = request.qs()
    
    // Validate the signature
    const isValid = gigya.validateSignature(timestamp, uid, sig)
    
    if (!isValid) {
      return response.unauthorized({
        success: false,
        message: 'Invalid signature',
      })
    }
    
    // Process the webhook
    // ...
    
    return response.ok({ success: true })
  }
}
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiKey` | string | ✅ | Your Gigya API key |
| `dataCenter` | string | ✅ | Gigya data center (us1, eu1, au1, ru1, cn1, il1) |
| `secret` | string | ❓ | Secret key for authentication |
| `secretKey` | string | ❓ | Alternative name for secret |
| `userKey` | string | ❓ | User key for user-level authentication |
| `rsa` | object | ❓ | RSA configuration object |
| `debug` | boolean | ❓ | Enable debug logging |

## Migration from AdonisJS v5

If you're migrating from the AdonisJS v5 version:

1. Update your `adonisrc.ts` to use the new provider format
2. Update your import statements to use the new package structure
3. Update API calls to use the new structured approach (e.g., `gigya.accounts.login()` instead of `gigya.login()`)
4. Update dependency injection to use the new AdonisJS v6 pattern

## Development

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/your-org/adonis6-gigya.git
cd adonis6-gigya

# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Lint and format
npm run lint
npm run format
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run coverage
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://docs.gigya.com/)
- 🐛 [Bug Reports](https://github.com/your-org/adonis6-gigya/issues)
- 💬 [Discussions](https://github.com/your-org/adonis6-gigya/discussions)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.
