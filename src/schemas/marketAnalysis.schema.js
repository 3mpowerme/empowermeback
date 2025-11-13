import Joi from 'joi'

export const marketAnalysisSchema = Joi.object({
  summary: Joi.string().required(),
  market_opportunities: Joi.string().allow(null, ''),
  risks_and_obstacles: Joi.string().allow(null, ''),
  slogan: Joi.string().max(255).allow(null, ''),
  logo_url: Joi.string().uri().max(500).allow(null, ''),
  chart_image_url: Joi.string().uri().max(500).allow(null, ''),
})
