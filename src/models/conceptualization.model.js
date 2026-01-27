import db from '../config/db.js'

export const Conceptualization = {
  async getAllByUserId(user_id) {
    const [rows] = await db.query(
      `
    SELECT
      c.id                           AS conceptualization_id,
      c.user_id,
      c.about,
      c.created_at                   AS conceptualization_created_at,

      -- relaciones de catálogo
      c.region_id,
      r.name                         AS region_name,
      c.business_sector_id,
      bs.name                        AS business_sector_name,
      c.offering_service_type_id,
      ost.name                       AS offering_service_type_name,

      -- market analysis
      ma.id                          AS market_analysis_id,
      ma.raw_result                  AS market_analysis_raw_result,
      ma.created_at                  AS market_analysis_created_at,

      -- business plan
      bp.id                          AS business_plan_id,
      bp.raw_result                  AS business_plan_raw_result,
      bp.created_at                  AS business_plan_created_at,

      -- brand book + logo
      bb.id                          AS brand_book_id,
      bb.brand_name,
      bb.slogan,
      bb.colorimetry_id,
      l.id                           AS logo_id,
      l.url                          AS logo_url,

      -- colorimetría
      col.color_1,
      col.color_2,
      col.color_3,
      col.color_4,
      col.color_5,
      col.color_6,
      col.name                       AS colorimetry_name,

      -- business cards (historial de propuestas)
      h.id                           AS bc_history_id,
      h.chosen                       AS bc_chosen,
      h.tagline                      AS bc_tagline,
      h.color_palette                AS bc_color_palette,
      h.style_notes                  AS bc_style_notes,
      f.id                           AS bc_front_id,
      f.url                  AS bc_front_url,
      b.id                           AS bc_back_id,
      b.url                  AS bc_back_url

    FROM conceptualization AS c
    JOIN market_analysis AS ma
      ON ma.id = c.market_analysis_id
    LEFT JOIN brand_book AS bb
      ON bb.id = c.brand_book_id
    LEFT JOIN business_plan AS bp
      ON bp.id = c.business_plan_id
    LEFT JOIN logo AS l
      ON l.id = bb.logo_id
    LEFT JOIN colorimetry AS col
      ON col.id = bb.colorimetry_id

    LEFT JOIN region AS r
      ON r.id = c.region_id
    LEFT JOIN business_sector AS bs
      ON bs.id = c.business_sector_id
    LEFT JOIN offering_service_type AS ost
      ON ost.id = c.offering_service_type_id

    -- joins nuevos para propuestas de tarjetas
    LEFT JOIN conceptualization_business_card_history AS h
      ON h.conceptualization_id = c.id
    LEFT JOIN business_card AS f
      ON f.id = h.business_card_front_id
    LEFT JOIN business_card AS b
      ON b.id = h.business_card_back_id

    WHERE c.user_id = ?
    ORDER BY c.created_at DESC, h.created_at DESC
    `,
      [user_id]
    )

    const byConcept = new Map()

    for (const r of rows) {
      const colorimetry = [
        r.color_1,
        r.color_2,
        r.color_3,
        r.color_4,
        r.color_5,
        r.color_6,
      ].filter(Boolean)

      const {
        color_1,
        color_2,
        color_3,
        color_4,
        color_5,
        color_6,
        bc_history_id,
        bc_chosen,
        bc_tagline,
        bc_color_palette,
        bc_style_notes,
        bc_front_id,
        bc_front_url,
        bc_back_id,
        bc_back_url,
        ...rest
      } = r

      if (!byConcept.has(r.conceptualization_id)) {
        byConcept.set(r.conceptualization_id, {
          ...rest,
          colorimetry,
          business_cards: [],
        })
      }

      if (bc_history_id) {
        const entry = byConcept.get(r.conceptualization_id)
        const exists = entry.business_cards.some(
          (p) => p.history_id === bc_history_id
        )
        if (!exists) {
          entry.business_cards.push({
            history_id: bc_history_id,
            chosen: !!bc_chosen,
            tagline: bc_tagline,
            color_palette: JSON.parse(bc_color_palette),
            style_notes: bc_style_notes,
            front: bc_front_id ? { id: bc_front_id, url: bc_front_url } : null,
            back: bc_back_id ? { id: bc_back_id, url: bc_back_url } : null,
          })
        }
      }
    }

    return Array.from(byConcept.values())
  },
  async getAllByCompanyId(company_id) {
    const [rows] = await db.query(
      `
    SELECT
      c.id                           AS conceptualization_id,
      c.company_id,
      c.about,
      c.created_at                   AS conceptualization_created_at,

      -- relaciones de catálogo
      c.region_id,
      r.name                         AS region_name,
      c.business_sector_id,
      bs.name                        AS business_sector_name,
      c.offering_service_type_id,
      ost.name                       AS offering_service_type_name,

      -- market analysis
      ma.id                          AS market_analysis_id,
      ma.raw_result                  AS market_analysis_raw_result,
      ma.created_at                  AS market_analysis_created_at,

      -- business plan
      bp.id                          AS business_plan_id,
      bp.raw_result                  AS business_plan_raw_result,
      bp.created_at                  AS business_plan_created_at,

      -- brand book + logo
      bb.id                          AS brand_book_id,
      bb.brand_name,
      bb.slogan,
      bb.colorimetry_id,
      l.id                           AS logo_id,
      l.url                          AS logo_url,

      -- colorimetría
      col.color_1,
      col.color_2,
      col.color_3,
      col.color_4,
      col.color_5,
      col.color_6,
      col.name                       AS colorimetry_name,

      -- business cards (historial de propuestas)
      h.id                           AS bc_history_id,
      h.chosen                       AS bc_chosen,
      h.tagline                      AS bc_tagline,
      h.color_palette                AS bc_color_palette,
      h.style_notes                  AS bc_style_notes,
      f.id                           AS bc_front_id,
      f.url                  AS bc_front_url,
      b.id                           AS bc_back_id,
      b.url                  AS bc_back_url

    FROM conceptualization AS c
    JOIN market_analysis AS ma
      ON ma.id = c.market_analysis_id
    LEFT JOIN brand_book AS bb
      ON bb.id = c.brand_book_id
    LEFT JOIN business_plan AS bp
      ON bp.id = c.business_plan_id
    LEFT JOIN logo AS l
      ON l.id = bb.logo_id
    LEFT JOIN colorimetry AS col
      ON col.id = bb.colorimetry_id

    LEFT JOIN region AS r
      ON r.id = c.region_id
    LEFT JOIN business_sector AS bs
      ON bs.id = c.business_sector_id
    LEFT JOIN offering_service_type AS ost
      ON ost.id = c.offering_service_type_id

    -- joins nuevos para propuestas de tarjetas
    LEFT JOIN conceptualization_business_card_history AS h
      ON h.conceptualization_id = c.id
    LEFT JOIN business_card AS f
      ON f.id = h.business_card_front_id
    LEFT JOIN business_card AS b
      ON b.id = h.business_card_back_id

    WHERE c.company_id = ?
    ORDER BY c.created_at DESC, h.created_at DESC
    `,
      [company_id]
    )

    const byConcept = new Map()

    for (const r of rows) {
      const colorimetry = [
        r.color_1,
        r.color_2,
        r.color_3,
        r.color_4,
        r.color_5,
        r.color_6,
      ].filter(Boolean)

      const {
        color_1,
        color_2,
        color_3,
        color_4,
        color_5,
        color_6,
        bc_history_id,
        bc_chosen,
        bc_tagline,
        bc_color_palette,
        bc_style_notes,
        bc_front_id,
        bc_front_url,
        bc_back_id,
        bc_back_url,
        ...rest
      } = r

      if (!byConcept.has(r.conceptualization_id)) {
        byConcept.set(r.conceptualization_id, {
          ...rest,
          colorimetry,
          business_cards: [],
        })
      }

      if (bc_history_id) {
        const entry = byConcept.get(r.conceptualization_id)
        const exists = entry.business_cards.some(
          (p) => p.history_id === bc_history_id
        )
        if (!exists) {
          entry.business_cards.push({
            history_id: bc_history_id,
            chosen: !!bc_chosen,
            tagline: bc_tagline,
            color_palette: JSON.parse(bc_color_palette),
            style_notes: bc_style_notes,
            front: bc_front_id ? { id: bc_front_id, url: bc_front_url } : null,
            back: bc_back_id ? { id: bc_back_id, url: bc_back_url } : null,
          })
        }
      }
    }

    return Array.from(byConcept.values())
  },
  async create(
    user_id,
    offering_service_type_id,
    region_id,
    business_sector_id,
    sectorOther,
    about,
    market_analysis_id
  ) {
    const [result] = await db.query(
      `INSERT INTO conceptualization 
       (user_id, offering_service_type_id, region_id, business_sector_id, business_sector_other, about, market_analysis_id) 
       VALUES (?,?,?,?,?,?,?)`,
      [
        user_id,
        offering_service_type_id,
        region_id,
        business_sector_id,
        sectorOther,
        about,
        market_analysis_id,
      ]
    )
    return { id: result.insertId }
  },
  async updateBrandBookId(id, brand_book_id) {
    await db.query(
      'UPDATE conceptualization SET brand_book_id = ? WHERE id = ?',
      [brand_book_id, id]
    )
    return { id, brand_book_id }
  },

  async updateBusinessPlanId(id, business_plan_id) {
    await db.query(
      'UPDATE conceptualization SET business_plan_id = ? WHERE id = ?',
      [business_plan_id, id]
    )
    return { id, business_plan_id }
  },
}
