import anthropic from '../../config/anthropicClient.js'
import { withTimeout } from '../../utils/utils.js'

function extractJson(str) {
  try {
    return JSON.parse(str)
  } catch {}
  const m =
    str.match(/```json\s*([\s\S]*?)```/i) || str.match(/```\s*([\s\S]*?)```/i)
  if (m) {
    try {
      return JSON.parse(m[1])
    } catch {}
  }
  try {
    return JSON.parse(str.trim())
  } catch {}
  throw new Error(
    'Claude.generateStructuredJson: could not parse JSON response'
  )
}

/**
 * Strip properties not supported by Claude's tool input schema
 * Claude tool input_schema does not accept 'title' at the root level
 */
function prepareToolSchema(jsonSchema) {
  const { title: _title, ...schema } = jsonSchema
  return schema
}

export const Claude = {
  name: 'claude',

  async generateStructuredJson(prompt, jsonSchema, opts = {}) {
    if (!prompt || typeof prompt !== 'string')
      throw new Error('generateStructuredJson: invalid prompt')
    if (!jsonSchema || typeof jsonSchema !== 'object')
      throw new Error('generateStructuredJson: invalid jsonSchema')

    const {
      model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
      temperature = 0.3,
      max_output_tokens = 16000,
      timeoutMs = 300000,
      schemaName = 'structured_json',
    } = opts

    const toolSchema = prepareToolSchema(jsonSchema)

    const req = anthropic.messages.create({
      model,
      max_tokens: max_output_tokens,
      temperature,
      tools: [
        {
          name: schemaName,
          description:
            'Generate structured JSON analysis following the provided schema exactly.',
          input_schema: toolSchema,
        },
      ],
      tool_choice: { type: 'tool', name: schemaName },
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const response = await withTimeout(req, timeoutMs)

    // Extract tool use block
    const toolUseBlock = response.content?.find((b) => b.type === 'tool_use')
    if (toolUseBlock?.input) {
      const data = toolUseBlock.input
      const usage = response.usage
        ? {
            input_tokens: response.usage.input_tokens,
            output_tokens: response.usage.output_tokens,
            total_tokens:
              (response.usage.input_tokens || 0) +
              (response.usage.output_tokens || 0),
          }
        : {}
      return { data, usage }
    }

    // Fallback: try to extract JSON from text block
    const textBlock = response.content?.find((b) => b.type === 'text')
    if (textBlock?.text) {
      const data = extractJson(textBlock.text)
      return { data, usage: {} }
    }

    throw new Error('Claude.generateStructuredJson: no valid response content')
  },
}
