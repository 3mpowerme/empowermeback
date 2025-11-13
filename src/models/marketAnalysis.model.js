import db from '../config/db.js'

export const MarketAnalysis = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM market_analysis')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM market_analysis WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create(raw_result) {
    try {
      const [result] = await db.query(
        `INSERT INTO market_analysis 
       (raw_result) 
       VALUES (?)`,
        [JSON.stringify(raw_result)]
      )
      return { id: result.insertId }
    } catch (error) {
      console.log('Error creating market analysis', error)
      throw error
    }
  },
}
