import Joi from 'joi'

export const companyShareholderSchema = Joi.object({
  company_id: Joi.number().integer().positive(),

  full_name: Joi.string().max(150).required(),

  rut: Joi.string().max(20).required(),

  address: Joi.string().max(255).required(),

  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required(),

  profession: Joi.string().max(100).required(),

  type: Joi.string().valid('SOCIO', 'ACCIONISTA').required(),
  email: Joi.string().email().required(),
  unique_key: Joi.string().max(50).required(),
  nationality: Joi.string().max(50).required(),
})
