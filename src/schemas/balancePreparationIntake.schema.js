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

export const createBalancePreparationIntakeSchema = Joi.object({
  company_name: Joi.string().max(255).allow(null, ''),
  company_tax_id: Joi.string().max(20).allow(null, ''),
  company_tax_address: Joi.string().max(255).allow(null, ''),
  company_sii_password: Joi.string().max(255).allow(null, ''),
  legal_representative_name: Joi.string().max(255).allow(null, ''),
  legal_representative_tax_id: Joi.string().max(20).allow(null, ''),
  legal_representative_sii_password: Joi.string().max(255).allow(null, ''),
  contact_person_name: Joi.string().max(255).allow(null, ''),
  contact_person_email: Joi.string().email().max(255).allow(null, ''),
  contact_person_phone: phoneSchema.allow(null),
})

export const updateBalancePreparationIntakeSchema = Joi.object({
  company_name: Joi.string().max(255).allow(null, ''),
  company_tax_id: Joi.string().max(20).allow(null, ''),
  company_tax_address: Joi.string().max(255).allow(null, ''),
  company_sii_password: Joi.string().max(255).allow(null, ''),
  legal_representative_name: Joi.string().max(255).allow(null, ''),
  legal_representative_tax_id: Joi.string().max(20).allow(null, ''),
  legal_representative_sii_password: Joi.string().max(255).allow(null, ''),
  contact_person_name: Joi.string().max(255).allow(null, ''),
  contact_person_email: Joi.string().email().max(255).allow(null, ''),
  contact_person_phone: phoneSchema.allow(null),
}).min(1)
