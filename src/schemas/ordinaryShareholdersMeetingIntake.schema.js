import Joi from 'joi'

const shareholderSchema = Joi.object({
  full_name: Joi.string().max(255).allow(null, ''),
  tax_id: Joi.string().max(20).allow(null, ''),
  address_region_commune: Joi.string().max(255).allow(null, ''),
})

export const createOrdinaryShareholdersMeetingIntakeSchema = Joi.object({
  company_name: Joi.string().max(255).allow(null, ''),
  company_tax_id: Joi.string().max(20).allow(null, ''),
  shareholders: Joi.array().items(shareholderSchema).allow(null),
  contact_person_name: Joi.string().max(255).allow(null, ''),
  contact_person_phone: Joi.string().max(50).allow(null, ''),
  contact_person_email: Joi.string().email().max(255).allow(null, ''),
})
