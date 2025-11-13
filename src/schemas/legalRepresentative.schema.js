import Joi from 'joi'

export const legalRepresentativeSchema = Joi.object({
  company_id: Joi.number().integer().positive(),

  name: Joi.string().max(150).required(), // Razón Social
  rut: Joi.string().max(20).required(), // RUT
  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required(),
  password: Joi.string().max(255).required(), // Clave Tributaria
})
