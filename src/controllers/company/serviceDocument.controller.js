import { Service } from '../../models/service.model.js'
import { ServiceDocument } from '../../models/serviceDocument.model.js'
import { getPresignedPutUrl, buildKeyForServiceDoc } from '../../utils/s3.js'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const REGION = process.env.AWS_REGION
const BUCKET = process.env.AWS_S3_BUCKET_DOCUMENTS

const safeName = (name) =>
  String(name)
    .toLowerCase()
    .replace(/[^\w.\-]+/g, '-')
const buildObjectUrl = (bucket, region, key) =>
  `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, '/')}`

const extractKeyFromObjectUrl = (url) => {
  try {
    const u = new URL(url)
    const host = u.hostname
    const path = decodeURIComponent(u.pathname.replace(/^\/+/, ''))

    if (/^.+\.s3[.-][a-z0-9-]+\.amazonaws\.com$/.test(host)) return path

    if (/^s3[.-][a-z0-9-]+\.amazonaws\.com$/.test(host)) {
      const i = path.indexOf('/')
      if (i > 0) return path.slice(i + 1)
    }
    return path
  } catch {
    return null
  }
}

export const ServiceDocumentController = {
  async list(req, res) {
    const serviceId = req.params.serviceId
    console.log('serviceId', serviceId)
    const service = await Service.getByCode(serviceId)
    console.log('service', service)
    const docs = await ServiceDocument.listByService(service.id)
    res.json({ docs })
  },

  async updateNoteOrUpload(req, res) {
    const serviceId = req.params.serviceId
    const id = req.params.id
    const service = await Service.getByCode(serviceId)
    const { notes } = req.body || {}

    const doc = await ServiceDocument.getById(id, service.id)
    if (!doc) return res.status(404).json({ error: 'DocumentNotFound' })

    const updated = await ServiceDocument.updateFields(id, service.id, {
      notes: notes || null,
    })
    res.json({ updated })
  },

  async getUploadUrl(req, res) {
    const serviceId = req.params.serviceId
    const service = await Service.getByCode(serviceId)
    console.log('service', service)
    const id = req.params.id
    const { content_type, file_name } = req.body || {}

    if (!content_type) {
      return res.status(400).json({
        error: 'ValidationError',
        details: ['content_type is required'],
      })
    }

    const doc = await ServiceDocument.getById(id, service.id)
    console.log('doc', doc)
    if (!doc) return res.status(404).json({ error: 'DocumentNotFound' })

    const key = buildKeyForServiceDoc({
      serviceId: service.id,
      docId: id,
      fileName: file_name || `${doc.name}.bin`,
    })
    const { url } = await getPresignedPutUrl({
      bucket: BUCKET,
      key,
      contentType: content_type,
      expiresIn: 900,
    })
    console.log('url', url)

    const object_url = buildObjectUrl(BUCKET, REGION, key)
    await ServiceDocument.updateFields(id, service.id, { url: object_url })

    res.json({ upload_url: url, key })
  },

  async getViewUrl(req, res) {
    const serviceId = Number(req.params.serviceId)
    const id = Number(req.params.id)

    const doc = await ServiceDocument.getById(id, serviceId)
    if (!doc || !doc.url) return res.status(404).json({ error: 'NoObjectUrl' })

    const key = extractKeyFromObjectUrl(doc.url)
    if (!key) return res.status(400).json({ error: 'BadObjectUrl' })

    const params = {
      Bucket: BUCKET,
      Key: key,
      Expires: 900, // 15 min
    }

    const view_url = s3.getSignedUrl('getObject', params)

    res.json({ view_url })
  },
}
