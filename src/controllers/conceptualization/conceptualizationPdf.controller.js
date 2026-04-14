import { UserIdentity } from '../../models/userIdentity.model.js'
import { Conceptualization } from '../../models/conceptualization.model.js'
import { ConceptualizationPdfService } from '../../services/conceptualizationPdf.service.js'

async function getOwnedConceptualization(req, conceptualizationId) {
  const sub = req.user.sub
  const { userId } = await UserIdentity.getUserIdBySub(sub)
  const conceptualizations = await Conceptualization.getAllByUserId(userId)
  return conceptualizations.find(
    (row) => Number(row.conceptualization_id) === Number(conceptualizationId)
  )
}

export const ConceptualizationPdfController = {
  async getOwnedConceptualization(req, res) {
    try {
      const { id } = req.params
      const conceptualization = await getOwnedConceptualization(req, id)
      if (!conceptualization) {
        return res.status(404).json({ error: 'Conceptualization not found' })
      }
      return res.json({ conceptualization })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },

  async generateOfficialPdf(req, res) {
    try {
      const { id } = req.params
      const conceptualization = await getOwnedConceptualization(req, id)
      if (!conceptualization) {
        return res.status(404).json({ error: 'Conceptualization not found' })
      }

      const authHeader = req.headers.authorization || ''
      const accessToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
      const result = await ConceptualizationPdfService.generateOfficialPdf({ conceptualizationId: id, accessToken })
      return res.status(202).json(result)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },

  async getOfficialPdf(req, res) {
    try {
      const { id } = req.params
      const conceptualization = await getOwnedConceptualization(req, id)
      if (!conceptualization) {
        return res.status(404).json({ error: 'Conceptualization not found' })
      }

      const artifact = await ConceptualizationPdfService.getArtifact(id)
      return res.json({ artifact })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },

  async getOfficialPdfDownloadUrl(req, res) {
    try {
      const { id } = req.params
      const conceptualization = await getOwnedConceptualization(req, id)
      if (!conceptualization) {
        return res.status(404).json({ error: 'Conceptualization not found' })
      }

      const result = await ConceptualizationPdfService.getDownloadUrl(id)
      if (!result.ok) {
        return res.status(404).json({ error: result.error, artifact: result.artifact })
      }

      return res.json({ artifact: result.artifact, download_url: result.download_url })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },
}
