import { Company } from '../../models/company.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'
import openai from '../../config/openaiClient.js'
import { Conceptualization } from '../../models/conceptualization.model.js'
import { MarketAnalysis } from '../../models/marketAnalysis.model.js'
import { OfferingServiceType } from '../../models/offeringServiceType.model.js'
import { BusinessSector } from '../../models/businessSector.model.js'
import { Region } from '../../models/region.model.js'
import AWS from 'aws-sdk'
import {
  buildBusinessPlanPrompt,
  buildMarketAnalysisPrompt,
  buildPromptToInferOptions,
  getBusinessPlanPrompt,
  getConceptualizationPrompt,
} from '../../utils/prompt.js'
import { BrandBook } from '../../models/brandBook.model.js'
import { Colorimetry } from '../../models/colorimetry.model.js'
import { Logo } from '../../models/logo.model.js'
import { LogoHistory } from '../../models/logoHistory.model.js'
import { BusinessPlan } from '../../models/businessPlan.model.js'
import { generateStructuredJson } from '../../services/ai/index.js'
import { MARKET_ANALYSIS_JSON_OPENAI_SCHEMA } from '../../templates/marketAnalysis.openai.schema.js'
import { MARKET_ANALYSIS_JSON_GEMINI_SCHEMA } from '../../templates/marketAnalysis.gemini.schema.js'
import { Country } from '../../models/country.model.js'
import { BUSINESS_PLAN_JSON_OPENAI_SCHEMA } from '../../templates/businessPlan.openai.schema.js'
import { ANALYSIS_AND_BUSINESS_PLAN_JSON_OPENAI_SCHEMA } from '../../templates/analysisAndBusinessPlan.openai.schema.js'
import { BusinessCard } from '../../models/businessCard.model.js'
import { BusinessCardHistory } from '../../models/businessCardHistory.model.js'
import { ECONOMIC_ACTIVITIES_JSON_OPENAI_SCHEMA } from '../../templates/economicActivities.openai.schema.js'
import {
  actividadesParte1,
  actividadesParte2,
  actividadesParte3,
  actividadesParte4,
  actividadesParte5,
  actividadesParte6,
  actividadesParte7,
  actividadesParte8,
  actividadesParte9,
  actividadesParte10,
} from '../../utils/activities.js'

export const IaController = {
  async create(req, res) {
    try {
      const { description } = req.body

      const prompt = buildPromptToInferOptions(description, [
        ...actividadesParte1,
        ...actividadesParte2,
        ...actividadesParte3,
        ...actividadesParte4,
        ...actividadesParte5,
        ...actividadesParte6,
        ...actividadesParte7,
        ...actividadesParte8,
        ...actividadesParte9,
        ...actividadesParte10,
      ])
      console.log('prompt', prompt)
      const provider = 'openai'

      const result = await generateStructuredJson(
        prompt,
        ECONOMIC_ACTIVITIES_JSON_OPENAI_SCHEMA,
        {
          provider: provider, // "openai" | "gemini"
          temperature: 0.3,
          max_output_tokens: 10000,
          timeoutMs: 300000,
          strict: true,
          validate: true,
          schemaName: 'activades_economicas_del_negocio',
        }
      )

      console.log('result data:', result?.data)
      console.log('Tokens usados:')
      console.log({
        input_tokens: result?.usage?.input_tokens,
        input_tokens_details: JSON.stringify(
          result?.usage?.input_tokens_details || {}
        ),
        output_tokens: result?.usage?.output_tokens,
        output_tokens_details: JSON.stringify(
          result?.usage?.output_tokens_details || {}
        ),
        total_tokens: result?.usage?.total_tokens,
      })
      const data = result?.data

      res.status(201).json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
