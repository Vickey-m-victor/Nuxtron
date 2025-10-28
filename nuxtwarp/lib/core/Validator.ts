export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface ValidationWarning {
  field: string
  message: string
}

export class Validator {
  private errors: ValidationError[] = []
  private warnings: ValidationWarning[] = []

  /**
   * Validate required field
   */
  required(field: string, value: any, message?: string): this {
    if (value === undefined || value === null || value === '') {
      this.errors.push({
        field,
        message: message || `${field} is required`,
        code: 'REQUIRED'
      })
    }
    return this
  }

  /**
   * Validate string format
   */
  matches(field: string, value: string, pattern: RegExp, message?: string): this {
    if (value && !pattern.test(value)) {
      this.errors.push({
        field,
        message: message || `${field} has invalid format`,
        code: 'INVALID_FORMAT'
      })
    }
    return this
  }

  /**
   * Validate module name (lowercase, alphanumeric, hyphens)
   */
  moduleName(field: string, value: string): this {
    return this.matches(
      field,
      value,
      /^[a-z][a-z0-9-]*$/,
      `${field} must be lowercase alphanumeric with hyphens only`
    )
  }

  /**
   * Validate entity name (PascalCase or lowercase)
   */
  entityName(field: string, value: string): this {
    return this.matches(
      field,
      value,
      /^[A-Z][a-zA-Z0-9]*$|^[a-z][a-z0-9_]*$/,
      `${field} must be PascalCase or snake_case`
    )
  }

  /**
   * Add warning
   */
  warn(field: string, message: string): this {
    this.warnings.push({ field, message })
    return this
  }

  /**
   * Get validation result
   */
  getResult(): ValidationResult {
    const result = {
      valid: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings]
    }
    
    // Reset for next validation
    this.errors = []
    this.warnings = []
    
    return result
  }

  /**
   * Throw if validation failed
   */
  throwIfInvalid(): void {
    const result = this.getResult()
    if (!result.valid) {
      const errorMessages = result.errors.map(e => `  - ${e.message}`).join('\n')
      throw new Error(`Validation failed:\n${errorMessages}`)
    }
  }
}
