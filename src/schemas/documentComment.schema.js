import Joi from 'joi'

export const createDocumentCommentSchema = Joi.object({
  comment: Joi.string().max(2000).required(),
})
