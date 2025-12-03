import db from '../config/db.js'

export const Account = {
  async getCompanySetupByCompanyId(companyId) {
    const [result] = await db.query(
      'SELECT * from company_setup where company_id=?',
      [companyId]
    )
    return result[0]
  },
  async update(fields, companyId) {
    const keys = Object.keys(fields)
    if (!keys.length) return

    const setClause = keys.map((k) => `${k} = ?`).join(', ')
    const values = Object.values(fields)
    values.push(companyId)

    const sql = `UPDATE company_setup SET ${setClause} WHERE company_id = ?`
    await db.query(sql, values)

    return { updated: true }
  },
}
