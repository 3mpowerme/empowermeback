import { ConceptualizationPdfService } from './conceptualizationPdf.service.js'

export const ConceptualizationPdfMcpService = {
  async generate({ conceptualizationId, accessToken, authState }) {
    return ConceptualizationPdfService.generateOfficialPdf({ conceptualizationId, accessToken, authState })
  },

  async get({ conceptualizationId }) {
    const artifact = await ConceptualizationPdfService.getArtifact(conceptualizationId)
    return { ok: true, artifact }
  },

  async getDownloadUrl({ conceptualizationId }) {
    return ConceptualizationPdfService.getDownloadUrl(conceptualizationId)
  },
}
