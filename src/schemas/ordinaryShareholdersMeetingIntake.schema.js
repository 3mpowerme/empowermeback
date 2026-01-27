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
  contact_person_phone: phoneSchema.allow(null),
  contact_person_email: Joi.string().email().max(255).allow(null, ''),
})
