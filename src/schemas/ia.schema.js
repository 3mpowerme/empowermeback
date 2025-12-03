import Joi from 'joi'

export const iaSchema = Joi.object({
  description: Joi.string().min(1).max(500).required(),
})
