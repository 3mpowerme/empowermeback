import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export function getPresignedPutUrl({
  bucket,
  key,
  contentType,
  expiresIn = 900,
}) {
  const params = {
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    Expires: expiresIn,
  }
  const url = s3.getSignedUrl('putObject', params)
  return { url, key }
}

export function buildKeyForServiceDoc({
  serviceId,
  docId,
  fileName = 'upload.bin',
}) {
  const base =
    String(fileName)
      .toLowerCase()
      .replace(/[^\w\-\.]+/g, '-')
      .slice(0, 80) || 'upload.bin'
  return `services/${serviceId}/documents/${docId}-${Date.now()}-${base}`
}
