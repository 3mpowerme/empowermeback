import Joi from 'joi'

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
  contact_person_phone: Joi.string().max(50).allow(null, ''),
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
  contact_person_phone: Joi.string().max(50).allow(null, ''),
}).min(1)
