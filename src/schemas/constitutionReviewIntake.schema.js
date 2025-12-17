import Joi from 'joi'

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
  contact_person_phone: Joi.string().max(50).allow(null, ''),
  contact_person_email: Joi.string().email().max(255).allow(null, ''),
})
