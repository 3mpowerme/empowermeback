import Joi from 'joi'

const legalRepresentativeSchema = Joi.object({
  tax_id: Joi.string().max(20).allow(null, ''),
  unique_key: Joi.string().max(50).allow(null, ''),
})

const shareholderSchema = Joi.object({
  full_name: Joi.string().max(255).allow(null, ''),
  tax_id: Joi.string().max(20).allow(null, ''),
  address_region_commune: Joi.string().max(255).allow(null, ''),
  profession: Joi.string().max(100).allow(null, ''),
  phone: Joi.string().max(50).allow(null, ''),
})

export const createShareholderRegistryIntakeSchema = Joi.object({
  company_name: Joi.string().max(255).allow(null, ''),
  company_tax_id: Joi.string().max(20).allow(null, ''),
  shareholders: Joi.array().items(shareholderSchema).allow(null),
  legal_representatives: Joi.array()
    .items(legalRepresentativeSchema)
    .allow(null),
  contact_person_name: Joi.string().max(255).allow(null, ''),
  contact_person_phone: Joi.string().max(50).allow(null, ''),
  contact_person_email: Joi.string().email().max(255).allow(null, ''),
})
