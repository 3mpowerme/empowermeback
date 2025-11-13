import Joi from 'joi'

export const companySchema = Joi.object({
  name: Joi.string().max(150).required(),
})
