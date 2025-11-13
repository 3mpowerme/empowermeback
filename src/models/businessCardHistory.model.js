import db from '../config/db.js'

export const BusinessCardHistory = {
  async getAll(table) {
    const [rows] = await db.query(
      `SELECT * FROM ${table}_business_card_history`
    )
    return rows
  },

  async getByCompanyId(table, id) {
    const [rows] = await db.query(
      `SELECT * FROM ${table}_business_card_history WHERE company_id = ?`[id]
    )
    return rows[0]
  },

  async getByConceptualizationId(table, id) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM ${table}_business_card_history WHERE conceptualization_id = ?`,
        [id]
      )
      return rows
    } catch (e) {}
  },

  async create(
    table,
    business_card_front_id,
    business_card_back_id,
    conceptualization_id,
    chosen,
    tagline,
    color_palette,
    style_notes
  ) {
    const [result] = await db.query(
      `INSERT INTO ${table}_business_card_history (business_card_front_id, business_card_back_id, conceptualization_id, chosen, tagline, color_palette, style_notes) VALUES (?,?,?,?,?,?,?)`,
      [
        business_card_front_id,
        business_card_back_id,
        conceptualization_id,
        chosen,
        tagline,
        color_palette,
        style_notes,
      ]
    )
    return { id: result.insertId }
  },

  async updateChosen(conceptualization_id, history_id) {
    const rows = await this.getByConceptualizationId(
      'conceptualization',
      conceptualization_id
    )
    for (let i = 0; i < rows.length; i++) {
      const hi = rows[i].id
      await db.query(
        'UPDATE conceptualization_business_card_history SET chosen = ? WHERE id = ?',
        [0, hi]
      )
    }
    await db.query(
      'UPDATE conceptualization_business_card_history SET chosen = ? WHERE id = ?',
      [1, history_id]
    )
  },

  async remove(table, id) {
    await db.query(`DELETE FROM ${table}_business_card_history WHERE id = ?`, [
      id,
    ])
    return { message: 'business_card history deleted successfully' }
  },
}
