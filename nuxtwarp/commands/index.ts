import type { Command } from 'commander'
import { moduleCommand } from './module/index.js'
import { crudCommand } from './crud/index.js'
import { doctorCommand } from './doctor/index.js'

export function registerCommands(program: Command): void {
  program.addCommand(moduleCommand)
  program.addCommand(crudCommand)
  program.addCommand(doctorCommand)
}
