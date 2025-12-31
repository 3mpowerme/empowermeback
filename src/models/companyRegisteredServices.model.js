import db from '../config/db.js'
import { Billing } from './billing.model.js'
import { Service } from './service.model.js'
import { Subscription } from './subscription.model.js'

export const CompanyRegisteredServices = {
  async getAllByPage(companyId, page) {
    switch (page) {
      case 'invoice_and_accounting':
        const registeredServices =
          await this.getRegisteredServicesForInvoiceAndAccounting(companyId)
        const paidServices =
          await this.getPaidServicesForInvoiceAndAccounting(companyId)
        return {
          registeredServices,
          paidServices,
          needsDocuments: {
            accounting: true,
          },
        }
      case 'legal_services':
        const registeredServices2 =
          await this.getRegisteredServicesForLegalServices(companyId)
        const paidServices2 =
          await this.getPaidServicesForLegalServices(companyId)
        return {
          registeredServices: registeredServices2,
          paidServices: paidServices2,
          needsDocuments: {
            accounting: true,
          },
        }
      case 'build_company':
        const registeredServices3 =
          await this.getRegisteredServicesForBuildCompany(companyId)
        const paidServices3 =
          await this.getPaidServicesForBuildCompany(companyId)
        return {
          registeredServices: registeredServices3,
          paidServices: paidServices3,
          needsDocuments: {
            accounting: true,
          },
        }
      case 'home':
        const registeredServices4 =
          await this.getRegisteredServicesForHome(companyId)
        const paidServices4 = await this.getPaidServicesForHome(companyId)
        return {
          registeredServices: registeredServices4,
          paidServices: paidServices4,
          needsDocuments: {
            accounting: true,
          },
        }
    }
  },
  async getRegisteredServicesForInvoiceAndAccounting(companyId) {
    const [accounting_client_intakes_rows] = await db.query(
      'SELECT * FROM accounting_client_intakes where company_id = ?',
      [companyId]
    )
    const [audit_process_intakes_rows] = await db.query(
      'SELECT * FROM audit_process_intakes where company_id = ?',
      [companyId]
    )
    const [balance_preparation_intakes_rows] = await db.query(
      'SELECT * FROM balance_preparation_intakes where company_id = ?',
      [companyId]
    )
    const [company_monthly_accounting_required_documents_rows] = await db.query(
      'SELECT * FROM company_monthly_accounting_required_documents where company_id = ?',
      [companyId]
    )

    const [virtual_office_contract_intakes_rows] = await db.query(
      'SELECT * FROM virtual_office_contract_intakes where company_id = ? and service_id=16',
      [companyId]
    )

    const [virtual_office_plus_ministorage_contract_intakes_rows] =
      await db.query(
        'SELECT * FROM virtual_office_contract_intakes where company_id = ? and service_id=15',
        [companyId]
      )

    const tax_planning_intakes_rows = [] // tax planning
    return {
      accounting: accounting_client_intakes_rows.length > 0,
      start_activities:
        company_monthly_accounting_required_documents_rows.length > 0,
      audit: audit_process_intakes_rows.length > 0,
      balance: balance_preparation_intakes_rows.length > 0,
      tax_planning: tax_planning_intakes_rows.length > 0,
      remunerations: false,
      virtual_office: virtual_office_contract_intakes_rows.length > 0,
      virtual_office_plus_ministorage:
        virtual_office_plus_ministorage_contract_intakes_rows.length > 0,
    }
  },
  async getPaidServicesForInvoiceAndAccounting(companyId) {
    const service = await Service.getByCode('accounting')
    console.log('service', service)
    const accounting_client_intakes =
      await Subscription.hasActiveSubscriptionForService(companyId, service.id)
    console.log('accounting_client_intakes', accounting_client_intakes)
    const audit_process_intakes_rows =
      await Billing.getServiceOrderByServiceCode('audit')
    const balance_preparation_intakes_rows =
      await Billing.getServiceOrderByServiceCode('balance')
    const tax_planning_intakes_rows =
      await Billing.getServiceOrderByServiceCode('tax_planning')
    const remunerations_intakes_rows =
      await Billing.getServiceOrderByServiceCode('remunerations')
    const virtual_office_contract_intakes_rows =
      await Billing.getServiceOrderByServiceCode('virtual_office')
    const virtual_office_plus_ministorage_contract_intakes_rows =
      await Billing.getServiceOrderByServiceCode(
        'virtual_office_plus_ministorage'
      )
    const [company_monthly_accounting_required_documents_rows] = await db.query(
      'SELECT * FROM company_monthly_accounting_required_documents where company_id = ?',
      [companyId]
    )
    return {
      accounting: accounting_client_intakes,
      start_activities:
        company_monthly_accounting_required_documents_rows.length > 0,
      audit: audit_process_intakes_rows.length > 0,
      balance: balance_preparation_intakes_rows.length > 0,
      tax_planning: tax_planning_intakes_rows.length > 0,
      remunerations: remunerations_intakes_rows.length > 0,
      virtual_office: virtual_office_contract_intakes_rows.length > 0,
      virtual_office_plus_ministorage:
        virtual_office_plus_ministorage_contract_intakes_rows.length > 0,
    }
  },

  async getRegisteredServicesForLegalServices(companyId) {
    const [dissolution_of_srl_company_intakes_rows] = await db.query(
      'SELECT * FROM dissolution_company_intakes where company_id = ? and service_id=14',
      [companyId]
    )
    const [dissolution_of_eirl_company_intakes_rows] = await db.query(
      'SELECT * FROM dissolution_company_intakes where company_id = ? and service_id=13',
      [companyId]
    )
    const [dissolution_of_spa_company_intakes_rows] = await db.query(
      'SELECT * FROM dissolution_company_intakes where company_id = ? and service_id=12',
      [companyId]
    )

    const [constitution_review_intakes_rows] = await db.query(
      'SELECT * FROM constitution_review_intakes where company_id = ?',
      [companyId]
    )

    const [shareholders_registry_intakes_rows] = await db.query(
      'SELECT * FROM shareholder_registry_intakes where company_id = ?',
      [companyId]
    )

    const [ordinary_shareholders_meeting_rows] = await db.query(
      'SELECT * FROM ordinary_shareholders_meeting_intakes  where company_id = ?',
      [companyId]
    )

    const [company_modifications_spa_rows] = await db.query(
      'SELECT * FROM company_modifications_intakes  where company_id = ? and service_id=19',
      [companyId]
    )

    const [company_modifications_srl_rows] = await db.query(
      'SELECT * FROM company_modifications_intakes  where company_id = ? and service_id=20',
      [companyId]
    )

    const personalized_advisory_intakes_rows =
      await Billing.getServiceOrderByServiceCode('personalized_advisory')

    return {
      dissolution_of_srl: dissolution_of_srl_company_intakes_rows.length > 0,
      dissolution_of_eirl: dissolution_of_eirl_company_intakes_rows.length > 0,
      dissolution_of_spa: dissolution_of_spa_company_intakes_rows.length > 0,
      constitution_review: constitution_review_intakes_rows.length > 0,
      shareholders_registry: shareholders_registry_intakes_rows.length > 0,
      personalized_advisory: personalized_advisory_intakes_rows.length > 0,
      ordinary_shareholders_meeting:
        ordinary_shareholders_meeting_rows.length > 0,
      company_modifications_spa: company_modifications_spa_rows.length > 0,
      company_modifications_srl: company_modifications_srl_rows.length > 0,
    }
  },

  async getPaidServicesForLegalServices(companyId) {
    const dissolution_of_srl_company_intakes_rows =
      await Billing.getServiceOrderByServiceCode('dissolution_of_srl')
    const dissolution_of_eirl_company_intakes_rows =
      await Billing.getServiceOrderByServiceCode('dissolution_of_eirl')
    const dissolution_of_spa_company_intakes_rows =
      await Billing.getServiceOrderByServiceCode('dissolution_of_spa')
    const constitution_review_intakes_rows =
      await Billing.getServiceOrderByServiceCode('constitution_review')
    const shareholders_registry_intakes_rows =
      await Billing.getServiceOrderByServiceCode('shareholders_registry')
    const business_orientation_intakes_rows =
      await Billing.getServiceOrderByServiceCode('business_orientation')
    const personalized_advisory_intakes_rows =
      await Billing.getServiceOrderByServiceCode('personalized_advisory')
    const ordinary_shareholders_meeting_intakes_rows =
      await Billing.getServiceOrderByServiceCode(
        'ordinary_shareholders_meeting'
      )
    const company_modifications_spa_intakes_rows =
      await Billing.getServiceOrderByServiceCode('company_modifications_spa')
    const company_modifications_srl_intakes_rows =
      await Billing.getServiceOrderByServiceCode('company_modifications_srl')

    return {
      dissolution_of_srl: dissolution_of_srl_company_intakes_rows.length > 0,
      dissolution_of_eirl: dissolution_of_eirl_company_intakes_rows.length > 0,
      dissolution_of_spa: dissolution_of_spa_company_intakes_rows.length > 0,
      constitution_review: constitution_review_intakes_rows.length > 0,
      shareholders_registry: shareholders_registry_intakes_rows.length > 0,
      business_orientation: business_orientation_intakes_rows.length > 0,
      personalized_advisory: personalized_advisory_intakes_rows.length > 0,
      ordinary_shareholders_meeting:
        ordinary_shareholders_meeting_intakes_rows.length > 0,
      company_modifications_spa:
        company_modifications_spa_intakes_rows.length > 0,
      company_modifications_srl:
        company_modifications_srl_intakes_rows.length > 0,
    }
  },

  async getRegisteredServicesForBuildCompany() {
    const business_creation_intakes_rows =
      await Billing.getServiceOrderByServiceCode('business_creation')
    return {
      business_creation: business_creation_intakes_rows.length > 0,
    }
  },

  async getPaidServicesForBuildCompany(companyId) {
    const business_creation_intakes_rows =
      await Billing.getServiceOrderByServiceCode('business_creation')
    return {
      business_creation: business_creation_intakes_rows.length > 0,
    }
  },

  async getRegisteredServicesForHome(companyId) {
    const [accounting_client_intakes_rows] = await db.query(
      'SELECT * FROM accounting_client_intakes where company_id = ?',
      [companyId]
    )

    const [balance_preparation_intakes_rows] = await db.query(
      'SELECT * FROM balance_preparation_intakes where company_id = ?',
      [companyId]
    )
    const business_creation_intakes_rows =
      await Billing.getServiceOrderByServiceCode('business_creation')
    return {
      accounting: accounting_client_intakes_rows.length > 0,
      business_creation: business_creation_intakes_rows.length > 0,
      balance: balance_preparation_intakes_rows.length > 0,
    }
  },
  async getPaidServicesForHome(companyId) {
    const service = await Service.getByCode('accounting')
    console.log('service', service)
    const accounting_client_intakes =
      await Subscription.hasActiveSubscriptionForService(companyId, service.id)
    console.log('accounting_client_intakes', accounting_client_intakes)
    const business_creation_intakes_rows =
      await Billing.getServiceOrderByServiceCode('business_creation')
    const balance_preparation_intakes_rows =
      await Billing.getServiceOrderByServiceCode('balance')

    return {
      accounting: accounting_client_intakes,
      business_creation: business_creation_intakes_rows.length > 0,
      balance: balance_preparation_intakes_rows.length > 0,
    }
  },
}
