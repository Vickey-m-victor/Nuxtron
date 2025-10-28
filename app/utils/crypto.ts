import CryptoJS from 'crypto-js'

/**
 * Get encryption key from runtime config
 * Note: localStorage encryption provides minimal security benefit since
 * JavaScript can always access it. This mainly protects against casual
 * browsing of localStorage, not against XSS attacks.
 */
function getSecretKey(): string {
  const config = useRuntimeConfig()
  return config.public.encryptionKey
}

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, getSecretKey()).toString()
}

export function decrypt(cipherText: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, getSecretKey())
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted || null
  } catch {
    return null
  }
}

