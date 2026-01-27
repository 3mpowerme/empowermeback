import Joi from 'joi'

export const phoneSchema = Joi.object({
  countryCode: Joi.string().length(2).uppercase().required(),

  phone_code: Joi.string()
    .pattern(/^\+\d{1,3}$/)
    .required(),

  phone: Joi.string()
    .pattern(/^\d{7,11}$/)
    .required(),
})

export const createAccountingClientIntakeSchema = Joi.object({
  email: Joi.string().email().max(255).allow(null, ''),
  company_tax_id: Joi.string().max(20).allow(null, ''),
  company_name: Joi.string().max(255).allow(null, ''),
  company_sii_password: Joi.string().max(255).allow(null, ''),
  company_contact_email: Joi.string().email().max(255).allow(null, ''),
  company_contact_name: Joi.string().max(255).allow(null, ''),
  company_contact_phone: phoneSchema.allow(null),
  legal_representative_name: Joi.string().max(255).allow(null, ''),
  legal_representative_tax_id: Joi.string().max(20).allow(null, ''),
  legal_representative_phone: phoneSchema.allow(null),
  need_activity_start_support: Joi.string().max(50).allow(null, ''),
  commercial_movements: Joi.array().items(Joi.number()).single().allow(null),
  previred_credentials: Joi.string().max(255).allow(null, ''),
  mutual_credentials: Joi.string().max(255).allow(null, ''),
  medical_leave_credentials: Joi.string().max(255).allow(null, ''),
})

export const updateAccountingClientIntakeSchema = Joi.object({
  email: Joi.string().email().max(255).allow(null, ''),
  company_tax_id: Joi.string().max(20).allow(null, ''),
  company_name: Joi.string().max(255).allow(null, ''),
  company_sii_password: Joi.string().max(255).allow(null, ''),
  company_contact_email: Joi.string().email().max(255).allow(null, ''),
  company_contact_name: Joi.string().max(255).allow(null, ''),
  company_contact_phone: phoneSchema.allow(null),
  legal_representative_name: Joi.string().max(255).allow(null, ''),
  legal_representative_tax_id: Joi.string().max(20).allow(null, ''),
  legal_representative_phone: phoneSchema.allow(null),
  need_activity_start_support: Joi.string().max(50).allow(null, ''),
  commercial_movements: Joi.array()
    .items(Joi.string().max(100))
    .single()
    .allow(null),
  previred_credentials: Joi.string().max(255).allow(null, ''),
  mutual_credentials: Joi.string().max(255).allow(null, ''),
  medical_leave_credentials: Joi.string().max(255).allow(null, ''),
}).min(1)
