import db from '../config/db.js'

export const CompanySetup = {
  async create(
    company_id,
    hasEmployees,
    is_registered_company,
    hasStartedActivities,
    about,
    address_id,
    business_sector_id,
    sectorOther
  ) {
    try {
      const [result] = await db.query(
        'INSERT INTO company_setup (company_id, hasEmployees, is_registered_company, hasStartedActivities, about, address_id, business_sector_id, business_sector_other) VALUES (?,?,?,?,?,?,?,?)',
        [
          company_id,
          hasEmployees,
          is_registered_company,
          hasStartedActivities,
          about,
          address_id,
          business_sector_id,
          sectorOther,
        ]
      )
      return {
        id: result.insertId,
        company_id,
        hasEmployees,
        is_registered_company,
        about,
        address_id,
        business_sector_id,
        hasStartedActivities,
        sectorOther,
      }
    } catch (error) {
      console.error('CompanySetup create error', error)
    }
  },
  async getByCompanyId(company_id) {
    const [rows] = await db.query(
      `
      SELECT
        cs.id,
        cs.company_id,
        cs.hasEmployees,
        cs.is_registered_company,
        cs.about,
        cs.address_id,
        cs.business_sector_id,

        c.name              AS company_name,

        a.street            AS address_street,
        a.zip_code          AS address_zip_code,
        a.phone_number      AS address_phone_number,
        a.region_id         AS address_region_id,
        r.name              AS address_region_name,

        bs.name             AS business_sector_name
      FROM company_setup cs
      LEFT JOIN companies       c  ON c.id  = cs.company_id
      LEFT JOIN address         a  ON a.id  = cs.address_id
      LEFT JOIN region          r  ON r.id  = a.region_id
      LEFT JOIN business_sector bs ON bs.id = cs.business_sector_id
      WHERE cs.company_id = ?
      LIMIT 1
      `,
      [Number(company_id)]
    )
    return rows[0] || null
  },

  async update(id, payload = {}) {
    const allowed = [
      'hasEmployees',
      'is_registered_company',
      'about',
      'address_id',
      'business_sector_id',
    ]

    const set = []
    const values = []

    for (const key of allowed) {
      if (payload[key] !== undefined) {
        set.push(`${key} = ?`)
        values.push(payload[key])
      }
    }

    if (set.length === 0) {
      const companyId =
        payload.company_id ?? (await this.getCompanyIdBySetupId(id))
      return await this.getByCompanyId(companyId)
    }

    values.push(Number(id))

    await db.query(
      `UPDATE company_setup SET ${set.join(', ')} WHERE id = ? LIMIT 1`,
      values
    )

    const companyId =
      payload.company_id ?? (await this.getCompanyIdBySetupId(id))

    return await this.getByCompanyId(companyId)
  },

  async getCompanyIdBySetupId(id) {
    const [rows] = await db.query(
      `SELECT company_id FROM company_setup WHERE id = ? LIMIT 1`,
      [Number(id)]
    )
    return rows[0]?.company_id ?? null
  },
}
