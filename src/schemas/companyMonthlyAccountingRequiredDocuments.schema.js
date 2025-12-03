import Joi from 'joi'

export const companyMonthlyAccountingRequiredDocumentsSchema = Joi.object({
  service_type: Joi.string().max(25),
  company_id: Joi.number().integer().positive(),
  proof_of_address: Joi.string().max(150),
  company_statute_or_constitution: Joi.string().max(150),
  company_rut: Joi.string().max(20),
  legal_representative_rut: Joi.string().max(20),
  legal_representative_key: Joi.string().max(255),
  activities: Joi.array().items(Joi.string().max(150)),
})
