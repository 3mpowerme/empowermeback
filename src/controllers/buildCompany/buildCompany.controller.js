import { Address } from '../../models/address.model.js'
import { QuestionResponse } from '../../models/questionResponse.model.js'
import { CompanySetup } from '../../models/companySetup.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'
import { Company } from '../../models/company.model.js'
import { UserFeature } from '../../models/userFeature.model.js'

export const BuildCompanyController = {
  async fillInfo(req, res) {
    try {
      const OTHERS_BUSINESS_SECTOR_ID = 11
      const {
        company_name,
        today_focus,
        company_offering,
        customer_service_channel,
        has_employees,
        is_registered_company,
        hasStartedActivities,
        marketing_source,
        about,
        business_sector_id,
        business_sector_other,
        street,
        zip_code,
        region_id,
        phone_number,
      } = req.body

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)

      if (!(await UserFeature.checkIfFeatureIdExistsInUser(userId, 3))) {
        console.log('googleController assiging creacion de empresa')
        await UserFeature.create(userId, 3) // Creacion de Empresa
      }
      if (!(await UserFeature.checkIfFeatureIdExistsInUser(userId, 4))) {
        console.log('googleController assiging Facturacion y Contabilidad')
        await UserFeature.create(userId, 4) // Facturacion y Contabilidad
      }
      if (!(await UserFeature.checkIfFeatureIdExistsInUser(userId, 5))) {
        console.log('googleController assiging  Servicios Legales')
        await UserFeature.create(userId, 5) // Servicios Legales
      }
      if (!(await UserFeature.checkIfFeatureIdExistsInUser(userId, 6))) {
        console.log('googleController assiging Gestion empresarial')
        await UserFeature.create(userId, 6) // Gestion empresarial
      }
      if (!(await UserFeature.checkIfFeatureIdExistsInUser(userId, 7))) {
        console.log('googleController assiging Diseño grafico empresarial')
        await UserFeature.create(userId, 7) // Diseño grafico empresarial
      }

      const companies =
        await UserIdentity.getUserAndCompaniesInfoByUserId(userId)
      const userHasCompany = companies.length > 0
      let company_id
      if (userHasCompany) {
        company_id = companies[0].companyId
      } else {
        const { companyId } = await Company.create(userId, company_name)
        company_id = companyId
      }

      const sectorId = business_sector_other
        ? OTHERS_BUSINESS_SECTOR_ID
        : business_sector_id
      const sectorOther = business_sector_other || null
      const { id: address_id } = await Address.create(
        street,
        zip_code,
        phone_number,
        region_id
      )

      const { id } = await CompanySetup.create(
        company_id,
        has_employees,
        is_registered_company,
        hasStartedActivities,
        about,
        address_id,
        sectorId,
        sectorOther
      )

      for (const responseId of today_focus) {
        const newRow = await QuestionResponse.createByQuestionTable(
          'today_focus',
          company_id,
          responseId
        )

        console.log('today_focus inserted', newRow)
      }

      company_offering.forEach(async (responseId) => {
        const newRow = await QuestionResponse.createByQuestionTable(
          'company_offering',
          company_id,
          responseId
        )
        console.log('company_offering inserted', newRow)
      })

      customer_service_channel.forEach(async (responseId) => {
        const newRow = await QuestionResponse.createByQuestionTable(
          'customer_service_channel',
          company_id,
          responseId
        )
        console.log('customer_service_channel inserted', newRow)
      })

      marketing_source.forEach(async (responseId) => {
        const newRow = await QuestionResponse.createByQuestionTable(
          'marketing_source',
          company_id,
          responseId
        )
        console.log('marketing_source inserted', newRow)
      })

      res.status(201).json({
        company_setup_id: id,
      })
    } catch (error) {
      console.error('error', error)
      res.status(500).json({ error: error.message })
    }
  },

  async get(req, res) {
    try {
      const { companyId } = req.params
      const row = await CompanySetup.getByCompanyId(Number(companyId))
      if (!row)
        return res.status(404).json({ error: 'company_setup not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { companyId } = req.params
      const current = await CompanySetup.getByCompanyId(Number(companyId))
      if (!current)
        return res.status(404).json({ error: 'company_setup not found' })

      const {
        has_employees,
        is_registered_company,
        about,
        business_sector_id,

        street,
        zip_code,
        region_id,
        phone_number,
      } = req.body || {}

      let newAddressId = null
      const wantsAddressUpdate =
        street !== undefined ||
        zip_code !== undefined ||
        region_id !== undefined ||
        phone_number !== undefined

      if (wantsAddressUpdate) {
        const address = await Address.create(
          street ?? null,
          zip_code ?? null,
          phone_number ?? null,
          region_id ?? null
        )
        newAddressId = address.id
      }

      const payload = {}
      if (has_employees !== undefined) payload.hasEmployees = has_employees
      if (is_registered_company !== undefined)
        payload.is_registered_company = is_registered_company
      if (about !== undefined) payload.about = about
      if (business_sector_id !== undefined)
        payload.business_sector_id = business_sector_id
      if (newAddressId !== null) payload.address_id = newAddressId

      if (Object.keys(payload).length === 0) {
        return res.json(current)
      }

      const updated = await CompanySetup.update(current.id, {
        ...payload,
        company_id: Number(companyId),
      })

      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
