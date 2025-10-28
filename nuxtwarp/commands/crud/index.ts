import { Command } from 'commander'
import chalk from 'chalk'

export const crudCommand = new Command('crud')
  .description('CRUD generation commands')
  .action(() => {
    console.log(`
${chalk.green.bold('nuxtwarp crud')}
${chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

${chalk.bold('USAGE:')}
  ${chalk.green('nuxtwarp crud:create --module=<module> --entity=<entity>')}

${chalk.bold('OPTIONS:')}
  ${chalk.yellow('--module <name>')}    Module name (required)
  ${chalk.yellow('--entity <name>')}    Entity name (required, PascalCase)
  ${chalk.yellow('--dry-run')}          Show what would be generated

${chalk.bold('EXAMPLES:')}
  ${chalk.gray('# Generate CRUD for appointments')}
  ${chalk.green('nuxtwarp crud:create --module=scheduler --entity=Appointment')}
    `)
  })

crudCommand
  .command('create')
  .alias('crud:create')
  .description('Generate CRUD operations for an entity')
  .requiredOption('--module <name>', 'Module name')
  .requiredOption('--entity <name>', 'Entity name (PascalCase)')
  .option('--dry-run', 'Preview without creating files')
  .action(async (options) => {
    console.log(chalk.yellow('CRUD generation coming soon...'))
    console.log('Options:', options)
  })
