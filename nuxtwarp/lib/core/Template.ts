export interface TemplateContext {
  [key: string]: any
}

export interface TemplateOptions {
  preserveWhitespace?: boolean
  indentation?: string
}

export class Template {
  private static readonly DEFAULT_OPTIONS: TemplateOptions = {
    preserveWhitespace: false,
    indentation: '  ' // 2 spaces
  }

  /**
   * Render template with context
   */
  static render(template: string, context: TemplateContext, options?: TemplateOptions): string {
    const opts = { ...this.DEFAULT_OPTIONS, ...options }
    
    // Replace template variables {{variableName}}
    let rendered = template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const trimmedKey = key.trim()
      const value = this.getValue(context, trimmedKey)
      return value !== undefined ? String(value) : match
    })
    
    // Handle conditionals {{#if condition}}...{{/if}}
    rendered = this.processConditionals(rendered, context)
    
    // Handle loops {{#each items}}...{{/each}}
    rendered = this.processLoops(rendered, context)
    
    // Clean up whitespace if needed
    if (!opts.preserveWhitespace) {
      rendered = this.cleanWhitespace(rendered)
    }
    
    return rendered
  }

  /**
   * Get nested value from context
   */
  private static getValue(obj: any, path: string): any {
    const keys = path.split('.')
    let current = obj
    
    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined
      }
      current = current[key]
    }
    
    return current
  }

  /**
   * Process conditional blocks
   */
  private static processConditionals(template: string, context: TemplateContext): string {
    const conditionalRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g
    
    return template.replace(conditionalRegex, (match, condition, content) => {
      const value = this.getValue(context, condition.trim())
      return value ? content : ''
    })
  }

  /**
   * Process loop blocks
   */
  private static processLoops(template: string, context: TemplateContext): string {
    const loopRegex = /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g
    
    return template.replace(loopRegex, (match, arrayPath, content) => {
      const array = this.getValue(context, arrayPath.trim())
      
      if (!Array.isArray(array)) {
        return ''
      }
      
      return array.map((item, index) => {
        const itemContext = {
          ...context,
          this: item,
          index,
          isFirst: index === 0,
          isLast: index === array.length - 1
        }
        
        return this.render(content, itemContext, { preserveWhitespace: true })
      }).join('')
    })
  }

  /**
   * Clean unnecessary whitespace
   */
  private static cleanWhitespace(str: string): string {
    return str
      .replace(/^\s*\n/gm, '') // Remove empty lines
      .replace(/[ \t]+$/gm, '') // Remove trailing spaces
      .trim()
  }

  /**
   * Indent content
   */
  static indent(content: string, level: number = 1, char: string = '  '): string {
    const indentation = char.repeat(level)
    return content.split('\n').map(line => {
      return line.trim() ? indentation + line : line
    }).join('\n')
  }
}
