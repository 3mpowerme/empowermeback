import Joi from 'joi'

export const CreatePaymentIntentSchema = Joi.object({
  serviceOrderId: Joi.number().integer().positive().required(),
})

export const CreateSubscriptionSchema = Joi.object({
  companyId: Joi.number().integer().positive().required(),
  planId: Joi.number().integer().positive().required(),
})

export const CreatePortalSchema = Joi.object({
  companyId: Joi.number().integer().positive().required(),
  returnUrl: Joi.string().uri().optional(),
})

export const CreateServiceOrderSchema = Joi.object({
  companyId: Joi.number().integer().positive().required(),
  serviceCode: Joi.string().min(5).max(50).required(),
})

export const CancelSubscriptionSchema = Joi.object({
  mode: Joi.string()
    .valid('at_period_end', 'immediate')
    .default('at_period_end'),
})
