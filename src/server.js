import app from './app.js'
import { upsertCalendlyWebhook } from './calendlyWebhookSetup.js'

const PORT = process.env.PORT || 4000

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on http://localhost:${PORT}`)
  await upsertCalendlyWebhook()
})

process.on('unhandledRejection', (e) => console.error('UNHANDLED:', e))
process.on('uncaughtException', (e) => console.error('UNCAUGHT:', e))
