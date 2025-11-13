import { Router } from 'express'
import { WebhookController } from '../controllers/payment/webhook.controller.js'
import express from 'express'

const router = Router()

router.post(
  '/api/webhook/stripe',
  express.raw({ type: 'application/json' }),
  WebhookController.handle
)

export default router
