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
import jwt from 'jsonwebtoken'
import { getKey, validateAccessToken } from '../../utils/jwtValidator.js'
import { UserIdentity } from '../../models/userIdentity.model.js'
import { promisify } from 'util'
import { UserFeature } from '../../models/userFeature.model.js'
import { TodayFocus } from '../../models/todayFocus.model.js'
import { getPostRedirectUrlByUserType } from '../../utils/utils.js'

const verifyJwt = promisify(jwt.verify)

export async function signupController(req, res) {
  try {
    const { email, password, countryCode } = req.body
    const { sub } = await signUp(email, password)
    const country = await Country.getByCode(countryCode)
    const countryId = country?.id || 18 // default CL
    const { id: userId } = await User.create(email, countryId)
    await UserIdentity.create(userId, 'COGNITO', sub)
    await UserFeature.create(userId, 1) // Home
    await UserFeature.create(userId, 2) // Conceptualizacion
    // await UserFeature.create(userId, 3) // Creacion de Empresa
    // await UserFeature.create(userId, 4) // Facturacion y Contabilidad
    // await UserFeature.create(userId, 5) // Servicios Legales
    // await UserFeature.create(userId, 6) // Gestion empresarial
    // await UserFeature.create(userId, 7) // Diseño grafico empresarial
    return res.status(201).json({ message: 'User registered' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body
    const cognitoLoginresult = await login(email, password)
    const cognitoPayload = await validateAccessToken(
      cognitoLoginresult.accessToken
    )
    const cognitoSub = cognitoPayload?.sub
    const user = {}
    if (cognitoSub) {
      const { userId, userType } = await UserIdentity.getUserIdBySub(cognitoSub)
      user.userId = userId
      user.userType = userType
    }
    const company = await UserIdentity.getUserAndCompanyInfoByEmail(email)
    let userHasCompany = false
    if (company) {
      userHasCompany = true
    }

    const postLoginRedirect = getPostRedirectUrlByUserType(
      user.userType,
      userHasCompany
    )

    res.json({
      ...cognitoLoginresult,
      ...user,
      postLoginRedirect,
      companyId: company?.companyId,
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
    const { idToken, countryCode } = req.body
    const decoded = await verifyJwt(idToken, getKey, {})
    const { sub, email } = decoded
    const user = await UserIdentity.getUserAndUserIdentityByEmail(email)
    console.log('googleController user', user)

    let userId = null
    let userType = null

    const country = await Country.getByCode(countryCode)
    const countryId = country?.id || 18 // default CL
    if (user) {
      console.log('googleController user already exists', user)
      // user already exists
      userId = user.user_id
      userType = user.role_id
    } else {
      console.log('googleController user not exists, creating')
      const { id, role_id } = await User.create(email, countryId)
      userId = id
      userType = role_id
    }
    await UserIdentity.upsertUser(userId, 'GOOGLE', sub)
    console.log('googleController user type', userType)

    if (userType === 3) {
      console.log('googleController checkIfFeatureIdExistsInUser for type 3')
      if (!(await UserFeature.checkIfFeatureIdExistsInUser(userId, 1))) {
        console.log('googleController assiging home')
        await UserFeature.create(userId, 1) // Home
      }
      if (!(await UserFeature.checkIfFeatureIdExistsInUser(userId, 2))) {
        console.log('googleController assiging Conceptualizacion')
        console.log('assiging Conceptualizacion')
        await UserFeature.create(userId, 2) // Conceptualizacion
      }
    }

    const company = await UserIdentity.getUserAndCompanyInfoByEmail(email)

    let userHasCompany = false
    if (company) {
      userHasCompany = true
    }

    console.log('googleController userHasCompany', userHasCompany)

    const postLoginRedirect = getPostRedirectUrlByUserType(
      userType,
      userHasCompany
    )

    return res.json({
      message: user ? 'Login success' : 'User registered',
      userId,
      userType,
      postLoginRedirect,
      companyId: company?.companyId,
    })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}
