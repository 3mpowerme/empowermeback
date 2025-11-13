import Joi from 'joi'

export const companyTaxInfoSchema = Joi.object({
  company_id: Joi.number().integer().positive(),

  business_name: Joi.string().max(150).required(), // Razón Social
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required(),
  address: Joi.string().max(255).required(), // Dirección Tributaria
  rut: Joi.string().max(20).required(), // RUT
  password: Joi.string().max(255).required(), // Clave Tributaria
  previred_password: Joi.string().max(255).required(), // Clave previred
  mutual_password: Joi.string().max(255).required(), // Clave mutual
})
