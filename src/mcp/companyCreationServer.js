#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { CompanyCreationMcpService } from '../services/companyCreationMcp.service.js'
import { AuthMcpService } from '../services/authMcp.service.js'

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
    structuredContent: result,
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

const transport = new StdioServerTransport()
await server.connect(transport)
