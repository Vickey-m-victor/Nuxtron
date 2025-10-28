import type { EntityDefinition, Relationship } from '../types/index.js'

export interface RelationshipGraph {
  nodes: string[]
  edges: Array<{
    from: string
    to: string
    type: string
  }>
}

export interface ComponentSuggestion {
  generateTable: boolean
  generateFilters: boolean
  generateForm: boolean
  generateCard: boolean
  hasImageUpload: boolean
  hasFileUpload: boolean
  hasRichText: boolean
  hasDatePicker: boolean
}

export class SchemaAnalyzer {
  /**
   * Analyze relationships between entities
   */
  public analyzeRelationships(entities: EntityDefinition[]): RelationshipGraph {
    const nodes = entities.map(e => e.name)
    const edges: Array<{ from: string; to: string; type: string }> = []

    for (const entity of entities) {
      for (const rel of entity.relationships) {
        edges.push({
          from: entity.name,
          to: rel.entity,
          type: rel.type
        })
      }
    }

    return { nodes, edges }
  }

  /**
   * Suggest component structure based on entity properties
   */
  public suggestComponentStructure(entity: EntityDefinition): ComponentSuggestion {
    const props = entity.properties

    return {
      generateTable: props.length > 0,
      generateFilters: props.some(p => p.type === 'string' || p.type === 'enum'),
      generateForm: props.length > 0,
      generateCard: props.length <= 10, // Small entities work well as cards
      hasImageUpload: props.some(p => 
        p.name.includes('image') || 
        p.name.includes('photo') || 
        p.name.includes('avatar')
      ),
      hasFileUpload: props.some(p => 
        p.name.includes('file') || 
        p.name.includes('document') || 
        p.name.includes('attachment')
      ),
      hasRichText: props.some(p => 
        p.name.includes('content') || 
        p.name.includes('description') || 
        p.name.includes('body')
      ),
      hasDatePicker: props.some(p => 
        p.format === 'date' || 
        p.format === 'date-time' ||
        p.name.includes('date')
      )
    }
  }

  /**
   * Find circular dependencies in relationships
   */
  public findCircularDependencies(entities: EntityDefinition[]): string[][] {
    const graph = this.analyzeRelationships(entities)
    const cycles: string[][] = []
    
    // Simple cycle detection using DFS
    const visited = new Set<string>()
    const recStack = new Set<string>()
    
    const dfs = (node: string, path: string[]): void => {
      visited.add(node)
      recStack.add(node)
      path.push(node)
      
      // Find neighbors
      const neighbors = graph.edges
        .filter(e => e.from === node)
        .map(e => e.to)
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path])
        } else if (recStack.has(neighbor)) {
          // Found a cycle
          const cycleStart = path.indexOf(neighbor)
          cycles.push([...path.slice(cycleStart), neighbor])
        }
      }
      
      recStack.delete(node)
    }
    
    for (const node of graph.nodes) {
      if (!visited.has(node)) {
        dfs(node, [])
      }
    }
    
    return cycles
  }

  /**
   * Get entities sorted by dependency order
   */
  public sortByDependencies(entities: EntityDefinition[]): EntityDefinition[] {
    const graph = this.analyzeRelationships(entities)
    const sorted: string[] = []
    const visited = new Set<string>()
    
    const visit = (node: string): void => {
      if (visited.has(node)) return
      visited.add(node)
      
      // Visit dependencies first
      const deps = graph.edges
        .filter(e => e.from === node && e.type === 'belongs-to')
        .map(e => e.to)
      
      for (const dep of deps) {
        visit(dep)
      }
      
      sorted.push(node)
    }
    
    for (const node of graph.nodes) {
      visit(node)
    }
    
    // Return entities in sorted order
    return sorted
      .map(name => entities.find(e => e.name === name))
      .filter((e): e is EntityDefinition => e !== undefined)
  }

  /**
   * Analyze property patterns
   */
  public analyzePropertyPatterns(entity: EntityDefinition): {
    hasStatus: boolean
    hasTimestamps: boolean
    hasSoftDelete: boolean
    hasOwnership: boolean
  } {
    const propNames = entity.properties.map(p => p.name.toLowerCase())
    
    return {
      hasStatus: propNames.some(n => n.includes('status') || n.includes('state')),
      hasTimestamps: entity.metadata.timestamps || false,
      hasSoftDelete: entity.metadata.softDelete || false,
      hasOwnership: propNames.some(n => 
        n.includes('user_id') || 
        n.includes('owner') || 
        n.includes('created_by')
      )
    }
  }
}
