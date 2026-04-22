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

const STEP_DETAILS = {
  company_identity: {
    title: 'Company identity',
    description: 'Name of your company',
    fields: [
      {
        name: 'company_name',
        type: 'text',
        required: true,
        placeholder: 'Enter company name (e.g., "TechSolutions SpA")',
        validation: 'Between 3 and 100 characters',
        examples: ['TechSolutions SpA', 'Consultoría ABC', 'E-commerce XYZ'],
      },
    ],
  },
  today_focus: {
    title: 'Today focus',
    description: 'What is your main focus today?',
    fields: [
      {
        name: 'today_focus',
        type: 'select',
        required: true,
        catalogName: 'today_focus',
        description: 'Select from available options (e.g., "Start your company", "Formalize existing business")',
      },
    ],
  },
  offering_and_channels: {
    title: 'Offering and customer channels',
    description: 'What you offer and how customers reach you',
    fields: [
      {
        name: 'company_offering',
        type: 'select',
        required: true,
        catalogName: 'company_offering',
        description: 'Select offering type (Products, Services, or Both)',
      },
      {
        name: 'customer_service_channel',
        type: 'select',
        required: true,
        catalogName: 'customer_service_channel',
        description: 'How do customers contact you? (Online, In-person, Both)',
      },
    ],
  },
  business_profile: {
    title: 'Business profile',
    description: 'Your business sector and description',
    fields: [
      {
        name: 'business_sector_id',
        type: 'select',
        required: false,
        catalogName: 'business_sector',
        description: 'Select sector from catalog (e.g., "Technology", "Retail", "Services")',
      },
      {
        name: 'business_sector_other',
        type: 'text',
        required: false,
        description: 'If sector not in catalog, describe it here',
        validation: 'Free text, max 100 characters',
      },
      {
        name: 'about',
        type: 'text',
        required: true,
        placeholder: 'Describe your business idea',
        validation: 'Between 10 and 500 characters',
        examples: [
          'We provide software consulting for SMEs',
          'Online retail of handmade crafts',
        ],
      },
    ],
    note: 'Either business_sector_id OR business_sector_other must be provided',
  },
  location_and_phone: {
    title: 'Location and phone',
    description: 'Where your company operates and how to contact',
    fields: [
      {
        name: 'region_id',
        type: 'select',
        required: true,
        catalogName: 'region',
        description: 'Select your region (e.g., "Metropolitana", "Valparaíso")',
      },
      {
        name: 'street',
        type: 'text',
        required: true,
        placeholder: 'Street and number (e.g., "Paseo Ahumada 123")',
        validation: 'Between 5 and 150 characters',
      },
      {
        name: 'zip_code',
        type: 'text',
        required: true,
        placeholder: 'Postal code (e.g., "8320000")',
        validation: 'Between 3 and 20 characters',
      },
      {
        name: 'phone_number',
        type: 'text',
        required: true,
        placeholder: 'Phone number (e.g., "912345678")',
        validation: 'Between 7 and 20 characters',
      },
    ],
  },
  employees: {
    title: 'Employees',
    description: 'Do you have employees?',
    fields: [
      {
        name: 'has_employees',
        type: 'boolean',
        required: true,
        description: 'Yes (1) or No (2)',
      },
    ],
  },
  registration_status: {
    title: 'Registration status',
    description: 'Is your company legally registered?',
    fields: [
      {
        name: 'is_registered_company',
        type: 'boolean',
        required: true,
        description: 'Yes (1) or No (2)',
      },
    ],
  },
  tax_status: {
    title: 'Tax status - SII',
    description: 'Have you started activities in the SII (tax authority)?',
    fields: [
      {
        name: 'hasStartedActivities',
        type: 'boolean',
        required: true,
        description: 'Yes (1) or No (2)',
      },
    ],
  },
  marketing_source: {
    title: 'Marketing source',
    description: 'How did you hear about EmpowerMe?',
    fields: [
      {
        name: 'marketing_source',
        type: 'select',
        required: true,
        catalogName: 'marketing_source',
        description: 'Select source (e.g., "Friends", "Ads", "Social Media")',
      },
    ],
  },
}

export const CompanyCreationMcpService = {
  getStepDefinitions() {
    return clone(STEP_DEFINITIONS)
  },

  getDetailedStepInformation(step = null) {
    if (step) {
      const detail = STEP_DETAILS[step]
      if (!detail) {
        throw new Error(`Unknown step: ${step}`)
      }
      return detail
    }
    // Return all steps in order
    return STEP_ORDER.map((stepKey) => ({
      stepKey,
      ...STEP_DETAILS[stepKey],
    }))
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
