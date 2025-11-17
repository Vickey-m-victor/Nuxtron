import { defineStore } from 'pinia'
import { encrypt, decrypt } from '~/utils/crypto'
import { isTokenExpired } from '~/utils/jwt'

interface User {
  username: string | null
  token: string | null
  isAuthenticated: boolean
  permissions: string[]
  menus: Record<string, any>
}

interface AuthState {
  user: User
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: {
      username: null,
      token: null,
      isAuthenticated: false,
      permissions: [],
      menus: {}
    },
    initialized: false
  }),

  actions: {
    // Initialize from localStorage on app start
    initStore() {
      // Only initialize once per store instance
      // But allow re-initialization if the user is not authenticated (in case of manual logout)
      if (this.initialized && this.user.isAuthenticated) {
        return
      }
      
      if (import.meta.client) {
        const encryptedToken = localStorage.getItem('auth.token')
        const username = localStorage.getItem('auth.username')

        if (encryptedToken && username) {
          try {
            const token = decrypt(encryptedToken)
            if (token) {
              // ✅ VALIDATE token before using it
              if (isTokenExpired(token)) {
                console.warn('Token expired on initialization')
                // Don't set the token, but mark as needing refresh
                this.user.username = username
                this.user.token = null
                this.user.isAuthenticated = false
              } else {
                // Token is valid
                this.setToken(token, username)
                this.loadUserData()
              }
            }
          } catch (error) {
            console.warn('Failed to decrypt token:', error)
            this.clearAuth()
          }
        }
        
        this.initialized = true
      }
    },

    // Set access token (encrypted in localStorage)
    setToken(token: string, username: string) {
      if (import.meta.client) {
        const encryptedToken = encrypt(token)
        
        this.user.token = token
        this.user.username = username
        this.user.isAuthenticated = true

        localStorage.setItem('auth.token', encryptedToken)
        localStorage.setItem('auth.username', username)
      }
    },

    // Set user data (permissions, menus)
    setUserData(userData: { permissions?: string[]; menus?: Record<string, any> }) {
      if (userData.permissions) {
        this.user.permissions = userData.permissions
        if (import.meta.client) {
          const encrypted = encrypt(JSON.stringify(userData.permissions))
          localStorage.setItem('auth.permissions', encrypted)
        }
      }

      if (userData.menus) {
        this.user.menus = userData.menus
        if (import.meta.client) {
          const encrypted = encrypt(JSON.stringify(userData.menus))
          localStorage.setItem('auth.menus', encrypted)
        }
      }
    },

    // Load user data from localStorage
    loadUserData() {
      if (import.meta.client) {
        const encryptedPermissions = localStorage.getItem('auth.permissions')
        const encryptedMenus = localStorage.getItem('auth.menus')

        if (encryptedPermissions) {
          try {
            const decrypted = decrypt(encryptedPermissions)
            this.user.permissions = decrypted ? JSON.parse(decrypted) : []
          } catch (error) {
            console.error('Failed to load permissions:', error)
          }
        }

        if (encryptedMenus) {
          try {
            const decrypted = decrypt(encryptedMenus)
            this.user.menus = decrypted ? JSON.parse(decrypted) : {}
          } catch (error) {
            console.error('Failed to load menus:', error)
          }
        }
      }
    },

    // Clear all auth data
    clearAuth() {
      this.user = {
        username: null,
        token: null,
        isAuthenticated: false,
        permissions: [],
        menus: {}
      }

      if (import.meta.client) {
        localStorage.removeItem('auth.token')
        localStorage.removeItem('auth.username')
        localStorage.removeItem('auth.permissions')
        localStorage.removeItem('auth.menus')
      }
    }
  },

  getters: {
    isAuthenticated: (state) => state.user.isAuthenticated,
    hasPermission: (state) => (permission: string) => 
      state.user.permissions.includes(permission)
  }
})
