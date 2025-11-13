import Joi from 'joi'

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9]).*$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter and one number.',
    }),
})

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9]).*$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter and one number.',
    }),
  companyName: Joi.string().max(150).required(),
  countryCode: Joi.string().length(2).uppercase().required(),
})

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
})

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required(),
  newPassword: Joi.string()
    .min(8)
    .max(50)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9]).*$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter and one number.',
    }),
})

export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required(),
})

export const googleSchema = Joi.object({
  idToken: Joi.string().required(),
  companyName: Joi.string().max(150),
  countryCode: Joi.string().length(2).uppercase(),
})

export const logoutSchema = Joi.object({
  accessToken: Joi.string().required(),
})
