import { pathToFileURL } from 'node:url'

/**
 * Register the ts-node/esm loader to process TypeScript files
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.js') && !specifier.includes('node_modules')) {
    const tsSpecifier = specifier.replace(/\.js$/, '.ts')
    return nextResolve(tsSpecifier, context)
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.ts')) {
    const { transformSync } = await import('@swc/core')
    const { readFileSync } = await import('node:fs')

    const code = readFileSync(new URL(url), 'utf8')
    const result = transformSync(code, {
      filename: url,
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        target: 'es2022',
        transform: {
          decoratorMetadata: true,
        },
      },
      module: {
        type: 'es6',
      },
    })

    return {
      format: 'module',
      source: result.code,
      shortCircuit: true,
    }
  }

  return nextLoad(url, context)
}
