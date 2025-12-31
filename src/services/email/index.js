import { sendEmail } from './emailService.js'

export async function send({ to, subject, html, text, meta }) {
  const res = await sendEmail({ to, subject, html, text })
  return { ...res, meta: meta || {} }
}
