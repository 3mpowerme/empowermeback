import nodemailer from 'nodemailer'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

const region = process.env.SES_REGION
const fromEmail = process.env.SES_FROM_EMAIL
const fromName = process.env.SES_FROM_NAME || 'EmpowerMe'

if (!region) throw new Error('AWS_REGION is required')
if (!fromEmail) throw new Error('SES_FROM_EMAIL is required')

const sesClient = new SESv2Client({
  region: region,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
  },
})

const transporter = nodemailer.createTransport({
  SES: { sesClient, SendEmailCommand },
})

function normalizeToArray(to) {
  if (!to) return []
  if (Array.isArray(to)) return to.filter(Boolean)
  return [to].filter(Boolean)
}

function buildFrom() {
  return `${fromName} <${fromEmail}>`
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  cc,
  bcc,
  headers,
}) {
  const toArr = normalizeToArray(to)
  const ccArr = normalizeToArray(cc)
  const bccArr = normalizeToArray(bcc)

  if (!toArr.length) throw new Error('Email "to" is required')
  if (!subject) throw new Error('Email "subject" is required')
  if (!html && !text) throw new Error('Email "html" or "text" is required')

  const info = await transporter.sendMail({
    from: buildFrom(),
    to: toArr.join(','),
    cc: ccArr.length ? ccArr.join(',') : undefined,
    bcc: bccArr.length ? bccArr.join(',') : undefined,
    replyTo: replyTo || undefined,
    subject,
    text: text || undefined,
    html: html || undefined,
    headers: headers || undefined,
  })

  return {
    messageId: info.messageId,
    accepted: info.accepted || [],
    rejected: info.rejected || [],
    response: info.response,
  }
}
