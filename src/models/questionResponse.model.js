import db from '../config/db.js'

export const QuestionResponse = {
  async getAllByQuestionTable(questionTable) {
    const [rows] = await db.query('SELECT * FROM ?_responses', [questionTable])
    return rows
  },

  async getByIdByQuestionTable(questionTable, companyId) {
    const sql = `SELECT * FROM ${questionTable}_responses WHERE company_id = ?`
    const [rows] = await db.query(sql, [companyId])
    return rows[0]
  },

  async createByQuestionTable(questionTable, companyId, responseId) {
    const sql = `INSERT INTO ${questionTable}_responses (${questionTable}_id, company_id) VALUES (?, ?)`
    console.log('sql', sql)
    const [result] = await db.query(sql, [responseId, companyId])
    return { id: result.insertId, companyId, responseId }
  },
}
