#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { CompanyCreationMcpService } from '../services/companyCreationMcp.service.js'

const server = new McpServer({
  name: 'empowerme-company-creation',
  version: '1.0.0',
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
