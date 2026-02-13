import db from '../../config/db.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const ServicesController = {
  async get(req, res) {
    try {
      const sub = req.user.sub
      const { userType, userId } = await UserIdentity.getUserIdBySub(sub)

      const typeNum = Number(userType)
      const userIdNum = Number(userId)

      if (!Number.isFinite(typeNum)) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      if (typeNum !== 1) {
        if (!Number.isFinite(userIdNum) || userIdNum <= 0) {
          return res.status(401).json({ error: 'Unauthorized' })
        }
      }

      const query =
        typeNum === 1
          ? `SELECT
  so.service_id,
  so.id as service_order_id,
  so.company_id,
  c.name          AS company_name,
  so.created_at   AS service_order_created_at,
  s.name          AS service_name,
  s.code          AS service_code,
  so.amount_cents  AS payment_amount_cents,
  so.payment_status       AS payment_status,
  so.fulfillment_status        AS service_status,
  au.email        AS assigned_to
FROM service_orders so
JOIN companies c ON c.id = so.company_id
JOIN services s ON s.id = so.service_id
LEFT JOIN service_order_assignees soa
  ON soa.service_order_id = so.id
LEFT JOIN users au
  ON au.id = soa.user_id
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
          : `SELECT
  so.service_id,
  so.id AS service_order_id,
  so.company_id,
  c.name AS company_name,
  so.created_at AS service_order_created_at,
  s.name AS service_name,
  s.code AS service_code,
  so.amount_cents AS payment_amount_cents,
  so.payment_status AS payment_status,
  so.fulfillment_status AS service_status,
  au.email AS assigned_to
FROM service_orders so
JOIN service_order_assignees soa
  ON soa.service_order_id = so.id
 AND soa.user_id = ?
JOIN users au
  ON au.id = soa.user_id
JOIN companies c
  ON c.id = so.company_id
JOIN services s
  ON s.id = so.service_id
LEFT JOIN (
  SELECT p1.service_order_id, p1.amount_cents, p1.status
  FROM payments p1
  JOIN (
    SELECT service_order_id, MAX(created_at) AS max_created_at
    FROM payments
    WHERE type IN ('service_order','subscription')
    GROUP BY service_order_id
  ) p2
    ON p2.service_order_id = p1.service_order_id
   AND p2.max_created_at = p1.created_at
  WHERE p1.type = 'service_order'
) p
  ON p.service_order_id = so.id
ORDER BY so.created_at DESC;
`

      const [rows] =
        typeNum === 1
          ? await db.query(query)
          : await db.query(query, [userIdNum])

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

  async getUsers(req, res) {
    try {
      const query = `
      SELECT
  u.id               AS user_id,
  u.email,
  u.name,
  r.id               AS role_id,
  r.name             AS role_name,
  r.description      AS role_description,
  u.created_at
FROM users u
JOIN user_roles ur
  ON ur.user_id = u.id
JOIN roles r
  ON r.id = ur.role_id
ORDER BY u.created_at DESC;

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

  async updateServiceOrderStatus(req, res) {
    try {
      const serviceOrderIdNum = Number(req.params?.serviceOrderId)

      if (!Number.isFinite(serviceOrderIdNum) || serviceOrderIdNum <= 0) {
        return res
          .status(400)
          .json({ error: 'serviceOrderId must be a valid number' })
      }

      const status = String(req.body?.status || '').trim()

      const allowed = new Set([
        'created',
        'in_progress',
        'finished',
        'canceled',
      ])
      if (!allowed.has(status)) {
        return res.status(400).json({ error: 'Invalid status' })
      }

      const [existingRows] = await db.query(
        `SELECT id, fulfillment_status FROM service_orders WHERE id = ? LIMIT 1`,
        [serviceOrderIdNum]
      )

      const existing = existingRows?.[0]
      if (!existing) {
        return res.status(404).json({ error: 'Service order not found' })
      }

      await db.query(
        `UPDATE service_orders
         SET fulfillment_status = ?
         WHERE id = ?`,
        [status, serviceOrderIdNum]
      )

      res.json({
        serviceOrderId: serviceOrderIdNum,
        status,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to update status' })
    }
  },

  async getExecutives(req, res) {
    const serviceIdNum = Number(req.params?.serviceId)

    if (!Number.isFinite(serviceIdNum) || serviceIdNum <= 0) {
      return res.status(400).json({ error: 'serviceId must be a valid number' })
    }

    try {
      const query = `
      SELECT
        u.id AS user_id,
        u.email,
        u.name,
        u.created_at
      FROM users u
      JOIN user_roles ur
        ON ur.user_id = u.id
      JOIN roles r
        ON r.id = ur.role_id
      JOIN user_services us
        ON us.user_id = u.id
       AND us.service_id = ?
       AND us.is_enabled = 1
      WHERE r.name = 'Ejecutivo'
      ORDER BY u.created_at DESC
    `
      const [rows] = await db.query(query, [serviceIdNum])
      res.json(rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to list' })
    }
  },

  async assigneServiceOrder(req, res) {
    try {
      const serviceOrderIdNum = Number(req.params?.serviceOrderId)
      if (!Number.isFinite(serviceOrderIdNum) || serviceOrderIdNum <= 0) {
        return res
          .status(400)
          .json({ error: 'serviceOrderId must be a valid number' })
      }

      const bodyUserIdNum = Number(req.body?.userId)
      if (!Number.isFinite(bodyUserIdNum) || bodyUserIdNum <= 0) {
        return res.status(400).json({ error: 'userId must be a valid number' })
      }

      const sub = req.user?.sub
      if (!sub) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { userId: assignedByUserId } =
        await UserIdentity.getUserIdBySub(sub)
      const assignedByUserIdNum = Number(assignedByUserId)
      if (!Number.isFinite(assignedByUserIdNum) || assignedByUserIdNum <= 0) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const [[serviceOrderRow]] = await db.query(
        `SELECT id FROM service_orders WHERE id = ? LIMIT 1`,
        [serviceOrderIdNum]
      )
      if (!serviceOrderRow) {
        return res.status(404).json({ error: 'Service order not found' })
      }

      const [[targetUserRow]] = await db.query(
        `SELECT id FROM users WHERE id = ? LIMIT 1`,
        [bodyUserIdNum]
      )
      if (!targetUserRow) {
        return res.status(404).json({ error: 'User not found' })
      }

      await db.query(
        `INSERT INTO service_order_assignees (service_order_id, user_id, assigned_by_user_id)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
           user_id = VALUES(user_id),
           assigned_by_user_id = VALUES(assigned_by_user_id),
           assigned_at = CURRENT_TIMESTAMP`,
        [serviceOrderIdNum, bodyUserIdNum, assignedByUserIdNum]
      )

      const [[row]] = await db.query(
        `SELECT
          service_order_id,
          user_id,
          assigned_by_user_id,
          assigned_at,
          updated_at
        FROM service_order_assignees
        WHERE service_order_id = ?
        LIMIT 1`,
        [serviceOrderIdNum]
      )

      res.json(
        row || { service_order_id: serviceOrderIdNum, user_id: bodyUserIdNum }
      )
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to assign service order' })
    }
  },
  async getRoles(req, res) {
    try {
      const query = `
        SELECT *
        FROM roles;
      `
      const [rows] = await db.query(query)
      res.json(rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to list' })
    }
  },
  async updateRoleByUserId(req, res) {
    try {
      const roleIdNum = Number(req.params?.roleId)
      if (!Number.isFinite(roleIdNum) || roleIdNum <= 0) {
        return res.status(400).json({ error: 'roleId must be a valid number' })
      }

      const userIdNum = Number(req.body?.userId)
      if (!Number.isFinite(userIdNum) || userIdNum <= 0) {
        return res.status(400).json({ error: 'userId must be a valid number' })
      }

      const [[roleRow]] = await db.query(
        `SELECT id, name, description FROM roles WHERE id = ? LIMIT 1`,
        [roleIdNum]
      )
      if (!roleRow) {
        return res.status(404).json({ error: 'Role not found' })
      }

      const [[userRow]] = await db.query(
        `SELECT id, email FROM users WHERE id = ? LIMIT 1`,
        [userIdNum]
      )
      if (!userRow) {
        return res.status(404).json({ error: 'User not found' })
      }

      const email = String(userRow.email || '').trim()
      if (!email) {
        return res.status(400).json({ error: 'User email not found' })
      }

      if (roleIdNum === 1) {
        await db.query(`CALL set_user_as_admin_by_email(?)`, [email])
      } else if (roleIdNum === 2) {
        await db.query(`CALL set_user_as_executive_by_email(?)`, [email])
      } else if (roleIdNum === 3) {
        await db.query(`CALL set_user_as_user_by_email(?)`, [email])
      } else {
        await db.query('START TRANSACTION')
        try {
          await db.query(`DELETE FROM user_roles WHERE user_id = ?`, [
            userIdNum,
          ])
          await db.query(
            `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
            [userIdNum, roleIdNum]
          )
          await db.query('COMMIT')
        } catch (e) {
          await db.query('ROLLBACK')
          throw e
        }
      }

      const [[updated]] = await db.query(
        `
        SELECT
          u.id AS user_id,
          u.email,
          u.name,
          r.id AS role_id,
          r.name AS role_name,
          r.description AS role_description,
          u.created_at
        FROM users u
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        WHERE u.id = ?
        LIMIT 1
      `,
        [userIdNum]
      )

      res.json(
        updated || {
          userId: userIdNum,
          roleId: roleIdNum,
        }
      )
    } catch (err) {
      const msg = err?.sqlMessage || err?.message || 'Failed to update role'
      if (err?.sqlState === '45000') {
        return res.status(400).json({ error: msg })
      }
      console.error(err)
      res.status(500).json({ error: msg })
    }
  },
  async getServices(req, res) {
    try {
      const { userId } = req.params
      const query = `
        SELECT id, code, name, description, requires_appointment, appointment_provider, appointment_url, whats_app_support_number, is_active
        FROM services where can_be_attended = 1;
      `
      const [rows] = await db.query(query)
      const query2 = `
        select service_id from user_services where user_id = ? and is_enabled=1
      `
      const [assignServices] = await db.query(query2, [userId])
      res.json({
        services: rows,
        assignedServices: assignServices.map((it) => it.service_id),
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to list' })
    }
  },
  async updateUserServicesByUser(req, res) {
    try {
      const userIdNum = Number(req.params?.userId)
      if (!Number.isFinite(userIdNum) || userIdNum <= 0) {
        return res.status(400).json({ error: 'userId must be a valid number' })
      }

      const serviceIdsRaw = req.body
      if (!Array.isArray(serviceIdsRaw)) {
        return res
          .status(400)
          .json({ error: 'body must be an array of service ids' })
      }

      const serviceIds = Array.from(
        new Set(
          serviceIdsRaw
            .map((x) => Number(x))
            .filter((x) => Number.isFinite(x) && x > 0)
        )
      )

      const [[userRow]] = await db.query(
        `SELECT id FROM users WHERE id = ? LIMIT 1`,
        [userIdNum]
      )
      if (!userRow) {
        return res.status(404).json({ error: 'User not found' })
      }

      if (serviceIds.length > 0) {
        const placeholders = serviceIds.map(() => '?').join(',')
        const [serviceRows] = await db.query(
          `SELECT id FROM services WHERE id IN (${placeholders})`,
          serviceIds
        )
        const validSet = new Set((serviceRows || []).map((r) => Number(r.id)))
        const invalid = serviceIds.filter((id) => !validSet.has(id))
        if (invalid.length > 0) {
          return res.status(400).json({ error: 'Invalid service ids', invalid })
        }
      }

      await db.query('START TRANSACTION')
      try {
        await db.query(
          `UPDATE user_services
         SET is_enabled = 0
         WHERE user_id = ?`,
          [userIdNum]
        )

        if (serviceIds.length > 0) {
          const valuesSql = serviceIds.map(() => '(?, ?, 1)').join(',')
          const params = []
          for (const sid of serviceIds) {
            params.push(userIdNum, sid)
          }

          await db.query(
            `INSERT INTO user_services (user_id, service_id, is_enabled)
           VALUES ${valuesSql}
           ON DUPLICATE KEY UPDATE
             is_enabled = 1`,
            params
          )
        }

        await db.query('COMMIT')
      } catch (e) {
        await db.query('ROLLBACK')
        throw e
      }

      const [rows] = await db.query(
        `SELECT user_id, service_id, is_enabled, created_at, updated_at
       FROM user_services
       WHERE user_id = ?
       ORDER BY service_id`,
        [userIdNum]
      )

      res.json({
        userId: userIdNum,
        enabledServiceIds: rows
          .filter((r) => Number(r.is_enabled) === 1)
          .map((r) => r.service_id),
        rows,
      })
    } catch (err) {
      const msg =
        err?.sqlMessage || err?.message || 'Failed to update user services'
      console.error(err)
      res.status(500).json({ error: msg })
    }
  },
}
