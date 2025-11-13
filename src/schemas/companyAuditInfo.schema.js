import Joi from 'joi'

export const companyAuditInfoSchema = Joi.object({
  service_type: Joi.string().max(25),
  company_id: Joi.number().integer().positive(),

  company_name: Joi.string().max(150), // Razón Social
  company_rut: Joi.string().max(20), // RUT Empresa
  company_tax_address: Joi.string().max(255), // Dirección Tributaria
  company_tax_key: Joi.string().max(255), // Clave Tributaria Empresa

  legal_representative_name: Joi.string().max(150),
  legal_representative_rut: Joi.string().max(20),
  legal_representative_tax_key: Joi.string().max(255),

  contact_name: Joi.string().max(150).required(),
  contact_email: Joi.string().email().required(),
  contact_phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required(),
})
