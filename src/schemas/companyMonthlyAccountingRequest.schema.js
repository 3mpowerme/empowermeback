import Joi from 'joi'

export const companyMonthlyAccountingRequestSchema = Joi.object({
  service_type: Joi.string().max(25),
  company_id: Joi.number().integer().positive(),
  email: Joi.string().email().required(),
  company_contact_phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required(),
  legal_representative_name: Joi.string().max(150).required(),
  legal_representative_rut: Joi.string().max(20).required(),
  legal_representative_phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required(),
  need_startup_support: Joi.string().valid('SI', 'NO').required(),
  previred_password: Joi.string().max(255),
  mutual_password: Joi.string().max(255),
  commercial_movements: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required(),
  rut: Joi.string().max(20),
})
