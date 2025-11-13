import Joi from 'joi'

export const companyDissolutionOfSrlSchema = Joi.object({
  service_type: Joi.string().max(25),
  company_name: Joi.string().max(150),
  company_rut: Joi.string().max(20),
  legal_representative_rut: Joi.string().max(20),
  legal_representative_tax_key: Joi.string().max(255),
  contact_name: Joi.string().max(150).required(),
  contact_email: Joi.string().email().max(50).required(),
  contact_phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required(),
  shareholder_ids: Joi.array().items(Joi.number().integer().positive()).min(1),
})
