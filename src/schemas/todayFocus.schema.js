import Joi from 'joi'

export const todayFocusSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  image: Joi.string().min(2).max(255).required(),
})
