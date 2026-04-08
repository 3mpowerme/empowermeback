import { UserIdentity } from '../../models/userIdentity.model.js'
import { Conceptualization } from '../../models/conceptualization.model.js'
import { MarketAnalysis } from '../../models/marketAnalysis.model.js'
import { OfferingServiceType } from '../../models/offeringServiceType.model.js'
import { BusinessSector } from '../../models/businessSector.model.js'
import { Region } from '../../models/region.model.js'
import { Country } from '../../models/country.model.js'
import { BusinessPlan } from '../../models/businessPlan.model.js'
import { buildMarketAnalysisPrompt } from '../../utils/prompt.js'
import { generateStructuredJson } from '../../services/ai/index.js'
import { ANALYSIS_AND_BUSINESS_PLAN_JSON_OPENAI_SCHEMA } from '../../templates/analysisAndBusinessPlan.openai.schema.js'

const OTHERS_BUSINESS_SECTOR_ID = 11

export const ConceptualizationClaudeController = {
  async create(req, res) {
    try {
      const {
        offering_service_type_id: raw_offering_service_type_id,
        region_id,
        business_sector_id,
        business_sector_other,
        about,
      } = req.body

      // Normalize: schema accepts array (frontend compat) but controller needs scalar id
      const offering_service_type_id = Array.isArray(raw_offering_service_type_id)
        ? raw_offering_service_type_id[0]
        : raw_offering_service_type_id

      const sectorId = business_sector_other
        ? OTHERS_BUSINESS_SECTOR_ID
        : business_sector_id
      const sectorOther = business_sector_other || null

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const { countryId } = await UserIdentity.getCountryIdBySub(sub)
      const { name: countryName } = await Country.getNameById(countryId)

      const { name: offeringServiceTypeName } =
        await OfferingServiceType.getById(offering_service_type_id)
      const { name: businessSectorName } =
        await BusinessSector.getById(business_sector_id)
      const { name: regionName } = await Region.getById(region_id)

      const prompt = buildMarketAnalysisPrompt(
        offeringServiceTypeName,
        sectorId === OTHERS_BUSINESS_SECTOR_ID ? sectorOther : businessSectorName,
        regionName,
        about,
        countryName
      )

      console.log('[Claude conceptualization] generating structured JSON...')

      const result = await generateStructuredJson(
        prompt,
        ANALYSIS_AND_BUSINESS_PLAN_JSON_OPENAI_SCHEMA,
        {
          provider: 'claude',
          temperature: 0.3,
          max_output_tokens: 16000,
          timeoutMs: 300000,
          schemaName: 'analisis_de_viabilidad_y_plan_de_negocios',
        }
      )

      console.log('[Claude conceptualization] tokens:', result?.usage)

      const data = result?.data
      const { id: marketAnalysisId } = await MarketAnalysis.create(
        data.analisis_de_viabilidad
      )

      const { id: businessPlanId } = await BusinessPlan.create(
        data.plan_de_negocios
      )

      const conceptualization = await Conceptualization.create(
        userId,
        offering_service_type_id,
        region_id,
        sectorId,
        sectorOther,
        about,
        marketAnalysisId
      )
      const conceptualization_id = conceptualization?.id

      await Conceptualization.updateBusinessPlanId(conceptualization_id, businessPlanId)

      res.status(201).json({
        market_analysis: data.analisis_de_viabilidad,
        business_plan: data.plan_de_negocios,
        market_analysis_id: marketAnalysisId,
        conceptualization_id,
      })
    } catch (error) {
      console.error('[Claude conceptualization] error:', error.message)
      res.status(500).json({ error: error.message })
    }
  },
}
