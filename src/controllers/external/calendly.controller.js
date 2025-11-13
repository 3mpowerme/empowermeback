import axios from 'axios'
import {
  cancelCalendlyEvent,
  getCalendlyEventData,
} from '../../utils/calendly.js'
import db from '../../config/db.js'
import { Appointments } from '../../models/appointments.model.js'

const CALENDLY_ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN
const ORGANIZATION_ID = process.env.CALENDLY_ORGANIZATION_ID

export const CalendlyController = {
  async get(req, res) {
    try {
      const response = await axios.get(
        'https://api.calendly.com/scheduled_events',
        {
          headers: {
            Authorization: `Bearer ${CALENDLY_ACCESS_TOKEN}`,
          },
          params: {
            organization: `https://api.calendly.com/organizations/${ORGANIZATION_ID}`,
            count: 10,
          },
        }
      )

      const events = response.data.collection.map((event) => ({
        name: event.name,
        uri: event.uri,
        start_time: event.start_time,
        end_time: event.end_time,
        status: event.status,
      }))

      res.json({ success: true, events })
    } catch (error) {
      console.error(
        'Error getting events from Calendly:',
        error.response?.data || error.message
      )
      res.status(500).json({
        success: false,
        message: 'Error getting events from Calendly:',
        error: error.response?.data || error.message,
      })
    }
  },
  async getById(req, res) {
    try {
      const { event_uri } = req.body

      const eventData = await getCalendlyEventData(event_uri)

      res.json(eventData)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      /* TODO when we have CALENDLY_SIGNING_KEY
      const signingKey = process.env.CALENDLY_SIGNING_KEY
      const sigHeader = req.get('Calendly-Webhook-Signature') // "t=...,v1=..."
      if (!sigHeader) return res.status(400).send('Missing signature')

      const parts = Object.fromEntries(
        sigHeader.split(',').map((p) => p.trim().split('=')) // { t: "...", v1: "..." }
      )
      const timestamp = parts.t
      const v1 = parts.v1

      
      const raw = req.body.toString('utf8')
      const signedPayload = `${timestamp}.${raw}`
      const expected = crypto
        .createHmac('sha256', signingKey)
        .update(signedPayload, 'utf8')
        .digest('hex')

     
      const ok =
        v1?.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected))

      if (!ok) return res.status(401).send('Invalid signature')
      */
      console.log('[Calendly Webhook] event received')
      const { event, payload } = req.body
      console.log('[Calendly Webhook] event', event)
      console.log('[Calendly Webhook] payload', payload)
      if (event === 'invitee.created') {
        const tracking = payload?.tracking || {}
        let serviceOrderId = tracking.utm_campaign?.replace(/^so_/, '') || null
        if (!serviceOrderId)
          serviceOrderId = tracking.utm_source?.replace(/^so_/, '') || null
        if (!serviceOrderId)
          serviceOrderId = tracking.utm_medium?.replace(/^so_/, '') || null
        if (!serviceOrderId)
          serviceOrderId = tracking.utm_content?.replace(/^so_/, '') || null
        if (!serviceOrderId)
          serviceOrderId = tracking.utm_term?.replace(/^so_/, '') || null
        const email = payload.email
        const name = payload.name
        const scheduled_event = payload.scheduled_event
        const scheduled_event_start_time = scheduled_event.start_time
        const scheduled_event_end_time = scheduled_event.end_time
        const scheduled_event_uri = scheduled_event.uri
        const cancel_url = payload.cancel_url
        const reschedule_url = payload.reschedule_url
        const rescheduled = payload.rescheduled
        console.log('[Calendly Webhook] rescheduled?', rescheduled)
        if (serviceOrderId) {
          // event created from frontend
          const newRow = await Appointments.create(
            serviceOrderId,
            email,
            name,
            new Date(scheduled_event_start_time),
            new Date(scheduled_event_end_time),
            scheduled_event_uri,
            cancel_url,
            reschedule_url
          )
          console.log('[Calendly Webhook] appointment created in DB', newRow)
        } else {
          // event created from rescheduling
          serviceOrderId =
            await Appointments.getServiceOrderByScheduledEventUri(
              scheduled_event_uri
            )
          if (serviceOrderId) {
            const newRow = await Appointments.create(
              serviceOrderId,
              email,
              name,
              new Date(scheduled_event_start_time),
              new Date(scheduled_event_end_time),
              scheduled_event_uri,
              cancel_url,
              reschedule_url
            )
            console.log(
              '[Calendly Webhook] appointment created in DB from rescheduling',
              newRow
            )
          } else {
            console.log('[Calendly Webhook] appointment not created in DB')
          }
        }
      }

      if (event === 'invitee.canceled') {
        const rescheduled = payload.rescheduled
        const event_uri = payload.event

        const updatedId = await Appointments.updateStatusByScheduledEventUri(
          event_uri,
          rescheduled ? 'rescheduled' : 'canceled'
        )
        console.log(
          '[Calendly Webhook] appointment status udpated in DB to ' +
            rescheduled
            ? 'rescheduled'
            : 'canceled',
          updatedId
        )
      }

      res.status(200).send('ok')
    } catch (error) {
      console.error('Error processing webhook:', error)
      res.status(500).send('Error processing webhook')
    }
  },
  async remove(req, res) {
    try {
      const { id } = req.params
      const [appointment] = await db.query(
        'SELECT calendly_event_uri FROM appointment WHERE id = ?',
        [id]
      )

      if (!appointment || !appointment.calendly_event_uri) {
        return res.status(404).json({ message: 'Event not found' })
      }

      const success = await cancelCalendlyEvent(appointment.calendly_event_uri)

      if (success) {
        await db.query('UPDATE appointment SET status = ? WHERE id = ?', [
          'canceled',
          id,
        ])
      }

      res.json({ success })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
