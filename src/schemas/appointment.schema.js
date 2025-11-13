import Joi from 'joi'

export const appointmentSchema = Joi.object({
  status: Joi.string().max(25),
  scheduled_date: Joi.string().isoDate(),
  service_request_id: Joi.number().integer().positive().required(),
  calendly_event_uri: Joi.string().required(),
})

export const updateAppointmentStatusSchema = Joi.object({
  status: Joi.string().max(25),
})

export const updateAppointmentScheduledDateSchema = Joi.object({
  scheduled_date: Joi.string().max(25),
})
