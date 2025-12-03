import db from '../../config/db.js'
import { Company } from '../../models/company.model.js'
import { Country } from '../../models/country.model.js'
import { User } from '../../models/user.model.js'
import {
  signUp,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  refreshTokens,
} from '../../services/cognito.service.js'
import { getCognitoSub } from '../../utils/cognito.js'
import jwt from 'jsonwebtoken'
import { getKey, validateAccessToken } from '../../utils/jwtValidator.js'
import { UserIdentity } from '../../models/userIdentity.model.js'
import { promisify } from 'util'
import { UserFeature } from '../../models/userFeature.model.js'
import { TodayFocus } from '../../models/todayFocus.model.js'

const verifyJwt = promisify(jwt.verify)

export async function signupController(req, res) {
  try {
    const { email, password, companyName, countryCode } = req.body
    const { sub } = await signUp(email, password)
    const { id: countryId } = await Country.getByCode(countryCode)
    const { id: userId } = await User.create(email, countryId)
    await UserIdentity.create(userId, 'COGNITO', sub)
    const { companyId } = await Company.create(userId, companyName)
    await UserFeature.create(userId, 1) // Home
    await UserFeature.create(userId, 2) // Conceptualizacion
    await UserFeature.create(userId, 3) // Creacion de Empresa
    await UserFeature.create(userId, 4) // Facturacion y Contabilidad
    await UserFeature.create(userId, 5) // Servicios Legales
    await UserFeature.create(userId, 6) // Gestion empresarial
    await UserFeature.create(userId, 7) // Diseño grafico empresarial
    console.log('companyId', companyId)
    return res.status(201).json({ message: 'User registered', companyId })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body
    const result = await login(email, password)
    const payload = await validateAccessToken(result.accessToken)
    const sub = payload?.sub
    let featureId = 1 // Home by default
    let todayFocusUrl = '/dashboard' // Home by default
    let todayFocusResult
    if (sub) {
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      result.userId = userId
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult
      todayFocusResult = await TodayFocus.getTodayFocusByCompanyId(companyId)
      console.log('todayFocusResult', todayFocusResult)

      if (todayFocusResult) {
        if (todayFocusResult?.todayFocus?.includes('Crea tu empresa')) {
          featureId = 2
          todayFocusUrl = '/dashboard/buildCompany'
        }
        if (
          todayFocusResult?.todayFocus?.includes('Impuestos y Contabilidad')
        ) {
          featureId = 3
          todayFocusUrl = '/dashboard/taxes_and_accounting'
        }

        if (todayFocusResult?.todayFocus?.includes('Orientación Empresarial')) {
          featureId = 6
          todayFocusUrl = '/dashboard/business_orientation'
        }

        if (todayFocusResult?.todayFocus?.includes('Logo')) {
          featureId = 7
          todayFocusUrl = '/dashboard/graphic_design/logo_design'
        }
      }
    }
    res.json({
      ...result,
      todayFocusFeatureId: featureId || 1,
      todayFocus: todayFocusResult?.todayFocus || 'Home',
      todayFocusUrl,
    })
  } catch (error) {
    console.error('login error', error)
    res.status(401).json({ error: error.message || 'Internal server error' })
  }
}

export async function verifyEmailController(req, res) {
  try {
    const { email, code } = req.body
    const result = await verifyEmail(email, code)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body
    const result = await forgotPassword(email)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function resetPasswordController(req, res) {
  try {
    const { email, code, newPassword } = req.body
    const result = await resetPassword(email, code, newPassword)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function logoutController(req, res) {
  try {
    const { accessToken } = req.body
    const result = await logout(accessToken)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function refreshTokenController(req, res) {
  try {
    const { refreshToken } = req.body
    const { authorization: accessToken } = req.headers
    if (!accessToken || !refreshToken) {
      return res
        .status(400)
        .json({ error: 'Missing accessToken or refreshToken' })
    }

    const token = accessToken.split(' ')[1]
    const payload = await validateAccessToken(token)
    const { username } = payload
    const tokens = await refreshTokens(username, refreshToken)
    res.json(tokens)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

export async function googleController(req, res) {
  try {
    const { idToken, countryCode, companyName } = req.body
    const decoded = await verifyJwt(idToken, getKey, {})
    const { sub, email } = decoded
    const user = await UserIdentity.getUserAndUserIdentityByEmail(email)
    console.log('user', user)
    let userId
    let company = null
    const { id: countryId } = await Country.getByCode(countryCode)
    if (user) {
      // user already exists
      userId = user.user_id
      company = await UserIdentity.getUserAndCompanyInfoByEmail(email)
    } else {
      const { id } = await User.create(email, countryId)
      userId = id
    }
    console.log('userId', userId)
    await UserIdentity.upsertUser(userId, 'GOOGLE', sub)
    if (!company && companyName) {
      const { id: companyId } = await Company.create(userId, companyName)
      company = { companyId, companyName }
    }
    console.log('company', company)
    let featureId = 1 // Home by default
    return res.json({
      message: user ? 'Login success' : 'User registered',
      companyId: company?.companyId,
      featureId,
    })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}
