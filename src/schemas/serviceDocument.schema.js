import Joi from 'joi'

export const createServiceDocumentSchema = Joi.object({
  name: Joi.string().max(120).required(),
  details: Joi.string().allow('', null).max(255),
  doc_type: Joi.string()
    .valid('pdf', 'image', 'doc', 'xls', 'ppt', 'zip', 'other')
    .required(),
  max_size_bytes: Joi.number().integer().min(1).required(),
  url: Joi.string().uri().max(1024).allow(null, ''),
  notes: Joi.string().allow('', null).max(255),
})

export const updateServiceDocumentSchema = Joi.object({
  name: Joi.string().max(120),
  details: Joi.string().allow('', null).max(255),
  doc_type: Joi.string().valid(
    'pdf',
    'image',
    'doc',
    'xls',
    'ppt',
    'zip',
    'other'
  ),
  max_size_bytes: Joi.number().integer().min(1),
  url: Joi.string().uri().max(1024).allow(null, ''),
  notes: Joi.string().allow('', null).max(255),
}).min(1)
