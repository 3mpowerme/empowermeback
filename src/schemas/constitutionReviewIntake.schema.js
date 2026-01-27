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
  tax_id: Joi.string().max(20).allow(null, ''),
  nationality: Joi.string().max(100).allow(null, ''),
})

export const createConstitutionReviewIntakeSchema = Joi.object({
  company_name: Joi.string().max(255).allow(null, ''),
  company_tax_id: Joi.string().max(20).allow(null, ''),
  legal_representatives: Joi.array()
    .items(legalRepresentativeSchema)
    .allow(null),
  contact_person_name: Joi.string().max(255).allow(null, ''),
  contact_person_phone: phoneSchema.allow(null),
  contact_person_email: Joi.string().email().max(255).allow(null, ''),
})
