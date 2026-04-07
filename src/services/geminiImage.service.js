const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL || 'gemini-2.0-flash-exp-image-generation'

function extractBase64Images(responseJson) {
  const parts = responseJson?.candidates?.flatMap((candidate) => candidate?.content?.parts || []) || []
  return parts
    .map((part) => part?.inlineData?.data || null)
    .filter(Boolean)
}

export const GeminiImageService = {
  async generateImages({ prompt, count = 1, mimeType = 'image/png' }) {
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is required')
    const images = []

    for (let i = 0; i < count; i++) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
          }),
        }
      )

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Gemini image generation failed: ${response.status} ${text}`)
      }

      const json = await response.json()
      const base64Images = extractBase64Images(json)
      if (!base64Images.length) {
        throw new Error('Gemini did not return any image data')
      }

      images.push({ b64_json: base64Images[0], mimeType })
    }

    return { data: images }
  },
}
