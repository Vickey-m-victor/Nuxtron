import { Command } from 'commander'
import chalk from 'chalk'
import { loadConfig } from '../../lib/config/loader.js'

export const doctorCommand = new Command('doctor')
  .description('Diagnostic commands')
  .action(() => {
    console.log(`
${chalk.green.bold('nuxtwarp doctor')}
${chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

${chalk.bold('USAGE:')}
  ${chalk.green('nuxtwarp doctor:check')}

${chalk.bold('DESCRIPTION:')}
  Check CLI configuration and project setup
    `)
  })

doctorCommand
  .command('check')
  .alias('doctor:check')
  .description('Run diagnostic checks')
  .action(async () => {
    console.log(chalk.cyan.bold('\n🔍 Running diagnostics...\n'))

    const checks = []

    // Check 1: Config file
    try {
      const config = loadConfig()
      checks.push({
        name: 'Configuration file',
        status: 'pass',
        message: 'omninuxt.cfg found and loaded'
      })

      // Check 2: API URL
      if (config.API_BASE_URL) {
        checks.push({
          name: 'API Base URL',
          status: 'pass',
          message: config.API_BASE_URL
        })

        // Check 3: API connectivity
        try {
          const response = await fetch(`${config.API_BASE_URL}/v1`)
          if (response.ok) {
            checks.push({
              name: 'API Connection',
              status: 'pass',
              message: 'API is reachable'
            })
          } else {
            checks.push({
              name: 'API Connection',
              status: 'warn',
              message: `API returned status ${response.status}`
            })
          }
        } catch (error) {
          checks.push({
            name: 'API Connection',
            status: 'fail',
            message: 'Cannot connect to API'
          })
        }
      } else {
        checks.push({
          name: 'API Base URL',
          status: 'fail',
          message: 'API_BASE_URL not configured'
        })
      }

    } catch (error) {
      checks.push({
        name: 'Configuration file',
        status: 'fail',
        message: 'omninuxt.cfg not found or invalid'
      })
    }

    // Print results
    console.log(chalk.bold('Diagnostic Results:\n'))
    checks.forEach(check => {
      const icon = check.status === 'pass' 
        ? chalk.green('✓') 
        : check.status === 'warn'
        ? chalk.yellow('⚠')
        : chalk.red('✗')
      
      const status = check.status === 'pass'
        ? chalk.green(check.status.toUpperCase())
        : check.status === 'warn'
        ? chalk.yellow(check.status.toUpperCase())
        : chalk.red(check.status.toUpperCase())

      console.log(`${icon} ${chalk.bold(check.name)}: ${status}`)
      console.log(`  ${chalk.gray(check.message)}\n`)
    })

    const passCount = checks.filter(c => c.status === 'pass').length
    const total = checks.length

    if (passCount === total) {
      console.log(chalk.green.bold(`\n✓ All checks passed (${passCount}/${total})\n`))
    } else {
      console.log(chalk.yellow.bold(`\n⚠ ${passCount}/${total} checks passed\n`))
    }
  })
