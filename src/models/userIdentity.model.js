import db from '../config/db.js'

export const UserIdentity = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM user_identities')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM user_identities WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create(user_id, provider, provider_sub) {
    const [result] = await db.query(
      'INSERT INTO user_identities (user_id, provider, provider_sub) VALUES (?,?,?)',
      [user_id, provider, provider_sub]
    )
    return { id: result.insertId, user_id, provider, provider_sub }
  },

  async remove(id) {
    await db.query('DELETE FROM user_identities WHERE id = ?', [id])
    return { message: 'User identitie deleted successfully' }
  },

  async getUserAndCompanyInfoBySub(sub) {
    const [rows] = await db.query(
      'SELECT u.email as email, u.name as name, u.id as userId FROM users as u, user_identities as ui WHERE ui.provider_sub = ? AND u.id = ui.user_id',
      [sub]
    )
    return rows?.[0]
  },

  async getUserAndCompaniesInfoByUserId(userId) {
    const [rows] = await db.query(
      'SELECT id as companyId, name as companyName, created_at as createdAt FROM companies WHERE owner_user_id = ?',
      [userId]
    )
    return rows
  },

  async getUserAndUserIdentityByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users as u, user_identities as ui, user_roles as ur WHERE u.email = ? AND u.id = ui.user_id AND ur.user_id = u.id',
      [email]
    )

    return rows[0]
  },

  async getUserIdBySub(sub) {
    const [rows] = await db.query(
      'SELECT u.id as userId, ur.role_id as userType FROM users as u, user_identities as ui, user_roles as ur WHERE ui.provider_sub = ? AND u.id = ui.user_id AND ur.user_id=u.id',
      [sub]
    )
    return rows[0]
  },

  async getCountryIdBySub(sub) {
    const [rows] = await db.query(
      'SELECT u.country_id as countryId FROM users as u, user_identities as ui WHERE ui.provider_sub = ? AND u.id = ui.user_id',
      [sub]
    )
    return rows[0]
  },

  async getUserAndCompanyInfoByEmail(email) {
    const [rows] = await db.query(
      'SELECT u.id as userId, c.name as companyName, c.id as companyId FROM users as u, user_identities as ui, companies as c WHERE u.email = ? AND u.id = ui.user_id And u.id = c.owner_user_id',
      [email]
    )
    return rows?.[0]
  },

  async upsertUser(user_id, provider, provider_sub) {
    const [result] = await db.execute(
      `
     INSERT INTO user_identities (user_id, provider, provider_sub)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE user_id = user_id
    `,
      [user_id, provider, provider_sub]
    )

    return { id: result.insertId, user_id, provider, provider_sub }
  },
}
