import Joi from 'joi'
import { BusinessSector } from '../models/businessSector.model.js'
import { CompanyOffering } from '../models/companyOffering.model.js'
import { Country } from '../models/country.model.js'
import { CustomerServiceChannel } from '../models/customerServiceChannel.model.js'
import { MarketingSource } from '../models/marketingSource.model.js'
import { Region } from '../models/region.model.js'
import { TodayFocus } from '../models/todayFocus.model.js'
import { buildCompanySchema } from '../schemas/buildCompany.schema.js'
import { validateAccessToken } from '../utils/jwtValidator.js'
import { BuildCompanyController } from '../controllers/buildCompany/buildCompany.controller.js'

const STEP_ORDER = [
  'company_identity',
  'today_focus',
  'offering_and_channels',
  'business_profile',
  'location_and_phone',
  'employees',
  'registration_status',
  'tax_status',
  'marketing_source',
]

const STEP_DEFINITIONS = {
  company_identity: {
    title: 'Company identity',
    frontendStep: [0, 1],
    requiredFields: ['company_name'],
  },
  today_focus: {
    title: 'Today focus',
    frontendStep: [2],
    requiredFields: ['today_focus'],
    catalogs: ['today_focus'],
  },
  offering_and_channels: {
    title: 'Offering and customer channels',
    frontendStep: [3],
    requiredFields: ['company_offering', 'customer_service_channel'],
    catalogs: ['company_offering', 'customer_service_channel'],
  },
  business_profile: {
    title: 'Business profile',
    frontendStep: [4],
    requiredFields: ['business_sector_id', 'business_sector_other', 'about'],
    catalogs: ['business_sector'],
  },
  location_and_phone: {
    title: 'Location and phone',
    frontendStep: [5],
    requiredFields: ['region_id', 'street', 'zip_code', 'phone_number'],
    catalogs: ['region', 'country'],
  },
  employees: {
    title: 'Employees',
    frontendStep: [6],
    requiredFields: ['has_employees'],
  },
  registration_status: {
    title: 'Registered company status',
    frontendStep: [7],
    requiredFields: ['is_registered_company'],
  },
  tax_status: {
    title: 'Started activities in SII',
    frontendStep: [8],
    requiredFields: ['hasStartedActivities'],
  },
  marketing_source: {
    title: 'Marketing source',
    frontendStep: [9],
    requiredFields: ['marketing_source'],
    catalogs: ['marketing_source'],
  },
}

const STEP_SCHEMAS = {
  company_identity: Joi.object({
    company_name: buildCompanySchema.extract('company_name').required(),
  }),
  today_focus: Joi.object({
    today_focus: buildCompanySchema.extract('today_focus').required(),
  }),
  offering_and_channels: Joi.object({
    company_offering: buildCompanySchema.extract('company_offering').required(),
    customer_service_channel: buildCompanySchema
      .extract('customer_service_channel')
      .required(),
  }),
  business_profile: Joi.object({
    business_sector_id: buildCompanySchema.extract('business_sector_id'),
    business_sector_other: buildCompanySchema.extract('business_sector_other'),
    about: buildCompanySchema.extract('about').required(),
  }).custom((value, helpers) => {
    const hasSectorId = Number.isInteger(value.business_sector_id)
    const hasOther = typeof value.business_sector_other === 'string' && value.business_sector_other.trim().length > 0
    if (!hasSectorId && !hasOther) {
      return helpers.error('any.custom', {
        message: 'Either business_sector_id or business_sector_other must be provided.',
      })
    }
    return value
  }),
  location_and_phone: Joi.object({
    region_id: buildCompanySchema.extract('region_id').required(),
    street: buildCompanySchema.extract('street').required(),
    zip_code: buildCompanySchema.extract('zip_code').required(),
    phone_number: buildCompanySchema.extract('phone_number').required(),
  }),
  employees: Joi.object({
    has_employees: buildCompanySchema.extract('has_employees').required(),
  }),
  registration_status: Joi.object({
    is_registered_company: buildCompanySchema.extract('is_registered_company').required(),
  }),
  tax_status: Joi.object({
    hasStartedActivities: buildCompanySchema.extract('hasStartedActivities').required(),
  }),
  marketing_source: Joi.object({
    marketing_source: buildCompanySchema.extract('marketing_source').required(),
  }),
}

const CATALOG_LOADERS = {
  today_focus: () => TodayFocus.getAll(),
  company_offering: () => CompanyOffering.getAll(),
  customer_service_channel: () => CustomerServiceChannel.getAll(),
  business_sector: () => BusinessSector.getAll(),
  region: () => Region.getAll(),
  marketing_source: () => MarketingSource.getAll(),
  country: () => Country.getAll(),
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

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function buildPayloadFromDraft(draft = {}) {
  const payload = {}
  for (const stepKey of STEP_ORDER) {
    Object.assign(payload, draft[stepKey] || {})
  }

  if (payload.business_sector_other && !payload.business_sector_id) {
    payload.business_sector_id = 11
  }

  return payload
}

async function getCatalogByName(name) {
  const loader = CATALOG_LOADERS[name]
  if (!loader) {
    throw new Error(`Unknown catalog: ${name}`)
  }

  return loader()
}

export const CompanyCreationMcpService = {
  getStepDefinitions() {
    return clone(STEP_DEFINITIONS)
  },

  async getCatalogs(names = []) {
    const catalogNames = names.length > 0 ? names : Object.keys(CATALOG_LOADERS)
    const result = {}
    for (const name of catalogNames) {
      result[name] = await getCatalogByName(name)
    }
    return result
  },

  async resolveCatalogSelections({ catalog, values = [], allowFreeText = false }) {
    const rows = await getCatalogByName(catalog)
    const byId = new Map(rows.map((row) => [String(row.id), row]))
    const byName = new Map(rows.map((row) => [normalizeLabel(row.name), row]))

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
      availableOptions: rows,
    }
  },

  validateStep(step, input) {
    const schema = STEP_SCHEMAS[step]
    if (!schema) {
      throw new Error(`Unknown step: ${step}`)
    }

    const { error, value } = schema.validate(input, {
      abortEarly: false,
      stripUnknown: false,
    })

    return {
      ok: !error,
      step,
      normalized: error ? null : value,
      validationErrors: error ? toPlainValidation(error) : [],
    }
  },

  mergeDraft({ draft = {}, step, input }) {
    const validation = this.validateStep(step, input)
    if (!validation.ok) {
      return {
        ok: false,
        step,
        draft,
        validationErrors: validation.validationErrors,
      }
    }

    const nextDraft = {
      ...draft,
      [step]: validation.normalized,
    }

    return {
      ok: true,
      step,
      draft: nextDraft,
      payloadPreview: buildPayloadFromDraft(nextDraft),
      completedSteps: STEP_ORDER.filter((stepKey) => !!nextDraft[stepKey]),
      remainingSteps: STEP_ORDER.filter((stepKey) => !nextDraft[stepKey]),
    }
  },

  validateFinalPayload(payload) {
    const { error, value } = buildCompanySchema.validate(payload, {
      abortEarly: false,
      stripUnknown: false,
    })

    return {
      ok: !error,
      normalized: error ? null : value,
      validationErrors: error ? toPlainValidation(error) : [],
    }
  },

  async finalize({ draft = {}, payload, accessToken, mode = 'dry_run' }) {
    const effectivePayload = payload || buildPayloadFromDraft(draft)
    const finalValidation = this.validateFinalPayload(effectivePayload)

    if (!finalValidation.ok) {
      return {
        ok: false,
        mode,
        payloadPreview: effectivePayload,
        validationErrors: finalValidation.validationErrors,
      }
    }

    if (mode === 'dry_run') {
      return {
        ok: true,
        mode,
        payloadPreview: finalValidation.normalized,
        executed: false,
      }
    }

    if (!accessToken) {
      return {
        ok: false,
        mode,
        payloadPreview: finalValidation.normalized,
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
        body: finalValidation.normalized,
        user,
      }

      const res = {
        statusCode: 200,
        payload: null,
        status(code) {
          this.statusCode = code
          return this
        },
        json(payload) {
          this.payload = payload
          resolve({ statusCode: this.statusCode, payload })
          return this
        },
      }

      BuildCompanyController.fillInfo(req, res).catch(reject)
    })

    return {
      ok: response.statusCode >= 200 && response.statusCode < 300,
      mode,
      executed: true,
      payloadPreview: finalValidation.normalized,
      backendResponse: response,
    }
  },

  buildPayloadFromDraft,
  stepOrder: STEP_ORDER,
}
