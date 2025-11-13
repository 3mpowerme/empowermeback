import { Gemini } from './gemini.service.js'
import { OpenAI } from './openai.service.js'

const REGISTRY = {
  openai: OpenAI,
  gemini: Gemini,
}

export function createAIProvider(options = {}) {
  const key = (
    options.provider ||
    process.env.AI_PROVIDER ||
    'openai'
  ).toLowerCase()
  const provider = REGISTRY[key]
  if (!provider) throw new Error(`IA provider not supported: ${key}`)
  return provider
}

export async function generateStructuredJson(prompt, jsonSchema, options = {}) {
  const provider = createAIProvider(options)
  return provider.generateStructuredJson(prompt, jsonSchema, options)
}
