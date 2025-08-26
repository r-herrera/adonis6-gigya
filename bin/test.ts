#!/usr/bin/env node

import { configure, run } from '@japa/runner'
import { assert } from '@japa/assert'

configure({
  files: ['build/tests/**/*.spec.js'],
  plugins: [assert()],
})

run()
