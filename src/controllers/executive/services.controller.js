import db from '../../config/db.js'

export const ServicesController = {
  async get(req, res) {
    try {
      const query = `SELECT
  so.service_id,
  so.company_id,
  c.name          AS company_name,
  so.created_at   AS service_order_created_at,
  s.name          AS service_name,
  s.code          AS service_code,
  so.amount_cents  AS payment_amount_cents,
  so.payment_status       AS payment_status,
  so.fulfillment_status        AS service_status
FROM service_orders so
JOIN companies c ON c.id = so.company_id
JOIN services s ON s.id = so.service_id
LEFT JOIN (
  SELECT p1.service_order_id, p1.amount_cents, p1.status
  FROM payments p1
  JOIN (
    SELECT service_order_id, MAX(created_at) AS max_created_at
    FROM payments
    WHERE type = 'service_order' OR type = 'subscription'
    GROUP BY service_order_id
  ) p2
    ON p2.service_order_id = p1.service_order_id
   AND p2.max_created_at = p1.created_at
  WHERE p1.type = 'service_order'
) p ON p.service_order_id = so.id
ORDER BY so.created_at DESC;
`
      const [rows] = await db.query(query)
      res.json(rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to list' })
    }
  },

  async getCompanies(req, res) {
    try {
      const query = `
      SELECT
  c.id AS company_id,
  c.name AS company_name,
  u.email AS user_email,
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM subscriptions s
      WHERE s.company_id = c.id
        AND s.status = 'active'
    ) THEN 1
    ELSE 0
  END AS has_subscription,
  COUNT(DISTINCT so.id) AS paid_service_orders_count
FROM companies c
JOIN users u ON u.id = c.owner_user_id
LEFT JOIN service_orders so
  ON so.company_id = c.id
LEFT JOIN payments p
  ON p.service_order_id = so.id
 AND p.type = 'service_order'
 AND p.status = 'succeeded'
GROUP BY
  c.id,
  c.name,
  u.email
ORDER BY c.id
`
      const [rows] = await db.query(query)
      res.json(rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to list' })
    }
  },

  async getPanel(req, res) {
    try {
      const newServicesCountQuery = `
        SELECT COUNT(*) AS newServicesCount
        FROM service_orders so
        WHERE so.payment_status IN ('paid', 'attending')
      `

      const companiesCountQuery = `
        SELECT COUNT(*) AS companiesCount
        FROM companies
      `

      const lastServicesQuery = `
        SELECT
          so.id AS service_order_id,
          so.service_id,
          so.company_id,
          c.name AS company_name,
          so.created_at AS service_order_created_at,
          s.name AS service_name,
          s.code AS service_code,
          so.amount_cents AS payment_amount_cents,
          so.payment_status AS payment_status,
          so.fulfillment_status AS service_status
        FROM service_orders so
        JOIN companies c ON c.id = so.company_id
        JOIN services s ON s.id = so.service_id
        LEFT JOIN (
          SELECT p1.service_order_id, p1.amount_cents, p1.status
          FROM payments p1
          JOIN (
            SELECT service_order_id, MAX(created_at) AS max_created_at
            FROM payments
            WHERE type = 'service_order'
            GROUP BY service_order_id
          ) p2
            ON p2.service_order_id = p1.service_order_id
           AND p2.max_created_at = p1.created_at
          WHERE p1.type = 'service_order'
        ) p ON p.service_order_id = so.id
        ORDER BY so.created_at DESC
        LIMIT 10
      `

      const totalAmountQuery = `
        SELECT COALESCE(SUM(p.amount_cents), 0) AS totalAmount
        FROM payments p
        WHERE p.status = 'succeeded'
      `

      const mostFrequentlyRequestedServicesQuery = `
        SELECT
          so.service_id,
          s.name AS service_name,
          s.code AS service_code,
          COUNT(*) AS total_orders
        FROM service_orders so
        JOIN services s ON s.id = so.service_id
        GROUP BY so.service_id, s.name, s.code
        ORDER BY total_orders DESC
        LIMIT 10
      `

      const [
        [newServicesCountRows],
        [companiesCountRows],
        [lastServicesRows],
        [totalAmountRows],
        [mostFrequentlyRequestedServicesRows],
      ] = await Promise.all([
        db.query(newServicesCountQuery),
        db.query(companiesCountQuery),
        db.query(lastServicesQuery),
        db.query(totalAmountQuery),
        db.query(mostFrequentlyRequestedServicesQuery),
      ])

      res.json({
        newServicesCount: Number(
          newServicesCountRows?.[0]?.newServicesCount || 0
        ),
        companiesCount: Number(companiesCountRows?.[0]?.companiesCount || 0),
        lastServices: lastServicesRows || [],
        totalAmount: Number(totalAmountRows?.[0]?.totalAmount || 0),
        mostFrequentlyRequestedServices:
          mostFrequentlyRequestedServicesRows || [],
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to list' })
    }
  },

  async saveNotification(req, res) {
    try {
      const { companyId, title, message } = req.body || {}

      if (!companyId || !title || !message) {
        return res
          .status(400)
          .json({ error: 'companyId, title and message are required' })
      }

      const companyIdNum = Number(companyId)
      if (!Number.isFinite(companyIdNum) || companyIdNum <= 0) {
        return res
          .status(400)
          .json({ error: 'companyId must be a valid number' })
      }

      const titleStr = String(title).trim()
      const messageStr = String(message).trim()

      if (!titleStr || !messageStr) {
        return res
          .status(400)
          .json({ error: 'title and message cannot be empty' })
      }

      const [result] = await db.query(
        `INSERT INTO company_notifications (company_id, title, message)
         VALUES (?, ?, ?)`,
        [companyIdNum, titleStr, messageStr]
      )

      res.status(201).json({
        id: result.insertId,
        companyId: companyIdNum,
        title: titleStr,
        message: messageStr,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to save notification' })
    }
  },
  async getInfoByServiceAndCompanyId(req, res) {
    try {
      const serviceIdNum = Number(req.params?.serviceId)
      const companyIdNum = Number(req.params?.companyId)

      if (!Number.isFinite(serviceIdNum) || serviceIdNum <= 0) {
        return res
          .status(400)
          .json({ error: 'serviceId must be a valid number' })
      }

      if (!Number.isFinite(companyIdNum) || companyIdNum <= 0) {
        return res
          .status(400)
          .json({ error: 'companyId must be a valid number' })
      }

      const [serviceRows] = await db.query(
        `SELECT id, code, name FROM services WHERE id = ? LIMIT 1`,
        [serviceIdNum]
      )

      const service = serviceRows?.[0]
      if (!service) {
        return res.status(404).json({ error: 'Service not found' })
      }

      const intakeTableByServiceCode = {
        accounting: 'accounting_client_intakes',
        audit: 'audit_process_intakes',
        balance: 'balance_preparation_intakes',
        shareholders_registry: 'shareholder_registry_intakes',
        constitution_review: 'constitution_review_intakes',
        ordinary_shareholders_meeting: 'ordinary_shareholders_meeting_intakes',
        company_modifications_spa: 'company_modifications_intakes',
        company_modifications_srl: 'company_modifications_intakes',
        share_purchase_and_sale: 'purchase_sale_intakes',
        virtual_office: 'virtual_office_contract_intakes',
        virtual_office_plus_ministorage: 'virtual_office_contract_intakes',
        dissolution_of_spa: 'dissolution_company_intakes',
        dissolution_of_eirl: 'dissolution_company_intakes',
        dissolution_of_srl: 'dissolution_company_intakes',
      }

      const intakeTable = intakeTableByServiceCode[service.code]
      if (!intakeTable) {
        return res.status(404).json({
          error: 'This service does not have an intake table configured',
          service: { id: service.id, code: service.code, name: service.name },
        })
      }

      const query = `
      SELECT *
      FROM ${intakeTable}
      WHERE company_id = ?
        AND (service_id = ? OR service_id IS NULL)
      ORDER BY id DESC
    `

      const [rows] = await db.query(query, [companyIdNum, serviceIdNum])

      res.json({
        service: { id: service.id, code: service.code, name: service.name },
        companyId: companyIdNum,
        intakeTable,
        rows,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to get intake info' })
    }
  },
}
