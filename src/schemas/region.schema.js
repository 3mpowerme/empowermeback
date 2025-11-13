import Joi from 'joi'

export const regionSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
})
