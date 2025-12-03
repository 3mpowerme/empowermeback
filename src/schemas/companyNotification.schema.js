import Joi from 'joi'

export const createCompanyNotificationSchema = Joi.object({
  title: Joi.string().max(255).required(),
  message: Joi.string().max(2000).required(),
  type: Joi.string().max(50).allow(null, ''),
  metadata: Joi.object().unknown(true).allow(null),
})
