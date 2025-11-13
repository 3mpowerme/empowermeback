import crypto from 'crypto'
import { jwtDecode } from 'jwt-decode'

export function generateSecretHash(username, clientId, clientSecret) {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64')
}

export function getCognitoSub(token) {
  if (!token) throw new Error('Token is required')

  const decoded = jwtDecode(token)
  return decoded?.sub || null
}
