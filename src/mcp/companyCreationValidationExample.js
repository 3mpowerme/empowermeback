import { CompanyCreationMcpService } from '../services/companyCreationMcp.service.js'

async function main() {
  let draft = {}

  const steps = [
    ['company_identity', { company_name: 'Acme SpA' }],
    ['today_focus', { today_focus: [1] }],
    [
      'offering_and_channels',
      { company_offering: [1], customer_service_channel: [1] },
    ],
    [
      'business_profile',
      {
        business_sector_id: 1,
        business_sector_other: '',
        about: 'Digital services for small businesses.',
      },
    ],
    [
      'location_and_phone',
      {
        region_id: 1,
        street: 'Main Street 123',
        zip_code: '12345',
        phone_number: {
          countryCode: 'CL',
          phone_code: '+56',
          phone: '912345678',
        },
      },
    ],
    ['employees', { has_employees: 'NO' }],
    ['registration_status', { is_registered_company: 'NO' }],
    ['tax_status', { hasStartedActivities: 'NO' }],
    ['marketing_source', { marketing_source: [1] }],
  ]

  for (const [step, input] of steps) {
    const result = CompanyCreationMcpService.mergeDraft({ draft, step, input })
    if (!result.ok) {
      throw new Error(`Step ${step} failed: ${JSON.stringify(result.validationErrors)}`)
    }
    draft = result.draft
  }

  const finalResult = await CompanyCreationMcpService.finalize({
    draft,
    mode: 'dry_run',
  })

  if (!finalResult.ok) {
    throw new Error(`Finalize failed: ${JSON.stringify(finalResult.validationErrors)}`)
  }

  console.log(JSON.stringify(finalResult, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
