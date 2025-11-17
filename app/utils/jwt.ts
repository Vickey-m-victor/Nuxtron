/**
 * JWT Token Utilities
 * Helper functions for validating and decoding JWT tokens
 */

/**
 * Decode JWT token payload without verification
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJWT(token: string): any {
  try {
    // JWT has 3 parts: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (middle part)
    const payload = parts[1]
    if (!payload) {
      return null
    }
    
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Check if JWT token is expired
 * @param token JWT token string
 * @returns true if expired, false if valid, true if can't decode
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token)
    
    if (!payload || !payload.exp) {
      // No expiration claim = treat as expired for safety
      return true
    }

    // JWT exp is in seconds, Date.now() is in milliseconds
    const expirationTime = payload.exp * 1000
    const currentTime = Date.now()
    
    // Add 60 second buffer to refresh before actual expiration
    const bufferTime = 60 * 1000
    
    return currentTime >= (expirationTime - bufferTime)
  } catch (error) {
    console.error('Failed to check token expiration:', error)
    return true // Treat as expired if we can't validate
  }
}

/**
 * Get token expiration time
 * @param token JWT token string
 * @returns Expiration timestamp in milliseconds, or null if invalid
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const payload = decodeJWT(token)
    if (!payload || !payload.exp) {
      return null
    }
    return payload.exp * 1000
  } catch {
    return null
  }
}

/**
 * Get time remaining until token expires
 * @param token JWT token string
 * @returns Milliseconds until expiration, or 0 if expired/invalid
 */
export function getTokenTimeRemaining(token: string): number {
  const expiration = getTokenExpiration(token)
  if (!expiration) {
    return 0
  }
  
  const remaining = expiration - Date.now()
  return Math.max(0, remaining)
}
