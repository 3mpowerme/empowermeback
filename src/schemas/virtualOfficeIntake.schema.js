import Joi from 'joi'

export const createVirtualOfficeContractIntakeSchema = Joi.object({
  company_name: Joi.string().max(255).required(),
  company_tax_id: Joi.string().max(20).required(),
  company_address: Joi.string().max(255).required(),
  company_commune: Joi.string().max(255).required(),
  company_region: Joi.string().max(255).required(),

  legal_representative_name: Joi.string().max(255).required(),
  legal_representative_tax_id: Joi.string().max(20).required(),
  legal_representative_address: Joi.string().max(255).required(),
  legal_representative_commune: Joi.string().max(255).required(),
  legal_representative_region: Joi.string().max(255).required(),
  legal_representative_profession: Joi.string().max(255).required(),
  legal_representative_nationality: Joi.string().max(100).required(),
  legal_representative_civil_status: Joi.string()
    .valid('SOLTER@', 'CASAD@', 'SEPARAD@', 'VIUD@', 'CONVIVIENTE CIVIL')
    .required(),
  legal_representative_email: Joi.string().email().max(255).required(),
  legal_representative_phone: Joi.string().max(50).required(),
})
