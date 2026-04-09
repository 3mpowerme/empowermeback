import { validateAccessToken } from '../utils/jwtValidator.js'
import { UserIdentity } from '../models/userIdentity.model.js'
import { Conceptualization } from '../models/conceptualization.model.js'
import { Company } from '../models/company.model.js'

async function getUserIdFromToken(accessToken) {
  if (!accessToken) throw new Error('accessToken is required')
  const token = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken
  const decoded = await validateAccessToken(token)
  const { userId } = await UserIdentity.getUserIdBySub(decoded.sub)
  return userId
}

export const UserMcpService = {
  async getConceptualizations({ accessToken }) {
    try {
      const userId = await getUserIdFromToken(accessToken)
      const rows = await Conceptualization.getAllByUserId(userId)
      if (!rows || !rows.length) {
        return { ok: true, conceptualizations: [], message: 'No tienes conceptualizaciones aún.' }
      }
      return {
        ok: true,
        conceptualizations: rows.map((row) => ({
          id: row.conceptualization_id || row.id || null,
          about: row.about || null,
          offering_service_type_id: row.offering_service_type_id || null,
          business_sector_id: row.business_sector_id || null,
          region_id: row.region_id || null,
          market_analysis_id: row.market_analysis_id || null,
          brand_book_id: row.brand_book_id || null,
          created_at: row.conceptualization_created_at || row.created_at || null,
        })),
      }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  },

  async getCompany({ accessToken }) {
    try {
      const userId = await getUserIdFromToken(accessToken)
      const rows = await Company.getAll(userId)
      if (!rows || !rows.length) {
        return { ok: true, companies: [], message: 'No tienes empresas registradas aún.' }
      }
      return {
        ok: true,
        companies: rows.map((row) => ({
          id: row.id,
          name: row.name || null,
          created_at: row.created_at || null,
        })),
      }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  },
}
