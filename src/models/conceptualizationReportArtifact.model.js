import db from '../config/db.js'

export const ConceptualizationReportArtifact = {
  async getByConceptualizationId(conceptualizationId, variant = 'official_pdf') {
    const [rows] = await db.query(
      `
      SELECT id, conceptualization_id, variant, status, s3_bucket, s3_key, object_url,
             mime_type, size_bytes, generated_at, error_message, created_at, updated_at
      FROM conceptualization_report_artifact
      WHERE conceptualization_id = ? AND variant = ?
      LIMIT 1
      `,
      [Number(conceptualizationId), String(variant)]
    )
    return rows[0] || null
  },

  async upsert(payload) {
    const {
      conceptualization_id,
      variant = 'official_pdf',
      status = 'pending',
      s3_bucket = null,
      s3_key = null,
      object_url = null,
      mime_type = 'application/pdf',
      size_bytes = null,
      generated_at = null,
      error_message = null,
    } = payload

    await db.query(
      `
      INSERT INTO conceptualization_report_artifact
      (conceptualization_id, variant, status, s3_bucket, s3_key, object_url, mime_type, size_bytes, generated_at, error_message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        s3_bucket = VALUES(s3_bucket),
        s3_key = VALUES(s3_key),
        object_url = VALUES(object_url),
        mime_type = VALUES(mime_type),
        size_bytes = VALUES(size_bytes),
        generated_at = VALUES(generated_at),
        error_message = VALUES(error_message),
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        Number(conceptualization_id),
        String(variant),
        String(status),
        s3_bucket,
        s3_key,
        object_url,
        mime_type,
        size_bytes !== null && size_bytes !== undefined ? Number(size_bytes) : null,
        generated_at,
        error_message,
      ]
    )

    return this.getByConceptualizationId(conceptualization_id, variant)
  },
}
