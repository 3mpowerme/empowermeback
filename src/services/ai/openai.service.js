import openai from '../../config/openaiClient.js'
import { withTimeout } from '../../utils/utils.js'

export const OpenAI = {
  name: 'openai',

  async generateStructuredJson(prompt, jsonSchema, opts = {}) {
    if (!prompt || typeof prompt !== 'string')
      throw new Error('generateStructuredJson: invalid prompt')
    if (!jsonSchema || typeof jsonSchema !== 'object')
      throw new Error('generateStructuredJson: invalid jsonSchema')

    const {
      model = process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      temperature = 0.3,
      max_output_tokens = 10000,
      timeoutMs = 60000,
      strict = true,
      schemaName = 'structured_json',
    } = opts
    console.log('model', model)
    const req = openai.responses.create({
      model,
      input: prompt,
      text: {
        format: {
          type: 'json_schema',
          name: schemaName,
          schema: jsonSchema,
          strict: true,
        },
      },
      temperature,
      max_output_tokens,
    })

    const res = await withTimeout(req, timeoutMs)

    const text = res.output_text ?? res.output?.[0]?.content?.[0]?.text ?? ''
    if (!text) throw new Error('generateStructuredJson: no resposne')

    let data
    try {
      data = JSON.parse(text)
    } catch {
      try {
        data = JSON.parse(text.trim())
      } catch {
        throw new Error('generateStructuredJson: invalid JSON')
      }
    }

    const usage = {
      input_tokens: res.usage?.input_tokens ?? null,
      output_tokens: res.usage?.output_tokens ?? null,
      total_tokens: res.usage?.total_tokens ?? null,
    }

    return {
      provider: 'openai',
      model: res.model || model,
      data,
      text,
      usage,
      raw: res,
    }
  },
}
