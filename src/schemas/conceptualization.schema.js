import Joi from 'joi'

export const conceptualizationSchema = Joi.object({
  company_id: Joi.number().integer().positive(),
  offering_service_type_id: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required(),
  about: Joi.string().min(10).max(500).required(),
  business_sector_id: Joi.number().integer().positive().required(),
  region_id: Joi.number().integer().positive().required(),
})
