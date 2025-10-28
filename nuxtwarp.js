#!/usr/bin/env node

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Run the actual CLI from the nuxtwarp directory
spawn('node', [join(__dirname, 'nuxtwarp/bin/nuxtwarp.ts'), ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
})
