import axios from 'axios'

const CALENDLY_ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN
const ORG_ID = process.env.CALENDLY_ORGANIZATION_ID
const WEBHOOK_URL = process.env.CALENDLY_WEBHOOK_URL
const SIGNING_KEY = process.env.CALENDLY_SIGNING_KEY

const api = axios.create({
  baseURL: 'https://api.calendly.com',
  headers: {
    Authorization: `Bearer ${CALENDLY_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
})

export async function upsertCalendlyWebhook() {
  const organization = `https://api.calendly.com/organizations/${ORG_ID}`
  const scope = 'organization'
  const events = ['invitee.created', 'invitee.canceled']

  const { data } = await api.get('/webhook_subscriptions', {
    params: { organization, scope, count: 100 },
  })
  console.log('webhook subscriptions response', data)
  const existing = (data?.collection || []).find(
    (s) => s?.callback_url === WEBHOOK_URL
  )

  if (existing) {
    console.log('Webhook already exists:', existing.uri)
    return existing
  }

  const payload = {
    url: WEBHOOK_URL,
    events,
    organization,
    scope,
    // TODO
    // signing_key: SIGNING_KEY,
  }

  const created = await api.post('/webhook_subscriptions', payload)
  console.log('Webhook registered:', created.data)
  return created.data
}
