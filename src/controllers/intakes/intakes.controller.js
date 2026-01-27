import db from '../../config/db.js'
import { Appointment } from '../../models/appointment.model.js'
import { Company } from '../../models/company.model.js'
import { Service } from '../../models/service.model.js'
import { UserFeature } from '../../models/userFeature.model.js'
import { parseJsonValues } from '../../utils/utils.js'

const INTAKE_TABLES = [
  {
    name: 'accounting_client_intakes',
    columns: [
      'id',
      'company_id',
      'service_id',
      'email',
      'company_tax_id',
      'company_name',
      'company_sii_password',
      'company_contact_email',
      'company_contact_name',
      'company_contact_phone',
      'legal_representative_name',
      'legal_representative_tax_id',
      'legal_representative_phone',
      'need_activity_start_support',
      'previred_credentials',
      'mutual_credentials',
      'medical_leave_credentials',
      'created_at',
      'updated_at',
    ],
  },
  {
    name: 'audit_process_intakes',
    columns: [
      'id',
      'company_id',
      'service_id',
      'company_name',
      'company_tax_id',
      'company_tax_address',
      'company_sii_password',
      'legal_representative_name',
      'legal_representative_tax_id',
      'legal_representative_sii_password',
      'contact_person_name',
      'contact_person_email',
      'contact_person_phone',
      'created_at',
      'updated_at',
    ],
  },
  {
    name: 'balance_preparation_intakes',
    columns: [
      'id',
      'company_id',
      'service_id',
      'company_name',
      'company_tax_id',
      'company_tax_address',
      'company_sii_password',
      'legal_representative_name',
      'legal_representative_tax_id',
      'legal_representative_sii_password',
      'contact_person_name',
      'contact_person_email',
      'contact_person_phone',
      'created_at',
      'updated_at',
    ],
  },
  {
    name: 'dissolution_company_intakes',
    columns: [
      'id',
      'company_id',
      'service_id',
      'company_name',
      'company_tax_id',
      'shareholders',
      'contact_person_name',
      'contact_person_phone',
      'contact_person_email',
      'created_at',
      'updated_at',
    ],
  },
  {
    name: 'shareholder_registry_intakes',
    columns: [
      'id',
      'company_id',
      'service_id',
      'company_name',
      'company_tax_id',
      'shareholders',
      'legal_representatives',
      'contact_person_name',
      'contact_person_phone',
      'contact_person_email',
      'created_at',
      'updated_at',
    ],
  },
  {
    name: 'constitution_review_intakes',
    columns: [
      'id',
      'company_id',
      'service_id',
      'company_name',
      'company_tax_id',
      'legal_representatives',
      'contact_person_name',
      'contact_person_phone',
      'contact_person_email',
      'created_at',
      'updated_at',
    ],
  },
  {
    name: 'virtual_office_contract_intakes',
    columns: [
      'id',
      'company_id',
      'service_id',
      'company_name',
      'company_tax_id',
      'company_address',
      'company_commune',
      'company_region',
      'legal_representative_name',
      'legal_representative_tax_id',
      'legal_representative_address',
      'legal_representative_commune',
      'legal_representative_region',
      'legal_representative_profession',
      'legal_representative_nationality',
      'legal_representative_civil_status',
      'legal_representative_email',
      'legal_representative_phone',
      'created_at',
      'updated_at',
    ],
  },
  {
    name: 'ordinary_shareholders_meeting_intakes',
    columns: [
      'id',
      'company_id',
      'service_id',
      'company_name',
      'company_tax_id',
      'shareholders',
      'contact_person_name',
      'contact_person_phone',
      'contact_person_email',
      'created_at',
      'updated_at',
    ],
  },
  {
    name: 'company_modifications_intakes',
    columns: [
      'id',
      'company_id',
      'service_id',
      'company_name',
      'company_tax_id',
      'shareholders',
      'legal_representatives',
      'signing_mode',
      'modifications_description',
      'contact_person_name',
      'contact_person_phone',
      'contact_person_email',
      'created_at',
      'updated_at',
    ],
  },
  {
    name: 'purchase_sale_intakes',
    columns: [
      'id',
      'company_id',
      'service_id',
      'company_name',
      'company_tax_id',
      'shareholders',
      'sold_percentage_or_shares',
      'purchase_sale_price',
      'buyer_full_name',
      'buyer_tax_id',
      'buyer_address_region_commune',
      'buyer_nationality',
      'buyer_marital_status',
      'buyer_occupation',
      'buyer_email',
      'seller_full_name',
      'seller_tax_id',
      'seller_address_region_commune',
      'seller_nationality',
      'seller_marital_status',
      'seller_occupation',
      'seller_email',
      'contact_person_name',
      'contact_person_phone',
      'contact_person_email',
      'seller_rut_unique_key',
      'created_at',
      'updated_at',
    ],
  },
]

function normalizeFieldsFromBody(body) {
  const raw = body || {}

  if (Array.isArray(raw.fields)) {
    return raw.fields.map((f) => String(f || '').trim()).filter(Boolean)
  }

  if (
    raw.fields &&
    typeof raw.fields === 'object' &&
    !Array.isArray(raw.fields)
  ) {
    return Object.keys(raw.fields)
      .map((k) => String(k || '').trim())
      .filter(Boolean)
  }

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return Object.keys(raw)
      .map((k) => String(k || '').trim())
      .filter(Boolean)
  }

  return []
}

function isMeaningfulValue(v) {
  if (v === null || v === undefined) return false
  if (typeof v === 'string') return v.trim().length > 0
  return true
}

export const IntakesController = {
  async createCompany(req, res) {
    try {
      const { companyName, userId } = req.body
      const { companyId } = await Company.create(userId, companyName)
      await UserFeature.create(userId, 3) // Creacion de Empresa
      await UserFeature.create(userId, 4) // Facturacion y Contabilidad
      await UserFeature.create(userId, 5) // Servicios Legales
      await UserFeature.create(userId, 6) // Gestion empresarial
      await UserFeature.create(userId, 7) // Diseño grafico empresarial
      return res.json({ companyId })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to create company' })
    }
  },
  async getReusableIntakeValuesByCompanyId(req, res) {
    try {
      const companyIdNum = Number(req.params?.companyId)

      if (!Number.isFinite(companyIdNum) || companyIdNum <= 0) {
        return res
          .status(400)
          .json({ error: 'companyId must be a valid number' })
      }

      const requestedFields = normalizeFieldsFromBody(req.body)

      if (!requestedFields.length) {
        return res.status(400).json({
          error:
            'You must send fields in the body. Example: { "fields": ["company_tax_id", "company_name", "contact_person_email"] }',
        })
      }

      const uniqueRequested = Array.from(new Set(requestedFields)).slice(0, 200)

      const found = {}
      const remaining = new Set(uniqueRequested)

      for (const t of INTAKE_TABLES) {
        const usableFields = uniqueRequested.filter(
          (f) => remaining.has(f) && t.columns.includes(f)
        )

        if (!usableFields.length) continue

        const selectCols = ['id', 'created_at', ...usableFields]
          .map((c) => `\`${c}\``)
          .join(', ')

        const sql = `
          SELECT ${selectCols}
          FROM \`${t.name}\`
          WHERE company_id = ?
          ORDER BY created_at DESC, id DESC
          LIMIT 50
        `

        const [rows] = await db.query(sql, [companyIdNum])

        for (const row of rows || []) {
          if (remaining.size === 0) break

          for (const f of usableFields) {
            if (!remaining.has(f)) continue
            const v = row?.[f]
            if (!isMeaningfulValue(v)) continue
            found[f] = v
            remaining.delete(f)
          }
        }
      }

      if (!Object.keys(found).length) return res.json({})

      return res.json(parseJsonValues(found))
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ error: 'Failed to get reusable intake values' })
    }
  },
  async getServiceInfo(req, res) {
    try {
      const { serviceCode } = req.params
      const service = await Service.getByCode(serviceCode)
      return res.json(service)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to get service' })
    }
  },
  async getAppointmentsByServiceCode(req, res) {
    try {
      const { companyId, serviceCode } = req.params
      const appointments = await Appointment.getByServiceCode(
        companyId,
        serviceCode
      )
      return res.json(appointments)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to get appointments' })
    }
  },
}
