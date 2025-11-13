import { generateSecretHash } from '../utils/cognito.js'
import AWS from 'aws-sdk'

const { CognitoIdentityServiceProvider } = AWS
const cognito = new CognitoIdentityServiceProvider({
  region: process.env.COGNITO_REGION,
})

export async function signUp(email, password) {
  try {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: generateSecretHash(
        email,
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET
      ),
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    }
    const response = await cognito.signUp(params).promise()
    return { sub: response.UserSub }
  } catch (error) {
    console.error('Cognito signUp error:', error)
    throw error
  }
}

export async function verifyEmail(email, code) {
  try {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      SecretHash: generateSecretHash(
        email,
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET
      ),
    }

    await cognito.confirmSignUp(params).promise()
    return { message: 'Email verified' }
  } catch (error) {
    console.error('Cognito verifyEmail error:', error)
    throw error
  }
}

export async function login(email, password) {
  try {
    const secret_hash = generateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    )
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
    throw error
  }
}

export async function forgotPassword(email) {
  try {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: generateSecretHash(
        email,
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET
      ),
    }

    await cognito.forgotPassword(params).promise()
    return { message: 'Password reset code sent' }
  } catch (error) {
    console.error('Cognito forgotPassword error:', error)
    throw error
  }
}

export async function resetPassword(email, code, newPassword) {
  try {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: generateSecretHash(
        email,
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET
      ),
    }

    await cognito.confirmForgotPassword(params).promise()
    return { message: 'Password has been reset' }
  } catch (error) {
    console.error('Cognito resetPassword error:', error)
    throw error
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
    throw error
  }
}

export async function refreshTokens(email, refreshToken) {
  const secret_hash = generateSecretHash(
    email,
    process.env.COGNITO_CLIENT_ID,
    process.env.COGNITO_CLIENT_SECRET
  )
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
    throw error
  }
}
