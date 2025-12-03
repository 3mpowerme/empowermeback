import Joi from 'joi'

export const buildCompanySchema = Joi.object({
  company_id: Joi.number().integer().positive().required(),
  today_focus: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required(),
  company_offering: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required(),
  customer_service_channel: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required(),
  has_employees: Joi.string().valid('SI', 'NO', 'NOT_SURE').required(),
  is_registered_company: Joi.string().valid('SI', 'NO').required(),
  hasStartedActivities: Joi.string().valid('SI', 'NO').required(),
  marketing_source: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required(),
  about: Joi.string().min(1).max(500).required(),
  business_sector_id: Joi.number().integer().positive().required(),
  business_sector_other: Joi.string().max(150).allow(''),
  street: Joi.string().min(1).max(100).required(),
  zip_code: Joi.string().min(5).max(7).required(),
  region_id: Joi.number().integer().positive().required(),
  phone_number: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required(),
})
