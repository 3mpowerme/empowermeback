import Joi from 'joi'

export const featureSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  image: Joi.string().min(2).max(255).required(),
  link: Joi.string().min(2).max(100).required(),
})
