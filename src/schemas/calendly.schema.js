import Joi from 'joi'

export const calendlySchema = Joi.object({
  event: Joi.string().max(150).required(),
  payload: Joi.object({
    email: Joi.string().email().required(),
    scheduled_at: Joi.string().isoDate().required(),
    event_uri: Joi.string()
      .uri()
      .pattern(
        /^https:\/\/api\.calendly\.com\/scheduled_events\/[A-Za-z0-9_-]+$/
      )
      .required(),
  }).required(),
})

export const calendlyEventDataSchema = Joi.object({
  event_uri: Joi.string()
    .uri()
    .pattern(
      /^https:\/\/api\.calendly\.com\/scheduled_events\/[0-9a-fA-F-]{36}$/
    )
    .required(),
})
