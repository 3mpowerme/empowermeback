import { generateSecretHash } from '../utils/cognito.js'
import AWS from 'aws-sdk'

const { CognitoIdentityServiceProvider } = AWS
const cognito = new CognitoIdentityServiceProvider({
  region: process.env.COGNITO_REGION,
})

function buildSecretHash(email) {
  return generateSecretHash(
    email,
    process.env.COGNITO_CLIENT_ID,
    process.env.COGNITO_CLIENT_SECRET
  )
}

function mapCodeDeliveryDetails(details) {
  if (!details) return null

  return {
    destination: details.Destination || null,
    deliveryMedium: details.DeliveryMedium || null,
    attributeName: details.AttributeName || null,
  }
}

function serializeCognitoError(error) {
  return {
    name: error?.name || 'CognitoError',
    code: error?.code || error?.name || 'CognitoError',
    message: error?.message || 'Unknown Cognito error',
    statusCode: error?.statusCode || null,
    retryable: Boolean(error?.retryable),
    requestId: error?.requestId || null,
  }
}

export async function signUp(email, password) {
  try {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: buildSecretHash(email),
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    }
    const response = await cognito.signUp(params).promise()
    const codeDeliveryDetails = mapCodeDeliveryDetails(response.CodeDeliveryDetails)

    return {
      sub: response.UserSub,
      userConfirmed: Boolean(response.UserConfirmed),
      codeDeliveryDetails,
      deliveryIssued: Boolean(codeDeliveryDetails?.destination || response.UserConfirmed),
      provider: {
        region: process.env.COGNITO_REGION,
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        clientId: process.env.COGNITO_CLIENT_ID,
      },
    }
  } catch (error) {
    console.error('Cognito signUp error:', error)
    throw Object.assign(new Error(error?.message || 'Cognito signUp failed'), {
      ...serializeCognitoError(error),
      cause: error,
    })
  }
}

export async function verifyEmail(email, code) {
  try {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      SecretHash: buildSecretHash(email),
    }

    await cognito.confirmSignUp(params).promise()
    return { message: 'Email verified' }
  } catch (error) {
    console.error('Cognito verifyEmail error:', error)
    throw Object.assign(new Error(error?.message || 'Cognito verifyEmail failed'), serializeCognitoError(error))
  }
}

export async function login(email, password) {
  try {
    const secret_hash = buildSecretHash(email)
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secret_hash,
      },
    }

    const response = await cognito.initiateAuth(params).promise()
    return {
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
    }
  } catch (error) {
    console.error('Cognito login error:', error)
    throw Object.assign(new Error(error?.message || 'Cognito login failed'), serializeCognitoError(error))
  }
}

export async function forgotPassword(email) {
  try {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: buildSecretHash(email),
    }

    await cognito.forgotPassword(params).promise()
    return { message: 'Password reset code sent' }
  } catch (error) {
    console.error('Cognito forgotPassword error:', error)
    throw Object.assign(new Error(error?.message || 'Cognito forgotPassword failed'), serializeCognitoError(error))
  }
}

export async function resetPassword(email, code, newPassword) {
  try {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: buildSecretHash(email),
    }

    await cognito.confirmForgotPassword(params).promise()
    return { message: 'Password has been reset' }
  } catch (error) {
    console.error('Cognito resetPassword error:', error)
    throw Object.assign(new Error(error?.message || 'Cognito resetPassword failed'), serializeCognitoError(error))
  }
}

export async function logout(accessToken) {
  try {
    const params = {
      AccessToken: accessToken,
    }

    await cognito.globalSignOut(params).promise()
    return { message: 'User logged out' }
  } catch (error) {
    console.error('Cognito logout error:', error)
    throw Object.assign(new Error(error?.message || 'Cognito logout failed'), serializeCognitoError(error))
  }
}

export async function refreshTokens(email, refreshToken) {
  const secret_hash = buildSecretHash(email)
  try {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: secret_hash,
      },
    }

    const response = await cognito.initiateAuth(params).promise()
    return {
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken,
    }
  } catch (error) {
    console.error('Cognito refreshTokens error:', error)
    throw Object.assign(new Error(error?.message || 'Cognito refreshTokens failed'), serializeCognitoError(error))
  }
}
