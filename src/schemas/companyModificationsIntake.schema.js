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

const legalRepresentativeSchema = Joi.object({
  full_name: Joi.string().max(255).allow(null, ''),
})

const shareholderSchema = Joi.object({
  full_name: Joi.string().max(255).allow(null, ''),
  tax_id: Joi.string().max(20).allow(null, ''),
  unique_key: Joi.string().max(50).allow(null, ''),
  address_region_commune: Joi.string().max(255).allow(null, ''),
  profession: Joi.string().max(100).allow(null, ''),
  phone: phoneSchema.allow(null),
})

export const createCompanyModificationsIntakeSchema = Joi.object({
  company_name: Joi.string().max(255).allow(null, ''),
  company_tax_id: Joi.string().max(20).allow(null, ''),
  shareholders: Joi.array().items(shareholderSchema).allow(null),
  legal_representatives: Joi.array()
    .items(legalRepresentativeSchema)
    .allow(null),
  signing_mode: Joi.string().max(100).required(),
  modifications_description: Joi.string().max(500).required(),
  contact_person_name: Joi.string().max(255).allow(null, ''),
  contact_person_phone: phoneSchema.allow(null),
  contact_person_email: Joi.string().email().max(255).allow(null, ''),
})
