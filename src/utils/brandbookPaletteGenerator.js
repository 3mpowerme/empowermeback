import puppeteer from 'puppeteer'
import AWS from 'aws-sdk'
import { Buffer } from 'node:buffer'

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const BUCKET = process.env.AWS_S3_BUCKET_BRANDBOOKS || process.env.AWS_S3_BUCKET

const WIDTH = 1200
const HEADER_HEIGHT = 180
const CARD_HEIGHT = 180
const CARD_GAP = 24
const PADDING_X = 56

function normalizeHexColor(color) {
  if (!color) return null
  const hex = String(color).trim().toLowerCase()
  return /^#[0-9a-f]{6}$/.test(hex) ? hex : null
}

function getTextColorForBackground(hexColor) {
  if (!hexColor) return '#000000'
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

function validatePalettes(colorimetries) {
  if (!Array.isArray(colorimetries) || colorimetries.length === 0) {
    throw new Error('colorimetries must be a non-empty array')
  }
  if (colorimetries.length > 10) {
    throw new Error('colorimetries must contain at most 10 items')
  }

  return colorimetries
    .map((item, index) => {
      const colors = Array.isArray(item.colors)
        ? item.colors.slice(0, 4).map(normalizeHexColor).filter(Boolean)
        : []
      if (colors.length === 0) {
        throw new Error(`colorimetry ${index + 1} has no valid colors`)
      }
      return {
        option: index + 1,
        name: String(item.name || item.label || `Paleta ${index + 1}`).slice(0, 100),
        colors,
      }
    })
}

export async function generatePalettePreviewImage(colorimetries, sessionId) {
  let browser = null
  try {
    const palettes = validatePalettes(colorimetries)

    const FOOTER_HEIGHT = 90
    const CARD_WIDTH = (WIDTH - 2 * PADDING_X - (palettes.length - 1) * CARD_GAP) / palettes.length
    const TOTAL_HEIGHT = HEADER_HEIGHT + CARD_HEIGHT + FOOTER_HEIGHT

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.createPage()
    await page.setViewport({ width: WIDTH, height: TOTAL_HEIGHT })

    const html = buildPaletteHTML(palettes, CARD_WIDTH, TOTAL_HEIGHT)
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const screenshot = await page.screenshot({ type: 'png' })
    await page.close()

    const imageUrl = await uploadToS3(screenshot, sessionId)
    return { ok: true, imageUrl }
  } catch (error) {
    console.error('Error generating palette preview:', error)
    return { ok: false, error: error.message }
  } finally {
    if (browser) {
      await browser.close().catch(() => {})
    }
  }
}

function buildPaletteHTML(palettes, cardWidth, totalHeight) {
  const palette = palettes
    .map(
      (p) => `
    <div class="palette-card">
      <div class="palette-number">${p.option}</div>
      <div class="palette-name">${escapeHtml(p.name)}</div>
      <div class="colors-container">
        ${p.colors
          .map(
            (color) => `
          <div class="color-box" style="background-color: ${color};" title="${color}">
            <span class="color-label">${color}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          width: ${WIDTH}px;
          height: ${totalHeight}px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        .header {
          height: ${HEADER_HEIGHT}px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
          font-size: 32px;
          font-weight: 600;
          color: #2c3e50;
          text-align: center;
        }

        .palettes-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: ${CARD_GAP}px;
          padding: 20px ${PADDING_X}px;
          min-height: ${CARD_HEIGHT}px;
        }

        .palette-card {
          width: ${cardWidth}px;
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s;
        }

        .palette-number {
          font-size: 24px;
          font-weight: 700;
          color: #3498db;
          text-align: center;
        }

        .palette-name {
          font-size: 12px;
          font-weight: 500;
          color: #34495e;
          text-align: center;
          word-wrap: break-word;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .colors-container {
          display: flex;
          gap: 8px;
          justify-content: space-between;
        }

        .color-box {
          flex: 1;
          aspect-ratio: 1;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-size: 9px;
          font-weight: 600;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }

        .color-label {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .footer {
          height: ${FOOTER_HEIGHT}px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(44, 62, 80, 0.95);
          color: white;
          font-size: 14px;
          padding: 16px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Elige una paleta de colores</h1>
      </div>
      <div class="palettes-container">
        ${palette}
      </div>
      <div class="footer">
        <span>Selecciona tu paleta favorita</span>
      </div>
    </body>
    </html>
  `
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return String(text).replace(/[&<>"']/g, (m) => map[m])
}

async function uploadToS3(imageBuffer, sessionId) {
  const key = `brandbook/color-palettes/${sessionId}-${Date.now()}.png`

  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: imageBuffer,
    ContentType: 'image/png',
    CacheControl: 'max-age=31536000',
  }

  try {
    const result = await s3.upload(params).promise()
    const url = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    return url
  } catch (error) {
    console.error('S3 upload error:', error)
    throw new Error(`Failed to upload image to S3: ${error.message}`)
  }
}
