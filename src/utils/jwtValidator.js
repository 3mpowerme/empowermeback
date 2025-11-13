import jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'
import axios from 'axios'
import jwksClient from 'jwks-rsa'
import dotenv from 'dotenv'

dotenv.config()

const url = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
console.log('url', url)

const client = jwksClient({
  jwksUri: url,
})

let pems = null

async function getPems() {
  if (pems) return pems

  const { data } = await axios.get(url)

  const keys = data.keys
  const pemMap = {}
  for (const key of keys) {
    const pem = jwkToPem(key)
    pemMap[key.kid] = pem
  }

  pems = pemMap
  return pems
}

export async function validateAccessToken(token) {
  const decoded = jwt.decode(token, { complete: true })
  if (!decoded) throw new Error('Invalid JWT token')

  const kid = decoded.header.kid
  const pems = await getPems()
  const pem = pems[kid]
  if (!pem) throw new Error('Invalid token: unknown kid')

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      pem,
      {
        algorithms: ['RS256'],
        issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
      },
      (err, payload) => {
        if (err) return reject(new Error('Invalid token'))
        resolve(payload)
      }
    )
  })
}

export function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey()
    callback(null, signingKey)
  })
}
