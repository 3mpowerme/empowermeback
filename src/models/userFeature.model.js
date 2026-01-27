import db from '../config/db.js'

export const UserFeature = {
  async getByUserId(userId) {
    const [rows] = await db.query(
      `
      SELECT
        f.id            AS feature_id,
        f.name          AS feature_name,
        f.image         AS feature_image,
        f.link          AS feature_link,

        w.id            AS wizard_id,
        w.name          AS wizard_name,
        w.description   AS wizard_description,
        w.image         AS wizard_image,
        w.link          AS wizard_link
      FROM user_feature AS uf
      INNER JOIN feature AS f
        ON f.id = uf.feature_id
      LEFT JOIN wizard AS w
        ON w.feature_id = f.id
      WHERE uf.user_id = ?
      ORDER BY f.id ASC, w.id ASC
      `,
      [userId]
    )

    const byFeature = new Map()

    for (const r of rows) {
      if (!byFeature.has(r.feature_id)) {
        byFeature.set(r.feature_id, {
          id: r.feature_id,
          name: r.feature_name,
          image: r.feature_image,
          link: r.feature_link,
          wizards: [],
        })
      }

      if (r.wizard_id) {
        byFeature.get(r.feature_id).wizards.push({
          id: r.wizard_id,
          name: r.wizard_name,
          description: r.wizard_description,
          image: r.wizard_image,
          link: r.wizard_link,
        })
      }
    }

    return Array.from(byFeature.values())
  },

  async getWizardsByUserIdByFeatureId(userId, featureId) {
    const [rows] = await db.query(
      `
      SELECT
        w.id, w.name, w.description, w.image, w.link
      FROM user_feature AS uf
      INNER JOIN feature AS f
        ON f.id = uf.feature_id
      INNER JOIN wizard AS w
        ON w.feature_id = f.id
      WHERE uf.user_id = ?
        AND f.id = ?
      ORDER BY w.id ASC
      `,
      [userId, featureId]
    )
    return rows
  },

  async checkIfFeatureIdExistsInUser(userId, featureId) {
    const [result] = await db.query(
      'select * from user_feature where user_id = ? AND feature_id = ?',
      [userId, featureId]
    )
    console.log('userId, featureId', userId, featureId)
    console.log('checkIfFeatureIdExistsInUser result', result)
    return result.length > 0
  },

  async create(userId, featureId) {
    const [result] = await db.query(
      'INSERT INTO user_feature (user_id, feature_id) VALUES (?,?)',
      [userId, featureId]
    )
    return { id: result.insertId }
  },
}
