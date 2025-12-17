import db from '../config/db.js'

export const Account = {
  async getCompanySetupByCompanyId(companyId) {
    try {
      const [result] = await db.query(
        'SELECT * from company_setup where company_id=?',
        [companyId]
      )
      const [result2] = await db.query(
        'SELECT t.name as today_focus from today_focus_responses tr, today_focus t where tr.today_focus_id=t.id and company_id=? ',
        [companyId]
      )
      console.log('result2', result2)
      return { ...result[0], ...result2[0] }
    } catch (error) {
      console.error('getCompanySetupByCompanyId error', error)
    }
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
