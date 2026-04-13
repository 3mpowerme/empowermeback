import AWS from 'aws-sdk'
import puppeteer from 'puppeteer'
import { ConceptualizationReportArtifact } from '../models/conceptualizationReportArtifact.model.js'

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const BUCKET = process.env.AWS_S3_BUCKET_DOCUMENTS || process.env.AWS_S3_BUCKET
const APP_URL = process.env.APP_URL || 'https://app.empowermedev.com'
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'

function buildObjectUrl(bucket, region, key) {
  const safeRegion = region || AWS_REGION
  return `https://${bucket}.s3.${safeRegion}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, '/')}`
}

export const ConceptualizationPdfService = {
  buildStorageKey(conceptualizationId) {
    return `conceptualizations/${Number(conceptualizationId)}/official/report.pdf`
  },

  async ensureArtifactRecord(conceptualizationId) {
    const existing = await ConceptualizationReportArtifact.getByConceptualizationId(
      conceptualizationId,
      'official_pdf'
    )
    if (existing) return existing

    return ConceptualizationReportArtifact.upsert({
      conceptualization_id: conceptualizationId,
      variant: 'official_pdf',
      status: 'pending',
      mime_type: 'application/pdf',
    })
  },

  async getArtifact(conceptualizationId) {
    return this.ensureArtifactRecord(conceptualizationId)
  },

  async generateOfficialPdf({ conceptualizationId, accessToken, authState = null }) {
    const artifact = await this.ensureArtifactRecord(conceptualizationId)
    const s3_key = this.buildStorageKey(conceptualizationId)
    const report_url = `${APP_URL}/dashboard/conceptualization/official-report?id=${Number(conceptualizationId)}`

    const generatingArtifact = await ConceptualizationReportArtifact.upsert({
      conceptualization_id: conceptualizationId,
      variant: 'official_pdf',
      status: 'generating',
      s3_bucket: BUCKET,
      s3_key,
      object_url: buildObjectUrl(BUCKET, process.env.AWS_REGION, s3_key),
      mime_type: 'application/pdf',
      error_message: null,
    })

    if (!accessToken && !authState?.accessToken) {
      return {
        ok: false,
        artifact: generatingArtifact,
        report_url,
        error: 'Missing access token for frontend report rendering',
      }
    }

    let browser
    try {
      browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      const page = await browser.newPage()
      await page.goto(APP_URL, { waitUntil: 'networkidle2' })
      const frontendAuthState = authState || { accessToken }
      await page.evaluate((auth) => {
        localStorage.setItem('auth', JSON.stringify(auth))
      }, frontendAuthState)
      await page.goto(report_url, { waitUntil: 'networkidle2', timeout: 120000 })
      await page.waitForFunction(() => window.__REPORT_READY__ === true, { timeout: 15000 })
      await page.emulateMediaType('screen')
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' } })

      await s3.putObject({
        Bucket: BUCKET,
        Key: s3_key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
      }).promise()

      const readyArtifact = await ConceptualizationReportArtifact.upsert({
        conceptualization_id: conceptualizationId,
        variant: 'official_pdf',
        status: 'ready',
        s3_bucket: BUCKET,
        s3_key,
        object_url: buildObjectUrl(BUCKET, process.env.AWS_REGION, s3_key),
        mime_type: 'application/pdf',
        size_bytes: pdfBuffer.length,
        generated_at: new Date(),
        error_message: null,
      })

      return {
        ok: true,
        artifact: readyArtifact,
        report_url,
      }
    } catch (error) {
      const failedArtifact = await ConceptualizationReportArtifact.upsert({
        conceptualization_id: conceptualizationId,
        variant: 'official_pdf',
        status: 'failed',
        s3_bucket: BUCKET,
        s3_key,
        object_url: buildObjectUrl(BUCKET, process.env.AWS_REGION, s3_key),
        mime_type: 'application/pdf',
        error_message: error.message,
      })
      return {
        ok: false,
        artifact: failedArtifact,
        report_url,
        error: error.message,
      }
    } finally {
      if (browser) await browser.close()
    }
  },

  async getDownloadUrl(conceptualizationId) {
    const artifact = await this.getArtifact(conceptualizationId)
    if (!artifact?.s3_key || !BUCKET || artifact?.status !== 'ready') {
      return {
        ok: false,
        artifact,
        error: 'Official PDF is not generated yet',
      }
    }

    const download_url = s3.getSignedUrl('getObject', {
      Bucket: artifact.s3_bucket || BUCKET,
      Key: artifact.s3_key,
      Expires: 900,
      ResponseContentType: artifact.mime_type || 'application/pdf',
      ResponseContentDisposition: `attachment; filename="conceptualization-${Number(conceptualizationId)}.pdf"`,
    })

    return {
      ok: true,
      artifact,
      download_url,
    }
  },
}
