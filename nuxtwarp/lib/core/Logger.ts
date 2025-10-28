import chalk from 'chalk'

export type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug'

export class Logger {
  constructor(private verbose: boolean = false) {}

  info(message: string, ...args: any[]): void {
    console.log(chalk.blue('ℹ'), message, ...args)
  }

  success(message: string, ...args: any[]): void {
    console.log(chalk.green('✓'), message, ...args)
  }

  warn(message: string, ...args: any[]): void {
    console.log(chalk.yellow('⚠'), message, ...args)
  }

  error(message: string, ...args: any[]): void {
    console.log(chalk.red('✗'), message, ...args)
  }

  debug(message: string, ...args: any[]): void {
    if (this.verbose) {
      console.log(chalk.gray('DEBUG:'), message, ...args)
    }
  }

  step(step: number, total: number, message: string): void {
    console.log(chalk.cyan(`[${step}/${total}]`), message)
  }

  section(title: string): void {
    console.log('\n' + chalk.bold.underline(title))
  }

  list(items: string[]): void {
    items.forEach(item => console.log(chalk.gray('  •'), item))
  }

  table(data: Record<string, string>): void {
    const maxKeyLength = Math.max(...Object.keys(data).map(k => k.length))
    Object.entries(data).forEach(([key, value]) => {
      console.log(
        chalk.gray(key.padEnd(maxKeyLength + 2)),
        chalk.white(value)
      )
    })
  }
}
