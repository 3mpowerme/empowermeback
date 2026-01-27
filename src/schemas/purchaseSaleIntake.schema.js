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
  nationality: Joi.string().max(100).allow(null, ''),
  profession: Joi.string().max(100).allow(null, ''),
  marital_status: Joi.string().max(100).allow(null, ''),
  email: Joi.string().email().max(255).allow(null, ''),
})

export const createPurchaseSaleIntakeSchema = Joi.object({
  company_name: Joi.string().max(255).allow(null, ''),
  company_tax_id: Joi.string().max(20).allow(null, ''),
  shareholders: Joi.array().items(shareholderSchema).allow(null),
  sold_percentage_or_shares: Joi.string().max(255).required(),
  purchase_sale_price: Joi.string().max(255).required(),

  buyer_full_name: Joi.string().max(255).required(),
  buyer_tax_id: Joi.string().max(20).required(),
  buyer_address_region_commune: Joi.string().max(255).required(),
  buyer_nationality: Joi.string().max(100).required(),
  buyer_marital_status: Joi.string().max(100).required(),
  buyer_occupation: Joi.string().max(150).required(),
  buyer_email: Joi.string().email().max(255).required(),

  seller_full_name: Joi.string().max(255).required(),
  seller_tax_id: Joi.string().max(20).required(),
  seller_address_region_commune: Joi.string().max(255).required(),
  seller_nationality: Joi.string().max(100).required(),
  seller_marital_status: Joi.string().max(100).required(),
  seller_occupation: Joi.string().max(150).required(),
  seller_email: Joi.string().email().max(255).required(),

  contact_person_name: Joi.string().max(255).allow(null, ''),
  contact_person_phone: phoneSchema.allow(null),
  contact_person_email: Joi.string().email().max(255).allow(null, ''),
  seller_rut_unique_key: Joi.string().max(255).required(),
})
