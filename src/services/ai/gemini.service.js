import gemini from '../../config/geminiClient.js'

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
  throw new Error('Gemini.generateStructured: no se pudo parsear JSON')
}

async function validateIfRequested(schema, data, validate) {
  if (!validate) return
  const { default: Ajv } = await import('ajv')
  const ajv = new Ajv({ allErrors: true, strict: false })
  const ok = ajv.validate(schema, data)
  if (!ok) {
    const msg = ajv.errors
      ?.map((e) => `${e.instancePath || '/'} ${e.message}`)
      .join('; ')
    throw new Error(`Gemini.generateStructured: JSON no cumple schema: ${msg}`)
  }
}

export const Gemini = {
  name: 'gemini',

  async generateStructuredJson(prompt, jsonSchema, opts = {}) {
    if (!prompt || typeof prompt !== 'string')
      throw new Error('generateStructuredJson: invalid prompt')
    if (!jsonSchema || typeof jsonSchema !== 'object')
      throw new Error('generateStructuredJson: invalid jsonSchema')

    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
    const model = gemini.getGenerativeModel({ model: modelName })

    const res = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: opts.temperature ?? 0.3,
        maxOutputTokens: opts.max_output_tokens ?? 4000,
        responseMimeType: 'application/json',
        responseSchema: jsonSchema,
      },
    })

    const rawText = res.response?.text() ?? ''
    if (!rawText) throw new Error('generateStructuredJson: no response')

    const data = extractJson(rawText)
    await validateIfRequested(jsonSchema, data, opts.validate)

    const meta = res.response?.usageMetadata || {}
    const usage = {
      input_tokens: meta.promptTokenCount ?? null,
      output_tokens: meta.candidatesTokenCount ?? null,
      total_tokens: meta.totalTokenCount ?? null,
      estimated_cost_usd: null,
    }

    return {
      provider: 'gemini',
      model: modelName,
      data,
      text: rawText,
      usage,
      raw: res,
    }
  },
}
