#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'pathe'
import { registerCommands } from '../commands/index.js'
import { loadConfig } from '../lib/config/loader.js'

// Check for config file
const configPath = resolve(process.cwd(), 'omninuxt.cfg')
if (!existsSync(configPath)) {
  console.error(chalk.red('❌ Error: Missing omninuxt.cfg file!'))
  console.error(chalk.yellow('Please create an omninuxt.cfg file with the required configuration.'))
  console.error(chalk.gray('You can copy from omninuxt.cfg.example'))
  process.exit(1)
}

// Load configuration
const config = loadConfig()

if (!config.API_BASE_URL) {
  console.error(chalk.red('❌ Error: API_BASE_URL is missing in omninuxt.cfg!'))
  console.error(chalk.yellow('Please add API_BASE_URL=<your_api_url> to your omninuxt.cfg file.'))
  process.exit(1)
}

const program = new Command()

program
  .name('nuxtwarp')
  .description(chalk.cyan('🚀 NuxtWarp - Code Generator for Nuxt 3 with TypeScript'))
  .version('1.0.0')

// Help command
program
  .command('help')
  .description('Display general help')
  .action(() => {
    console.log(`
${chalk.cyan.bold('🚀 NuxtWarp Code Generator 1.0.0')}
${chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

${chalk.bold('USAGE:')}
  ${chalk.green('nuxtwarp')} ${chalk.yellow('<command>')} ${chalk.gray('[options]')}

${chalk.bold('AVAILABLE COMMANDS:')}
  ${chalk.green('module:create')}    Generate a complete module with CRUD
  ${chalk.green('crud:create')}      Generate CRUD for a specific entity
  ${chalk.green('form:create')}      Generate a form component
  ${chalk.green('doctor:check')}     Diagnose CLI and project setup
  ${chalk.green('help')}             Display this help message

${chalk.bold('EXAMPLES:')}
  ${chalk.gray('# Generate complete module')}
  ${chalk.green('nuxtwarp module:create --name=scheduler')}
  
  ${chalk.gray('# Generate CRUD for specific entity')}
  ${chalk.green('nuxtwarp crud:create --module=scheduler --entity=appointments')}
  
  ${chalk.gray('# Check system health')}
  ${chalk.green('nuxtwarp doctor:check')}

${chalk.bold('OPTIONS:')}
  ${chalk.yellow('-h, --help')}      Display help for command
  ${chalk.yellow('-V, --version')}   Display version number
  ${chalk.yellow('--dry-run')}       Show what would be generated without creating files
  ${chalk.yellow('--interactive')}   Interactive mode with prompts

${chalk.gray('For more information on a specific command:')}
  ${chalk.green('nuxtwarp <command> --help')}
    `)
  })

// Register all commands
registerCommands(program)

// Parse arguments
program.parse(process.argv)

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
