import Joi from 'joi'
import { BusinessSector } from '../models/businessSector.model.js'
import { OfferingServiceType } from '../models/offeringServiceType.model.js'
import { Region } from '../models/region.model.js'
import { conceptualizationSchema } from '../schemas/conceptualization.schema.js'
import { validateAccessToken } from '../utils/jwtValidator.js'
import { ConceptualizationController } from '../controllers/conceptualization/conceptualization.controller.js'

const OTHERS_BUSINESS_SECTOR_ID = 25
const FRONTEND_FALLBACK_OTHER_ID = 11

const STEP_ORDER = ['welcome', 'offering_service_type', 'business_profile']

const STEP_DEFINITIONS = {
  welcome: {
    title: 'Welcome',
    frontendStep: [1],
    requiredFields: [],
    notes: 'Informational only. No backend payload is produced.',
  },
  offering_service_type: {
    title: 'Offering service type',
    frontendStep: [2],
    requiredFields: ['offering_service_type_id'],
    catalogs: ['offering_service_type'],
  },
  business_profile: {
    title: 'Business profile and market analysis request',
    frontendStep: [3],
    requiredFields: ['business_sector_id_or_other', 'region_id', 'about'],
    catalogs: ['business_sector', 'region'],
  },
}

const STAGE1_DRAFT_SCHEMA = Joi.object({
  offering_service_type_id: Joi.number().integer().positive().required(),
  service_order_id: Joi.number().integer().positive().optional(),
  business_sector_id: Joi.number().integer().positive(),
  business_sector_other: Joi.string().trim().max(150).allow(''),
  region_id: Joi.number().integer().positive().required(),
  about: Joi.string().trim().min(10).max(500).required(),
}).custom((value, helpers) => {
  const hasSectorId = Number.isInteger(value.business_sector_id)
  const hasOther = typeof value.business_sector_other === 'string' && value.business_sector_other.trim().length > 0
  if (!hasSectorId && !hasOther) {
    return helpers.error('any.custom', {
      message: 'Either business_sector_id or business_sector_other must be provided.',
    })
  }
  return value
})

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function normalizeLabel(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function toPlainValidation(error) {
  return (error?.details || []).map((detail) => ({
    message: detail.context?.message || detail.message,
    path: detail.path,
    type: detail.type,
  }))
}

async function getCatalogByName(name) {
  if (name === 'offering_service_type') return OfferingServiceType.getAll()
  if (name === 'business_sector') return BusinessSector.getAll()
  if (name === 'region') return Region.getAll()
  throw new Error(`Unknown conceptualization catalog: ${name}`)
}

function normalizeStage1Payload(payload = {}) {
  const normalized = { ...payload }

  if (Array.isArray(normalized.offering_service_type_id)) {
    normalized.offering_service_type_id = normalized.offering_service_type_id[0]
  }

  if (typeof normalized.business_sector_other === 'string') {
    normalized.business_sector_other = normalized.business_sector_other.trim()
  }

  const hasOther = !!normalized.business_sector_other
  if (hasOther) {
    normalized.business_sector_id = OTHERS_BUSINESS_SECTOR_ID
  }

  return normalized
}

export const ConceptualizationStage1McpService = {
  getStepDefinitions() {
    return clone(STEP_DEFINITIONS)
  },

  async getCatalogs(names = []) {
    const catalogNames = names.length ? names : ['offering_service_type', 'business_sector', 'region']
    const result = {}
    for (const name of catalogNames) {
      const rows = await getCatalogByName(name)
      result[name] = name === 'business_sector' ? rows.filter((row) => row.name !== 'Otros') : rows
    }
    return result
  },

  async resolveCatalogSelections({ catalog, values = [], allowFreeText = false }) {
    const rows = await getCatalogByName(catalog)
    const filteredRows = catalog === 'business_sector' ? rows.filter((row) => row.name !== 'Otros') : rows
    const byId = new Map(filteredRows.map((row) => [String(row.id), row]))
    const byName = new Map(filteredRows.map((row) => [normalizeLabel(row.name), row]))

    const resolved = []
    const unresolved = []

    for (const rawValue of values) {
      if (rawValue === null || rawValue === undefined || rawValue === '') {
        unresolved.push({ value: rawValue, reason: 'empty_value' })
        continue
      }

      const idMatch = byId.get(String(rawValue))
      if (idMatch) {
        resolved.push({ input: rawValue, id: idMatch.id, name: idMatch.name, matchType: 'id' })
        continue
      }

      const normalized = normalizeLabel(rawValue)
      const nameMatch = byName.get(normalized)
      if (nameMatch) {
        resolved.push({ input: rawValue, id: nameMatch.id, name: nameMatch.name, matchType: 'name' })
        continue
      }

      if (allowFreeText) {
        resolved.push({ input: rawValue, freeText: true, value: String(rawValue).trim() })
      } else {
        unresolved.push({ value: rawValue, reason: 'not_found' })
      }
    }

    return {
      catalog,
      resolved,
      unresolved,
      availableOptions: filteredRows,
    }
  },

  validateDraft(payload) {
    const normalized = normalizeStage1Payload(payload)
    const { error, value } = STAGE1_DRAFT_SCHEMA.validate(normalized, {
      abortEarly: false,
      stripUnknown: false,
    })

    return {
      ok: !error,
      normalized: error ? null : value,
      validationErrors: error ? toPlainValidation(error) : [],
    }
  },

  validateBackendPayload(payload) {
    const normalized = normalizeStage1Payload(payload)
    const backendPayload = {
      ...normalized,
      offering_service_type_id: Array.isArray(normalized.offering_service_type_id)
        ? normalized.offering_service_type_id
        : [normalized.offering_service_type_id],
    }
    const { error, value } = conceptualizationSchema.validate(backendPayload, {
      abortEarly: false,
      stripUnknown: false,
    })

    const validationErrors = error ? toPlainValidation(error) : []

    if (!error && normalized.business_sector_other && value.business_sector_id === FRONTEND_FALLBACK_OTHER_ID) {
      validationErrors.push({
        message: `Frontend currently falls back to business_sector_id=${FRONTEND_FALLBACK_OTHER_ID} for free-text sectors, but the DB seed places 'Otros' at id=${OTHERS_BUSINESS_SECTOR_ID}. MCP should use ${OTHERS_BUSINESS_SECTOR_ID}.`,
        path: ['business_sector_id'],
        type: 'warning.catalog.mismatch',
      })
    }

    return {
      ok: !error,
      normalized: error ? null : value,
      validationErrors,
    }
  },

  async execute({ payload, accessToken, mode = 'dry_run' }) {
    const draftValidation = this.validateDraft(payload)
    const backendValidation = this.validateBackendPayload(payload)

    if (!draftValidation.ok || !backendValidation.ok) {
      return {
        ok: false,
        mode,
        payloadPreview: normalizeStage1Payload(payload),
        draftValidation,
        backendValidation,
      }
    }

    if (mode === 'dry_run') {
      return {
        ok: true,
        mode,
        executed: false,
        payloadPreview: backendValidation.normalized,
        draftValidation,
        backendValidation,
      }
    }

    if (!accessToken) {
      return {
        ok: false,
        mode,
        payloadPreview: backendValidation.normalized,
        validationErrors: [
          {
            message: 'accessToken is required when mode is execute.',
            path: ['accessToken'],
            type: 'any.required',
          },
        ],
      }
    }

    const user = await validateAccessToken(accessToken)

    const response = await new Promise((resolve, reject) => {
      const req = {
        body: backendValidation.normalized,
        user,
      }

      const res = {
        statusCode: 200,
        payload: null,
        status(code) {
          this.statusCode = code
          return this
        },
        json(result) {
          this.payload = result
          resolve({ statusCode: this.statusCode, payload: result })
          return this
        },
      }

      ConceptualizationController.create(req, res).catch(reject)
    })

    return {
      ok: response.statusCode >= 200 && response.statusCode < 300,
      mode,
      executed: true,
      payloadPreview: backendValidation.normalized,
      draftValidation,
      backendValidation,
      backendResponse: response,
    }
  },

  stepOrder: STEP_ORDER,
  constants: {
    othersBusinessSectorIdFromSqlSeed: OTHERS_BUSINESS_SECTOR_ID,
    frontendFallbackOtherBusinessSectorId: FRONTEND_FALLBACK_OTHER_ID,
  },
}
