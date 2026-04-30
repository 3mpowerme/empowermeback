#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { CompanyCreationMcpService } from '../services/companyCreationMcp.service.js'
import { ConceptualizationStage1McpService } from '../services/conceptualizationStage1Mcp.service.js'
import { AuthMcpService } from '../services/authMcp.service.js'
import { BrandbookMcpService } from '../services/brandbookMcp.service.js'
import { UserMcpService } from '../services/userMcp.service.js'
import { ConceptualizationPdfMcpService } from '../services/conceptualizationPdfMcp.service.js'
import { PaymentMcpService } from '../services/paymentMcp.service.js'

const server = new McpServer({
  name: 'empowerme-company-creation',
  version: '1.1.0',
})

function asText(result) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  }
}

server.registerTool(
  'auth_signup_email_password',
  {
    title: 'Sign up with email and password',
    description:
      'Creates a Cognito user plus the local EmpowerMe user linkage required for later company creation.',
    inputSchema: {
      email: z.string().email().describe('User email to register.'),
      password: z.string().min(8).describe('Password that satisfies the backend signup policy.'),
      countryCode: z.string().length(2).default('CL').describe('Two-letter ISO country code.'),
    },
  },
  async ({ email, password, countryCode }) => {
    const result = await AuthMcpService.signup({ email, password, countryCode })
    return asText(result)
  }
)

server.registerTool(
  'auth_verify_email_code',
  {
    title: 'Verify email confirmation code',
    description: 'Confirms the Cognito email verification code sent during signup.',
    inputSchema: {
      email: z.string().email().describe('Registered user email.'),
      code: z.string().length(6).describe('Six digit email confirmation code.'),
    },
  },
  async ({ email, code }) => {
    const result = await AuthMcpService.verifyEmail({ email, code })
    return asText(result)
  }
)

server.registerTool(
  'auth_login_email_password',
  {
    title: 'Login with email and password',
    description:
      'Authenticates against Cognito and returns the tokens required to execute company creation.',
    inputSchema: {
      email: z.string().email().describe('Registered user email.'),
      password: z.string().min(8).describe('User password.'),
    },
  },
  async ({ email, password }) => {
    const result = await AuthMcpService.login({ email, password })
    return asText(result)
  }
)

server.registerTool(
  'company_creation_describe_flow',
  {
    title: 'Describe the company creation flow',
    description:
      'Returns the mapped EmpowerMe company creation steps, required fields, catalog dependencies, and frontend step linkage.',
    inputSchema: {},
  },
  async () => {
    return asText({
      stepOrder: CompanyCreationMcpService.stepOrder,
      steps: CompanyCreationMcpService.getStepDefinitions(),
    })
  }
)

server.registerTool(
  'company_creation_get_catalogs',
  {
    title: 'Get company creation catalogs',
    description:
      'Loads one or more company creation catalogs such as today focus, offerings, channels, sectors, regions, countries, and marketing sources.',
    inputSchema: {
      catalogs: z
        .array(z.string())
        .optional()
        .describe('Optional catalog names. Omit to fetch all supported catalogs.'),
    },
  },
  async ({ catalogs }) => {
    const result = await CompanyCreationMcpService.getCatalogs(catalogs || [])
    return asText(result)
  }
)

server.registerTool(
  'company_creation_resolve_catalog_options',
  {
    title: 'Resolve human-friendly catalog values',
    description:
      'Resolves business-oriented option names or ids into canonical backend ids for a specific catalog.',
    inputSchema: {
      catalog: z.string().describe('Catalog name to resolve against.'),
      values: z.array(z.union([z.string(), z.number()])).describe('Human-friendly names or ids to resolve.'),
      allowFreeText: z
        .boolean()
        .optional()
        .describe('Allow unresolved values to pass through as free text.'),
    },
  },
  async ({ catalog, values, allowFreeText }) => {
    const result = await CompanyCreationMcpService.resolveCatalogSelections({
      catalog,
      values,
      allowFreeText: allowFreeText || false,
    })
    return asText(result)
  }
)

server.registerTool(
  'company_creation_save_step',
  {
    title: 'Validate and save one company creation step',
    description:
      'Validates one business step, merges it into a draft, and returns the updated payload preview plus remaining steps.',
    inputSchema: {
      draft: z.record(z.string(), z.any()).optional().describe('Existing MCP draft built from previous steps.'),
      step: z
        .enum([
          'company_identity',
          'today_focus',
          'offering_and_channels',
          'business_profile',
          'location_and_phone',
          'employees',
          'registration_status',
          'tax_status',
          'marketing_source',
        ])
        .describe('Business step to validate and merge.'),
      input: z.record(z.string(), z.any()).describe('Step payload to validate.'),
    },
  },
  async ({ draft, step, input }) => {
    const result = CompanyCreationMcpService.mergeDraft({ draft: draft || {}, step, input })
    return asText(result)
  }
)

server.registerTool(
  'company_creation_finalize',
  {
    title: 'Finalize company creation',
    description:
      'Builds the final payload from the MCP draft, validates it, and either dry-runs or executes the backend company creation controller.',
    inputSchema: {
      draft: z.record(z.string(), z.any()).optional().describe('Draft returned by company_creation_save_step.'),
      payload: z
        .record(z.string(), z.any())
        .optional()
        .describe('Optional direct final payload. If omitted, it is built from the draft.'),
      mode: z
        .enum(['dry_run', 'execute'])
        .default('dry_run')
        .describe('Use dry_run for controlled validation or execute to write through the backend controller.'),
      accessToken: z
        .string()
        .optional()
        .describe('Required only when mode=execute. Must be a valid Cognito access token.'),
    },
  },
  async ({ draft, payload, mode, accessToken }) => {
    const result = await CompanyCreationMcpService.finalize({
      draft: draft || {},
      payload,
      mode,
      accessToken,
    })
    return asText(result)
  }
)

server.registerTool(
  'conceptualization_stage1_describe_flow',
  {
    title: 'Describe conceptualization stage 1',
    description:
      'Returns the mapped conceptualization stage-1 steps, real frontend/backend linkage, and key catalog/id notes up to market analysis.',
    inputSchema: {},
  },
  async () => {
    return asText({
      stepOrder: ConceptualizationStage1McpService.stepOrder,
      steps: ConceptualizationStage1McpService.getStepDefinitions(),
      constants: ConceptualizationStage1McpService.constants,
    })
  }
)

server.registerTool(
  'conceptualization_stage1_get_catalogs',
  {
    title: 'Get conceptualization stage 1 catalogs',
    description:
      'Loads the stage-1 catalogs needed to collect offering service type, business sector, and region.',
    inputSchema: z.object({
      catalogs: z
        .array(z.enum(['offering_service_type', 'business_sector', 'region']))
        .optional()
        .describe('Optional stage-1 catalog names. Omit to fetch all supported catalogs.'),
    }),
  },
  async ({ catalogs }) => {
    const result = await ConceptualizationStage1McpService.getCatalogs(catalogs || [])
    return asText(result)
  }
)

server.registerTool(
  'conceptualization_stage1_resolve_catalog_options',
  {
    title: 'Resolve conceptualization stage 1 catalog values',
    description:
      'Resolves human-friendly stage-1 values into canonical backend ids, with optional free-text business sector support.',
    inputSchema: z.object({
      catalog: z.enum(['offering_service_type', 'business_sector', 'region']),
      values: z.array(z.union([z.string(), z.number()])),
      allowFreeText: z.boolean().optional(),
    }),
  },
  async ({ catalog, values, allowFreeText }) => {
    const result = await ConceptualizationStage1McpService.resolveCatalogSelections({
      catalog,
      values,
      allowFreeText: allowFreeText || false,
    })
    return asText(result)
  }
)

server.registerTool(
  'conceptualization_stage1_create_market_analysis',
  {
    title: 'Create conceptualization stage 1 and market analysis',
    description:
      'Validates the real stage-1 payload, normalizes free-text sector handling, and either dry-runs or executes the backend conceptualization create controller.',
    inputSchema: {
      payload: z.object({
        offering_service_type_id: z.union([z.number().int().positive(), z.array(z.number().int().positive()).min(1)]),
        service_order_id: z.number().int().positive().optional(),
        business_sector_id: z.number().int().positive().optional(),
        business_sector_other: z.string().max(150).optional(),
        region_id: z.number().int().positive(),
        about: z.string().min(10).max(500),
      }),
      mode: z.enum(['dry_run', 'execute']).default('dry_run'),
      accessToken: z.string().optional(),
    },
  },
  async ({ payload, mode, accessToken }) => {
    const result = await ConceptualizationStage1McpService.execute({
      payload,
      mode,
      accessToken,
    })
    return asText(result)
  }
)

server.registerTool(
  'brandbook_get_options',
  {
    title: 'Get brandbook options',
    description: 'Generates brand name, slogan and colorimetry options for a conceptualization using AI. Returns 6 options of each, plus a PNG preview of all color palettes.',
    inputSchema: {
      offering_service_type_id: z.union([z.number().int().positive(), z.array(z.number().int().positive())]).describe('Offering service type id (scalar or array).'),
      business_sector_id: z.number().int().positive().describe('Business sector id.'),
      region_id: z.number().int().positive().describe('Region id.'),
      about: z.string().min(5).max(500).describe('Business idea description.'),
      sessionId: z.string().optional().describe('Session ID for palette preview image generation.'),
    },
  },
  async ({ offering_service_type_id, business_sector_id, region_id, about, sessionId }) => {
    const result = await BrandbookMcpService.getOptions({ offering_service_type_id, business_sector_id, region_id, about, sessionId })
    return asText(result)
  }
)

server.registerTool(
  'brandbook_get_color_palette_preview',
  {
    title: 'Generate color palette preview image',
    description: 'Generates a PNG preview image of color palettes and uploads it to S3. Returns the public URL to the image.',
    inputSchema: {
      colorimetries: z.array(
        z.object({
          name: z.string().optional(),
          label: z.string().optional(),
          colors: z.array(z.string().regex(/^#[0-9a-f]{6}$/i)).min(1),
        })
      ).min(1).max(10).describe('Array of color palettes with color arrays.'),
      sessionId: z.string().describe('Session ID for organizing uploaded images.'),
    },
  },
  async ({ colorimetries, sessionId }) => {
    const result = await BrandbookMcpService.getColorPalettePreview({ colorimetries, sessionId })
    return asText(result)
  }
)

server.registerTool(
  'brandbook_create',
  {
    title: 'Create brandbook',
    description: 'Creates a brandbook with AI-generated logos based on selected brand name, slogan, colorimetry and logo type.',
    inputSchema: {
      brand_name: z.string().min(1).max(500).describe('Selected brand name.'),
      slogan: z.string().min(1).max(500).describe('Selected slogan.'),
      logo_type: z.enum(['Basado en iconos', 'Basado en nombre', 'Basado en inicial']).describe('Logo type.'),
      colorimetry: z.array(z.string()).min(1).describe('Array of hex color codes.'),
      colorimetry_name: z.string().min(1).describe('Name of the selected colorimetry.'),
      conceptualization_id: z.number().int().positive().describe('Conceptualization id from stage 1.'),
      accessToken: z.string().describe('User JWT access token.'),
    },
  },
  async ({ brand_name, slogan, logo_type, colorimetry, colorimetry_name, conceptualization_id, accessToken }) => {
    const result = await BrandbookMcpService.create({ brand_name, slogan, logo_type, colorimetry, colorimetry_name, conceptualization_id, accessToken })
    return asText(result)
  }
)

server.registerTool(
  'brandbook_select_logo',
  {
    title: 'Select favorite logo',
    description: 'Saves the user\'s chosen logo for a brandbook.',
    inputSchema: {
      brand_book_id: z.number().int().positive().describe('Brandbook id.'),
      logo_id: z.number().int().positive().describe('Selected logo id.'),
    },
  },
  async ({ brand_book_id, logo_id }) => {
    const result = await BrandbookMcpService.selectLogo({ brand_book_id, logo_id })
    return asText(result)
  }
)

server.registerTool(
  'user_get_conceptualizations',
  {
    title: 'Get user conceptualizations',
    description: 'Returns all conceptualizations belonging to the authenticated user.',
    inputSchema: {
      accessToken: z.string().describe('User JWT access token.'),
    },
  },
  async ({ accessToken }) => {
    const result = await UserMcpService.getConceptualizations({ accessToken })
    return asText(result)
  }
)

server.registerTool(
  'user_get_company',
  {
    title: 'Get user company',
    description: 'Returns the companies belonging to the authenticated user.',
    inputSchema: {
      accessToken: z.string().describe('User JWT access token.'),
    },
  },
  async ({ accessToken }) => {
    const result = await UserMcpService.getCompany({ accessToken })
    return asText(result)
  }
)

server.registerTool(
  'payment_create_checkout',
  {
    title: 'Create Stripe Checkout Session for conceptualization',
    description: 'Creates a service order and a Stripe Checkout Session for conceptualization payment. Returns the checkout URL and the service order ID.',
    inputSchema: {
      accessToken: z.string().describe('User JWT access token.'),
    },
  },
  async ({ accessToken }) => {
    const result = await PaymentMcpService.createCheckout({ accessToken })
    return asText(result)
  }
)

server.registerTool(
  'payment_check_status',
  {
    title: 'Check payment status for a service order',
    description: 'Returns the current payment status of a service order: pending_payment, paid, or failed.',
    inputSchema: {
      serviceOrderId: z.number().int().positive().describe('Service order ID to check.'),
    },
  },
  async ({ serviceOrderId }) => {
    const result = await PaymentMcpService.checkStatus({ serviceOrderId })
    return asText(result)
  }
)

server.registerTool(
  'conceptualization_generate_official_pdf',
  {
    title: 'Generate official conceptualization PDF',
    description: 'Generates and persists the official PDF artifact for a conceptualization.',
    inputSchema: {
      conceptualizationId: z.number().int().positive().describe('Conceptualization id.'),
      accessToken: z.string().describe('User JWT access token.'),
      authState: z.any().optional().describe('Optional frontend-like auth state used for headless rendering.'),
    },
  },
  async ({ conceptualizationId, accessToken, authState }) => {
    const result = await ConceptualizationPdfMcpService.generate({ conceptualizationId, accessToken, authState })
    return asText(result)
  }
)

server.registerTool(
  'conceptualization_get_official_pdf_download_url',
  {
    title: 'Get official conceptualization PDF download URL',
    description: 'Returns the signed download URL for the official conceptualization PDF when available.',
    inputSchema: {
      conceptualizationId: z.number().int().positive().describe('Conceptualization id.'),
    },
  },
  async ({ conceptualizationId }) => {
    const result = await ConceptualizationPdfMcpService.getDownloadUrl({ conceptualizationId })
    return asText(result)
  }
)

async function runSingleToolCall() {
  const idx = process.argv.indexOf('--tool-call')
  if (idx === -1) return false

  const raw = process.argv[idx + 1]
  const payload = raw ? JSON.parse(raw) : {}
  const name = payload.name
  const args = payload.arguments || {}

  const handlers = {
    auth_signup_email_password: ({ email, password, countryCode }) => AuthMcpService.signup({ email, password, countryCode }),
    auth_verify_email_code: ({ email, code }) => AuthMcpService.verifyEmail({ email, code }),
    auth_login_email_password: ({ email, password }) => AuthMcpService.login({ email, password }),
    conceptualization_stage1_get_catalogs: ({ catalogs }) => ConceptualizationStage1McpService.getCatalogs(catalogs || []),
    conceptualization_stage1_resolve_catalog_options: ({ catalog, values, allowFreeText }) => ConceptualizationStage1McpService.resolveCatalogSelections({ catalog, values, allowFreeText: allowFreeText || false }),
    conceptualization_stage1_create_market_analysis: ({ payload, mode, accessToken }) => ConceptualizationStage1McpService.execute({ payload, mode, accessToken }),
    brandbook_get_options: ({ offering_service_type_id, business_sector_id, region_id, about, sessionId }) => BrandbookMcpService.getOptions({ offering_service_type_id, business_sector_id, region_id, about, sessionId }),
    brandbook_create: ({ brand_name, slogan, logo_type, colorimetry, colorimetry_name, conceptualization_id, accessToken }) => BrandbookMcpService.create({ brand_name, slogan, logo_type, colorimetry, colorimetry_name, conceptualization_id, accessToken }),
    brandbook_select_logo: ({ brand_book_id, logo_id }) => BrandbookMcpService.selectLogo({ brand_book_id, logo_id }),
    user_get_conceptualizations: ({ accessToken }) => UserMcpService.getConceptualizations({ accessToken }),
    user_get_company: ({ accessToken }) => UserMcpService.getCompany({ accessToken }),
    payment_create_checkout: ({ accessToken }) => PaymentMcpService.createCheckout({ accessToken }),
    payment_check_status: ({ serviceOrderId }) => PaymentMcpService.checkStatus({ serviceOrderId }),
    conceptualization_generate_official_pdf: ({ conceptualizationId, accessToken, authState }) => ConceptualizationPdfMcpService.generate({ conceptualizationId, accessToken, authState }),
    conceptualization_get_official_pdf_download_url: ({ conceptualizationId }) => ConceptualizationPdfMcpService.getDownloadUrl({ conceptualizationId }),
  }

  if (!handlers[name]) {
    console.log(JSON.stringify({ ok: false, error: `Unknown tool: ${name}` }))
    process.exit(1)
  }

  try {
    const result = await handlers[name](args)
    console.log(JSON.stringify(result))
    process.exit(0)
  } catch (error) {
    console.log(JSON.stringify({ ok: false, error: error?.message || 'Tool execution failed' }))
    process.exit(1)
  }
}

if (!(await runSingleToolCall())) {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}
