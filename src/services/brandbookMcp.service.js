import { validateAccessToken } from '../utils/jwtValidator.js'
import { ConceptualizationController } from '../controllers/conceptualization/conceptualization.controller.js'
import { generatePalettePreviewImage } from '../utils/brandbookPaletteGenerator.js'

const LOGO_TYPES = [
  { label: 'Basado en iconos', value: 'Basado en iconos' },
  { label: 'Basado en nombre', value: 'Basado en nombre' },
  { label: 'Basado en inicial', value: 'Basado en inicial' },
]

function buildMockRes() {
  const res = {
    _status: null,
    _body: null,
    status(code) { this._status = code; return this },
    json(body) { this._body = body; return this },
  }
  return res
}

function buildMockReq({ body = {}, user = null } = {}) {
  return { body, user }
}

export const BrandbookMcpService = {
  logoTypes: LOGO_TYPES,

  async selectLogo({ brand_book_id, logo_id }) {
    const req = buildMockReq({
      body: { logo_id },
      user: null,
    })
    req.params = { id: String(brand_book_id) }
    const res = buildMockRes()

    await ConceptualizationController.updateLogoBrandBook(req, res)

    if (res._status && res._status !== 200) {
      return {
        ok: false,
        error: res._body?.error || `Backend returned status ${res._status}`,
      }
    }

    return { ok: true, updated: res._body }
  },

  async getOptions({ offering_service_type_id, business_sector_id, region_id, about, sessionId }) {
    const req = buildMockReq({
      body: {
        offering_service_type_id: Array.isArray(offering_service_type_id)
          ? offering_service_type_id
          : [offering_service_type_id],
        business_sector_id,
        region_id,
        about,
      },
    })
    const res = buildMockRes()

    await ConceptualizationController.getBrandBookOptions(req, res)

    if (res._status !== 201) {
      return {
        ok: false,
        error: res._body?.error || `Backend returned status ${res._status}`,
      }
    }

    const result = {
      ok: true,
      brandNames: res._body.brandNames || [],
      slogans: res._body.slogans || [],
      colorimetries: res._body.colorimetries || [],
    }

    // Imagen se genera localmente en OpenClaw - no se genera en backend

    return result
  },

  async getColorPalettePreview({ colorimetries, sessionId }) {
    if (!sessionId) {
      return { ok: false, error: 'sessionId is required' }
    }

    try {
      const result = await generatePalettePreviewImage(colorimetries, sessionId)
      return result
    } catch (error) {
      return { ok: false, error: error.message }
    }
  },

  async create({ brand_name, slogan, logo_type, colorimetry, colorimetry_name, conceptualization_id, accessToken }) {
    let user = null
    if (accessToken) {
      try {
        const token = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken
        const decoded = await validateAccessToken(token)
        user = decoded
      } catch (err) {
        return { ok: false, error: `Invalid access token: ${err.message}` }
      }
    }

    const req = buildMockReq({
      body: {
        brand_name,
        slogan,
        logo_type,
        colorimetry: Array.isArray(colorimetry) ? colorimetry : [],
        colorimetry_name,
        conceptualization_id,
      },
      user,
    })
    const res = buildMockRes()

    await ConceptualizationController.createBrandBook(req, res)

    if (res._status !== 201) {
      return {
        ok: false,
        error: res._body?.error || `Backend returned status ${res._status}`,
      }
    }

    return {
      ok: true,
      brand_book_id: res._body.brand_book_id,
      logos: res._body.logos || [],
    }
  },
}
