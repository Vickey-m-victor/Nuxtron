import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import { loadConfig } from '../../lib/config/loader.js'
import { Logger } from '../../lib/core/Logger.js'
import { Validator } from '../../lib/core/Validator.js'
import { FileSystem } from '../../lib/core/FileSystem.js'
import { ModuleGenerator } from '../../lib/generators/module/ModuleGenerator.js'

export const moduleCommand = new Command('module')
  .description('Module generation commands')
  .action(() => {
    console.log(`
${chalk.green.bold('nuxtwarp module')}
${chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

${chalk.bold('USAGE:')}
  ${chalk.green('nuxtwarp module:create --name=<moduleName>')}

${chalk.bold('OPTIONS:')}
  ${chalk.yellow('--name <name>')}       Module name (required, lowercase)
  ${chalk.yellow('--dry-run')}           Show what would be generated
  ${chalk.yellow('--force')}             Overwrite existing files
  ${chalk.yellow('--interactive')}       Interactive mode with prompts

${chalk.bold('EXAMPLES:')}
  ${chalk.gray('# Generate complete module')}
  ${chalk.green('nuxtwarp module:create --name=scheduler')}
  
  ${chalk.gray('# Dry run to preview')}
  ${chalk.green('nuxtwarp module:create --name=scheduler --dry-run')}
    `)
  })

moduleCommand
  .command('create')
  .alias('module:create')
  .description('Create a new module with CRUD operations')
  .requiredOption('--name <name>', 'Module name (lowercase, alphanumeric)')
  .option('--dry-run', 'Preview generation without creating files')
  .option('--force', 'Overwrite existing files')
  .option('--interactive', 'Interactive mode with prompts')
  .option('--verbose', 'Show detailed logs')
  .action(async (options) => {
    const { name, dryRun, force, interactive, verbose } = options

    const logger = new Logger(verbose)
    const validator = new Validator()
    const config = loadConfig()

    logger.section('Module Generator')
    logger.table({
      'Module Name': name,
      'Mode': dryRun ? 'Dry Run' : 'Generate',
      'Force Overwrite': force ? 'Yes' : 'No'
    })

    // Validate module name
    validator
      .required('name', name)
      .moduleName('name', name)

    const validationResult = validator.getResult()
    
    if (!validationResult.valid) {
      logger.error('Validation failed:')
      validationResult.errors.forEach(err => logger.error(`  - ${err.message}`))
      process.exit(1)
    }

    // Check if module already exists
    const fs = new FileSystem(logger, dryRun)
    const modulePath = `${config.MODULES_PATH}/${name}`
    
    if (fs.exists(modulePath) && !force) {
      if (interactive) {
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: `Module "${name}" already exists. Overwrite?`,
            default: false
          }
        ])
        
        if (!overwrite) {
          logger.warn('Module generation cancelled')
          return
        }
      } else {
        logger.error(`Module "${name}" already exists. Use --force to overwrite.`)
        process.exit(1)
      }
    }

    // Generate module
    const spinner = ora('Generating module...').start()

    try {
      const generator = new ModuleGenerator(config, logger, validator, {
        dryRun,
        force,
        verbose
      })

      await generator.generateModule(name)

      spinner.succeed(chalk.green(`Module "${name}" generated successfully!`))
      
      logger.section('Next Steps')
      logger.list([
        `cd modules/${name}`,
        'Review generated files',
        'Customize as needed',
        'Start your development server'
      ])

    } catch (error) {
      spinner.fail(chalk.red('Module generation failed'))
      
      if (error instanceof Error) {
        logger.error(error.message)
        if (verbose) {
          console.error(error.stack)
        }
      }
      
      process.exit(1)
    }
  })
