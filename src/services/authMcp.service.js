import { Country } from '../models/country.model.js'
import { User } from '../models/user.model.js'
import { UserIdentity } from '../models/userIdentity.model.js'
import { UserFeature } from '../models/userFeature.model.js'
import { loginSchema, signupSchema, verifyEmailSchema } from '../schemas/auth.schema.js'
import { login, signUp, verifyEmail } from './cognito.service.js'
import { validateAccessToken } from '../utils/jwtValidator.js'
import { getPostRedirectUrlByUserType } from '../utils/utils.js'

function toPlainValidation(error) {
  return (error?.details || []).map((detail) => ({
    message: detail.message,
    path: detail.path,
    type: detail.type,
  }))
}

function validate(schema, input) {
  const { error, value } = schema.validate(input, {
    abortEarly: false,
    stripUnknown: false,
  })

  return {
    ok: !error,
    value,
    validationErrors: error ? toPlainValidation(error) : [],
  }
}

async function ensureDefaultFeatures(userId) {
  const featureIds = [1, 2]
  for (const featureId of featureIds) {
    if (!(await UserFeature.checkIfFeatureIdExistsInUser(userId, featureId))) {
      await UserFeature.create(userId, featureId)
    }
  }
}

export const AuthMcpService = {
  validateSignupInput(input) {
    return validate(signupSchema, input)
  },

  validateVerifyEmailInput(input) {
    return validate(verifyEmailSchema, input)
  },

  validateLoginInput(input) {
    return validate(loginSchema, input)
  },

  async signup({ email, password, countryCode }) {
    const validation = this.validateSignupInput({ email, password, countryCode })
    if (!validation.ok) {
      return { ok: false, validationErrors: validation.validationErrors }
    }

    const { sub } = await signUp(email, password)
    const country = await Country.getByCode(countryCode)
    const countryId = country?.id || 18
    const existingUser = await UserIdentity.getUserAndUserIdentityByEmail(email)

    let userId = existingUser?.user_id
    if (!userId) {
      const createdUser = await User.create(email, countryId)
      userId = createdUser.id
    }

    await UserIdentity.upsertUser(userId, 'COGNITO', sub)
    await ensureDefaultFeatures(userId)

    return {
      ok: true,
      email,
      userId,
      cognitoSub: sub,
      nextStep: 'verify_email',
    }
  },

  async verifyEmail({ email, code }) {
    const validation = this.validateVerifyEmailInput({ email, code })
    if (!validation.ok) {
      return { ok: false, validationErrors: validation.validationErrors }
    }

    const result = await verifyEmail(email, code)
    return {
      ok: true,
      email,
      message: result.message,
      nextStep: 'login',
    }
  },

  async login({ email, password }) {
    const validation = this.validateLoginInput({ email, password })
    if (!validation.ok) {
      return { ok: false, validationErrors: validation.validationErrors }
    }

    const cognitoLoginResult = await login(email, password)
    const cognitoPayload = await validateAccessToken(cognitoLoginResult.accessToken)
    const cognitoSub = cognitoPayload?.sub
    const user = {}

    if (cognitoSub) {
      const { userId, userType } = await UserIdentity.getUserIdBySub(cognitoSub)
      user.userId = userId
      user.userType = userType
    }

    const company = await UserIdentity.getUserAndCompanyInfoByEmail(email)
    const userHasCompany = Boolean(company)
    const postLoginRedirect = getPostRedirectUrlByUserType(user.userType, userHasCompany)

    return {
      ok: true,
      email,
      ...cognitoLoginResult,
      ...user,
      postLoginRedirect,
      companyId: company?.companyId || null,
    }
  },
}
