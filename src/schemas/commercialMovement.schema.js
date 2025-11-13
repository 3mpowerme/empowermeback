import Joi from 'joi'

export const commercialMovementSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
})
