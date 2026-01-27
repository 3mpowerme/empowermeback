import db from '../config/db.js'
import { CompanyDocument } from '../models/companyDocument.model.js'
import { DocumentComment } from '../models/documentComment.model.js'
import { Service } from '../models/service.model.js'
import { UserIdentity } from '../models/userIdentity.model.js'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const REGION = process.env.COGNITO_REGION
const BUCKET = process.env.AWS_S3_BUCKET_DOCUMENTS

const safeName = (name) =>
  String(name)
    .toLowerCase()
    .replace(/[^\w.\-]+/g, '-')

const buildObjectUrl = (bucket, region, key) =>
  `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, '/')}`

export const CompanyDocumentController = {
  async list(req, res) {
    try {
      const { serviceCode } = req.params
      const service = await Service.getByCode(serviceCode)
      const companyId = Number(req.params.companyId)
      const limit = Number(req.query.limit) || 50
      const offset = Number(req.query.offset) || 0

      const documents = await CompanyDocument.findByCompany(
        companyId,
        service.id,
        limit,
        offset
      )

      res.json({ documents })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to list documents' })
    }
  },

  async upload(req, res) {
    try {
      const { serviceCode, isExecutive } = req.params
      const companyId = Number(req.params.companyId)

      const service = await Service.getByCode(serviceCode)
      if (!service) return res.status(404).json({ error: 'ServiceNotFound' })

      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'ValidationError', details: ['file is required'] })
      }

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)

      const originalName = req.file.originalname || 'file'
      const fileName = safeName(originalName)
      const key = `company-documents/${companyId}/${service.id}/${Date.now()}-${fileName}`

      await s3
        .upload({
          Bucket: BUCKET,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype || 'application/octet-stream',
        })
        .promise()

      const created = await CompanyDocument.create({
        company_id: companyId,
        service_id: service.id,
        name: originalName,
        storage_key: key,
        mime_type: req.file.mimetype || null,
        size_bytes: req.file.size || null,
        uploaded_by_user_id: userId,
      })

      /**
       * Notification Part
       */
      await db.query(
        ` INSERT INTO company_notifications (company_id, title, message, type, metadata)
VALUES (
  ?,
  'Nuevo documento disponible',
  'Tienes un nuevo documento en tu repositorio, da clic para verlo',
  'info',
  JSON_OBJECT(
    'type', 'document',
    'documentId', ${created.id}
  )
)`,
        [companyId]
      )

      res.status(201).json({
        document: {
          ...created,
          object_url: buildObjectUrl(BUCKET, REGION, key),
        },
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to upload document' })
    }
  },

  async getViewUrl(req, res) {
    try {
      const { serviceCode } = req.params
      const companyId = Number(req.params.companyId)
      const fileId = Number(req.params.fileId || req.params.documentId)

      const service = await Service.getByCode(serviceCode)
      if (!service) return res.status(404).json({ error: 'ServiceNotFound' })

      const doc = await CompanyDocument.getById(fileId, companyId, service.id)
      if (!doc) return res.status(404).json({ error: 'DocumentNotFound' })

      const params = {
        Bucket: BUCKET,
        Key: doc.storage_key,
        Expires: 900,
      }

      const view_url = s3.getSignedUrl('getObject', params)
      res.json({ view_url })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to get view url' })
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
      const documentId = Number(req.params.fileId || req.params.documentId)
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
      const documentId = Number(req.params.fileId || req.params.documentId)
      const { comment, isExecutive } = req.body

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
      /**
       * Notification Part
       */
      await db.query(
        ` INSERT INTO company_notifications (company_id, title, message, type, metadata)
VALUES (
  ?,
  'Nuevo comentario en documento',
  'Tienes un nuevo comentario, da clic para verlo',
  'info',
  JSON_OBJECT(
    'type', 'comment',
    'documentId', ${documentId},
    'commentId', ${created.id}
  )
)`,
        [companyId]
      )

      res.status(201).json({ comment: created })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to add comment' })
    }
  },
}
