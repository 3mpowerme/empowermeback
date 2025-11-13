import { validateAccessToken } from '../utils/jwtValidator.js'

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ error: 'Missing or invalid Authorization header' })
    }

    const token = authHeader.split(' ')[1]
    const payload = await validateAccessToken(token)

    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}
