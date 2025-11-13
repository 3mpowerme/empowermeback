import Joi from 'joi'

export const brandBookSchema = Joi.object({
  colorimetry: Joi.array()
    .items(Joi.string().length(7).required())
    .min(1)
    .required(),
  colorimetry_name: Joi.string().min(1).max(50).required(),
  brand_name: Joi.string().min(1).max(500).required(),
  slogan: Joi.string().min(1).max(500).required(),
  logo_type: Joi.string().min(1).max(500).required(),
  conceptualization_id: Joi.number().integer().positive().required(),
})

export const logoSchema = Joi.object({
  offering_service_type_id: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required(),
  about: Joi.string().min(5).max(500).required(),
  business_sector_id: Joi.number().integer().positive().required(),
  brand_name: Joi.string().min(1).max(500).required(),
  logo_type: Joi.string().min(1).max(500).required(),
})

export const brandBookOptionsSchema = Joi.object({
  offering_service_type_id: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required(),
  about: Joi.string().min(5).max(500).required(),
  business_sector_id: Joi.number().integer().positive().required(),
  region_id: Joi.number().integer().positive().required(),
})

export const updateBrandBookLogoSchema = Joi.object({
  logo_id: Joi.number().integer().positive(),
})

export const businessPlanSchema = Joi.object({
  offering_service_type_id: Joi.number().integer().positive().required(),
  about: Joi.string().min(5).max(500).required(),
  business_sector_id: Joi.number().integer().positive().required(),
  region_id: Joi.number().integer().positive().required(),
  brand_book_id: Joi.number().integer().positive().required(),
})

export const businessCardUpdateChosenSchema = Joi.object({
  history_id: Joi.number().integer().positive().required(),
})
