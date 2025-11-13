import Joi from 'joi'

export const customerServiceChannelSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(2).max(100).required(),
  image: Joi.string().min(2).max(255).required(),
})
