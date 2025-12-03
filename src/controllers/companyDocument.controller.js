import { CompanyDocument } from '../models/companyDocument.model.js'
import { DocumentComment } from '../models/documentComment.model.js'
import { UserIdentity } from '../models/userIdentity.model.js'

export const CompanyDocumentController = {
  async list(req, res) {
    try {
      const companyId = Number(req.params.companyId)
      const limit = Number(req.query.limit) || 50
      const offset = Number(req.query.offset) || 0

      const documents = await CompanyDocument.findByCompany(
        companyId,
        limit,
        offset
      )

      res.json({ documents })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to list documents' })
    }
  },

  async getOne(req, res) {
    try {
      const companyId = Number(req.params.companyId)
      const documentId = Number(req.params.documentId)

      const document = await CompanyDocument.getById(documentId, companyId)
      if (!document) {
        return res.status(404).json({ error: 'Document not found' })
      }

      const comments = await DocumentComment.findByDocument(
        documentId,
        companyId,
        100,
        0
      )

      res.json({ document, comments })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to get document' })
    }
  },

  async listComments(req, res) {
    try {
      const companyId = Number(req.params.companyId)
      const documentId = Number(req.params.documentId)
      const limit = Number(req.query.limit) || 50
      const offset = Number(req.query.offset) || 0

      const comments = await DocumentComment.findByDocument(
        documentId,
        companyId,
        limit,
        offset
      )

      res.json({ comments })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to list comments' })
    }
  },

  async addComment(req, res) {
    try {
      const companyId = Number(req.params.companyId)
      const documentId = Number(req.params.documentId)
      const { comment } = req.body

      const document = await CompanyDocument.getById(documentId, companyId)
      if (!document) {
        return res.status(404).json({ error: 'Document not found' })
      }

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)

      const created = await DocumentComment.create(
        documentId,
        companyId,
        userId,
        comment
      )

      res.status(201).json({ comment: created })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to add comment' })
    }
  },
}
