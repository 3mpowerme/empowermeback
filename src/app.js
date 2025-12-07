import express from 'express'
import protectedRoutes from './routes/protected.routes.js'
import publicRoutes from './routes/public.routes.js'
import cors from 'cors'
import webhookRoutes from './routes/webhook.routes.js'

const app = express()

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://d2v6ypobvyostd.cloudfront.net',
  'https://d2vbl2764n2th6.cloudfront.net',
  'http://empowerme-app-dev.s3-website-us-east-1.amazonaws.com',
  'https://app.empowermedev.com/'
]

// Webhooks first to use raw body
app.use(webhookRoutes)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  })
)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use('/api', publicRoutes)
app.use('/api', protectedRoutes)

export default app
