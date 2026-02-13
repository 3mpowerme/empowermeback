import { Company } from '../../models/company.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'
import openai from '../../config/openaiClient.js'
import { Conceptualization } from '../../models/conceptualization.model.js'
import { MarketAnalysis } from '../../models/marketAnalysis.model.js'
import { OfferingServiceType } from '../../models/offeringServiceType.model.js'
import { BusinessSector } from '../../models/businessSector.model.js'
import { Region } from '../../models/region.model.js'
import AWS from 'aws-sdk'
import {
  buildBusinessPlanPrompt,
  buildMarketAnalysisPrompt,
  getBusinessPlanPrompt,
  getConceptualizationPrompt,
} from '../../utils/prompt.js'
import { BrandBook } from '../../models/brandBook.model.js'
import { Colorimetry } from '../../models/colorimetry.model.js'
import { Logo } from '../../models/logo.model.js'
import { LogoHistory } from '../../models/logoHistory.model.js'
import { BusinessPlan } from '../../models/businessPlan.model.js'
import { generateStructuredJson } from '../../services/ai/index.js'
import { MARKET_ANALYSIS_JSON_OPENAI_SCHEMA } from '../../templates/marketAnalysis.openai.schema.js'
import { MARKET_ANALYSIS_JSON_GEMINI_SCHEMA } from '../../templates/marketAnalysis.gemini.schema.js'
import { Country } from '../../models/country.model.js'
import { BUSINESS_PLAN_JSON_OPENAI_SCHEMA } from '../../templates/businessPlan.openai.schema.js'
import { ANALYSIS_AND_BUSINESS_PLAN_JSON_OPENAI_SCHEMA } from '../../templates/analysisAndBusinessPlan.openai.schema.js'
import { ANALYSIS_AND_BUSINESS_PLAN_JSON_GEMINI_SCHEMA } from '../../templates/analysisAndBusinessPlan.gemini.schema.js'
import { BusinessCard } from '../../models/businessCard.model.js'
import { BusinessCardHistory } from '../../models/businessCardHistory.model.js'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export const ConceptualizationController = {
  async getAll(req, res) {
    try {
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      // fetch by userId not companyId
      /*const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult
      */
      const row = await Conceptualization.getAllByUserId(userId)
      if (!row)
        return res.status(404).json({ message: 'Conceptualizacion not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getLogoHistory(req, res) {
    try {
      const { companyId } = req.params
      const row = await LogoHistory.getByCompanyId('company', companyId)
      console.log('row', row)
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const OTHERS_BUSINESS_SECTOR_ID = 11
      const {
        offering_service_type_id,
        region_id,
        business_sector_id,
        business_sector_other,
        about,
      } = req.body
      const sectorId = business_sector_other
        ? OTHERS_BUSINESS_SECTOR_ID
        : business_sector_id
      const sectorOther = business_sector_other || null
      console.log('body', req.body)
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const { countryId } = await UserIdentity.getCountryIdBySub(sub)
      const { name: countryName } = await Country.getNameById(countryId)
      // attaching the conceptualization to userId not companyId
      /*
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult
      */
      const { name: offeringServiceTypeName } =
        await OfferingServiceType.getById(offering_service_type_id)
      const { name: businessSectorName } =
        await BusinessSector.getById(business_sector_id)
      const { name: regionName } = await Region.getById(region_id)
      const prompt = buildMarketAnalysisPrompt(
        offeringServiceTypeName,
        sectorId === OTHERS_BUSINESS_SECTOR_ID
          ? sectorOther
          : businessSectorName,
        regionName,
        about,
        countryName
      )
      console.log('prompt', prompt)
      const provider = 'openai'
      //const provider = 'gemini'
      const result = await generateStructuredJson(
        prompt,
        ANALYSIS_AND_BUSINESS_PLAN_JSON_OPENAI_SCHEMA,
        {
          provider: provider, // "openai" | "gemini"
          temperature: 0.3,
          max_output_tokens: 10000,
          timeoutMs: 300000,
          strict: true,
          validate: true,
          schemaName: 'analisis_de_viabilidad_y_plan_de_negocios',
        }
      )

      console.log('result data:', result?.data)
      console.log('Tokens usados:')
      console.log({
        input_tokens: result?.usage?.input_tokens,
        input_tokens_details: JSON.stringify(
          result?.usage?.input_tokens_details || {}
        ),
        output_tokens: result?.usage?.output_tokens,
        output_tokens_details: JSON.stringify(
          result?.usage?.output_tokens_details || {}
        ),
        total_tokens: result?.usage?.total_tokens,
      })
      const data = result?.data
      const { id: marketAnalysisId } = await MarketAnalysis.create(
        data.analisis_de_viabilidad
      )

      const { id: businessPlanId } = await BusinessPlan.create(
        data.plan_de_negocios
      )

      const conceptualization = await Conceptualization.create(
        userId,
        offering_service_type_id,
        region_id,
        sectorId,
        sectorOther,
        about,
        marketAnalysisId
      )
      const conceptualization_id = conceptualization?.id
      await Conceptualization.updateBusinessPlanId(
        conceptualization_id,
        businessPlanId
      )

      res.status(201).json({
        market_analysis: data.analisis_de_viabilidad,
        business_plan: data.plan_de_negocios,
        market_analysis_id: marketAnalysisId,
        conceptualization_id,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getBrandBookOptions(req, res) {
    try {
      const { offering_service_type_id, region_id, business_sector_id, about } =
        req.body
      console.log(
        'getBrandBookOptions offering_service_type_id',
        offering_service_type_id
      )
      const { name: offeringServiceTypeName } =
        await OfferingServiceType.getById(offering_service_type_id)
      console.log(
        'getBrandBookOptions offeringServiceTypeName',
        offeringServiceTypeName
      )
      const { name: businessSectorName } =
        await BusinessSector.getById(business_sector_id)
      const { name: regionName } = await Region.getById(region_id)
      const number = 6
      const query = `Dame ${number} nombres de marcas y ${number} slogans y ${number} opciones de colorimetria que incluya 6 colores en hexadecimal con un nombre relacionado a los colores, colors debe ser un arreglo de strings con los colores en HEX sobre: ${about} para la categoria de ${offeringServiceTypeName} y el sector ${businessSectorName} en la region ${regionName}, omite darme sugerencias y platicarme lo que te pedí`
      console.log('query', query)
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content:
              'Eres un analista experto en estudios de mercado en el país de Chile. Responde siempre en formato JSON con los campos: brandNames, slogans, colorimetries. Devuelve solo JSON válido, sin texto adicional ni markdown.',
          },
          {
            role: 'user',
            content: query,
          },
        ],
      })
      console.log('response', response)
      console.log('Tokens usados:')
      console.log({
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens,
        cached_tokens: response.usage.prompt_tokens_details.cached_tokens,
      })
      const result = JSON.parse(response.choices[0].message.content)
      console.log('result', result)
      const brandNames = result.brandNames
      const slogans = result.slogans
      const colorimetries = result.colorimetries

      res.status(201).json({
        brandNames,
        slogans,
        colorimetries,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async createBrandBook(req, res) {
    try {
      const {
        brand_name,
        slogan,
        logo_type,
        colorimetry,
        colorimetry_name,
        conceptualization_id,
      } = req.body

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      /*const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult*/
      const prompt = `
        Diseña un logo minimalista y moderno para una marca llamada "${brand_name}".
        El eslogan es: "${slogan}".
        Tipo de logo: ${logo_type}.
        Usa una paleta de colores basada en estos códigos hexadecimales: ${colorimetry.join(', ')}.
        El fondo debe ser blanco o transparente.
      `
      console.log('prompt', prompt)
      const imageResponse = await openai.images.generate({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        n: 5,
        background: 'transparent',
      })

      console.log('Tokens usados:')
      console.log({
        prompt_tokens: imageResponse.usage.input_tokens,
        completion_tokens: imageResponse.usage.output_tokens,
        total_tokens: imageResponse.usage.total_tokens,
      })

      if (!imageResponse?.data?.length) {
        throw new Error('No se recibieron imágenes desde OpenAI')
      }

      const logos = []

      for (let i = 0; i < imageResponse.data.length; i++) {
        const imgData = imageResponse.data[i]
        const imageBase64 = imgData.b64_json
        if (!imageBase64) continue

        const buffer = Buffer.from(imageBase64, 'base64')

        const fileNameSafe = `${brand_name}`.replace(/[^a-zA-Z0-9-_]+/g, '_')
        const fileName = `logos/${fileNameSafe}_${Date.now()}_${i + 1}.png`

        const s3Result = await s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName,
            Body: buffer,
            ContentType: 'image/png',
          })
          .promise()

        logos.push(s3Result.Location)
      }
      const insertedLogos = await Promise.all(
        logos.map((url) => Logo.create(url))
      )
      console.log('insertedLogos', insertedLogos)
      await Promise.all(
        insertedLogos.map(({ id: logo_id }) =>
          LogoHistory.create('conceptualization', logo_id, conceptualization_id)
        )
      )
      console.log('logoHistory inserted')
      const { id: colorimetry_id } = await Colorimetry.create(
        ...colorimetry,
        colorimetry_name
      )
      console.log('colorimetry_id', colorimetry_id)
      const { id: brand_book_id } = await BrandBook.create(
        brand_name,
        slogan,
        colorimetry_id
      )
      console.log('brand_book_id', brand_book_id)
      await Conceptualization.updateBrandBookId(
        conceptualization_id,
        brand_book_id
      )
      console.log('conceptualization updated')
      res.status(201).json({ logos: insertedLogos, brand_book_id })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async createLogos(req, res) {
    try {
      const {
        offering_service_type_id,
        business_sector_id,
        about,
        brand_name,
        logo_type,
      } = req.body

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult
      const { name: offeringServiceTypeName } =
        await OfferingServiceType.getById(offering_service_type_id)
      const { name: businessSectorName } =
        await BusinessSector.getById(business_sector_id)
      const prompt = `
        Diseña un logo minimalista y moderno para una marca llamada "${brand_name}".
        Tipo de logo: ${logo_type}.
        Tipo de servicio: ${offeringServiceTypeName}
        Sector: ${businessSectorName}.
        Acerca de la empresa: ${about}
        El fondo debe ser blanco o transparente.
      `
      console.log('prompt', prompt)
      const imageResponse = await openai.images.generate({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        n: 1,
        background: 'transparent',
      })

      console.log('Tokens usados:')
      console.log({
        prompt_tokens: imageResponse.usage.input_tokens,
        completion_tokens: imageResponse.usage.output_tokens,
        total_tokens: imageResponse.usage.total_tokens,
      })

      if (!imageResponse?.data?.length) {
        throw new Error('No se recibieron imágenes desde OpenAI')
      }

      const logos = []

      for (let i = 0; i < imageResponse.data.length; i++) {
        const imgData = imageResponse.data[i]
        const imageBase64 = imgData.b64_json
        if (!imageBase64) continue

        const buffer = Buffer.from(imageBase64, 'base64')

        const fileNameSafe = `${brand_name}`.replace(/[^a-zA-Z0-9-_]+/g, '_')
        const fileName = `logos/${fileNameSafe}_${Date.now()}_${i + 1}.png`

        const s3Result = await s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName,
            Body: buffer,
            ContentType: 'image/png',
          })
          .promise()

        logos.push(s3Result.Location)
      }
      const insertedLogos = await Promise.all(
        logos.map((url) => Logo.create(url))
      )
      console.log('insertedLogos', insertedLogos)
      await Promise.all(
        insertedLogos.map(({ id: logo_id }) =>
          LogoHistory.create('company', logo_id, companyId)
        )
      )
      res.status(201).json({ logos: insertedLogos })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async updateLogoBrandBook(req, res) {
    try {
      const { id: brand_book_id } = req.params
      const { logo_id } = req.body
      const updated = await BrandBook.updateLogoId(brand_book_id, logo_id)
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async createBusinessPlan(req, res) {
    try {
      const { offering_service_type_id, region_id, business_sector_id, about } =
        req.body
      const { id: conceptualization_id } = req.params
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const { countryId } = await UserIdentity.getCountryIdBySub(sub)
      const { name: countryName } = await Country.getNameById(countryId)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult
      const { name: offeringServiceTypeName } =
        await OfferingServiceType.getById(offering_service_type_id)
      const { name: businessSectorName } =
        await BusinessSector.getById(business_sector_id)
      const { name: regionName } = await Region.getById(region_id)

      const prompt = buildBusinessPlanPrompt(
        offeringServiceTypeName,
        businessSectorName,
        regionName,
        about,
        countryName
      )
      console.log('prompt', prompt)
      const provider = 'openai'
      //const provider = 'gemini'
      const result = await generateStructuredJson(
        prompt,
        BUSINESS_PLAN_JSON_OPENAI_SCHEMA,
        {
          provider: provider, // "openai" | "gemini"
          temperature: 0.3,
          max_output_tokens: 10000,
          timeoutMs: 300000,
          strict: true,
          validate: true,
          schemaName: 'plan_de_negocios',
        }
      )

      console.log('result data:', result?.data)
      console.log('Tokens usados:')
      console.log({
        input_tokens: result?.usage?.input_tokens,
        input_tokens_details: JSON.stringify(
          result?.usage?.input_tokens_details || {}
        ),
        output_tokens: result?.usage?.output_tokens,
        output_tokens_details: JSON.stringify(
          result?.usage?.output_tokens_details || {}
        ),
        total_tokens: result?.usage?.total_tokens,
      })
      const data = result?.data

      const { id: businessPlanId } = await BusinessPlan.create(data)

      await Conceptualization.updateBusinessPlanId(
        conceptualization_id,
        businessPlanId
      )

      res.status(201).json({
        business_plan: data,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async createBusinessCardMockups(req, res) {
    try {
      const {
        offering_service_type_id,
        region_id,
        business_sector_id,
        about,
        brand_book_id,
      } = req.body || {}
      const { id: conceptualization_id } = req.params

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      console.log('userId', userId)

      const { countryId } = await UserIdentity.getCountryIdBySub(sub)
      const { name: countryName } = await Country.getNameById(countryId)

      const { name: offeringServiceTypeName } =
        await OfferingServiceType.getById(offering_service_type_id)
      const { name: businessSectorName } =
        await BusinessSector.getById(business_sector_id)
      const { name: regionName } = await Region.getById(region_id)
      const brandBook = await BrandBook.getById(brand_book_id)
      const {
        brand_name,
        slogan,
        color_1,
        color_2,
        color_3,
        color_4,
        color_5,
        color_6,
        url,
      } = brandBook
      console.log('brandBook', brandBook)

      const mockupsCount = 1
      const conceptPrompt = `
Eres un director creativo senior especializado en identidad corporativa para pymes en ${countryName}.
Genera ${mockupsCount} propuestas distintas de tarjeta de presentación profesional para un negocio con estas características:

- Tipo de servicio: ${offeringServiceTypeName}
- Sector: ${businessSectorName}
- Región/localización: ${regionName}
- Descripción del negocio: ${about}
- Nombre de la marca: ${brand_name}
- Slogan: ${slogan}
- Paleta de colores: ${color_1} ${color_2} ${color_3} ${color_4} ${color_5} ${color_6}

Para cada propuesta quiero un objeto JSON con:
- "tagline": una frase corta y profesional adaptada al mercado local (${regionName}, ${countryName})
- "color_palette": un arreglo de 3 a 5 colores en HEX (por ejemplo ["#000000","#FFFFFF","#FFB800"])
- "style_notes": una descripción breve del estilo visual de la tarjeta (ej: "minimalista premium", "moderno tech azul eléctrico", etc.)
- "front_layout": texto descriptivo de cómo se vería el frente (logo placeholder, nombre, rol, contacto)
- "back_layout": texto descriptivo de cómo se vería el reverso (slogan, servicios clave, QR, etc.)

Devuélvelo EXCLUSIVAMENTE en formato JSON válido, sin comentarios ni markdown, con la forma:
{
  "proposals": [
    {
      "tagline": "...",
      "color_palette": ["#HEX", "..."],
      "style_notes": "...",
      "front_layout": "...",
      "back_layout": "..."
    }
  ]
}
    `.trim()

      const conceptResponse = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content:
              'Responde únicamente en JSON válido. No incluyas explicaciones externas.',
          },
          { role: 'user', content: conceptPrompt },
        ],
        temperature: 0.4,
      })

      const conceptJsonRaw =
        conceptResponse?.choices?.[0]?.message?.content || '{}'

      let conceptJson
      try {
        conceptJson = JSON.parse(conceptJsonRaw)
      } catch (err) {
        console.error('Error parsing concept JSON', err, conceptJsonRaw)
        return res.status(500).json({
          message:
            'Error parsing mockup concept response from AI. (Invalid JSON)',
        })
      }

      const proposals = Array.isArray(conceptJson.proposals)
        ? conceptJson.proposals
        : []

      console.log('proposals', proposals)

      if (!proposals.length) {
        return res.status(500).json({ message: 'AI did not return proposals' })
      }

      const mockupItems = []

      for (let i = 0; i < proposals.length; i++) {
        const proposal = proposals[i]

        const frontPrompt = `
Diseña la vista FRONTAL de una tarjeta de presentación corporativa.
Estilo general: ${proposal.style_notes}.
Paleta de color (usa estos colores como base): ${proposal.color_palette.join(', ')}.
Contexto de marca: ${about}.
Región objetivo: ${regionName}, ${countryName}.

⚠️ LOGO PLACEHOLDER (OBLIGATORIO):
Muestra un LOGO DE PRUEBA/PLACEHOLDER claramente identificable en el área destinada al logo.
Debe ser un recuadro o forma simple (rectángulo/círculo) en gris claro (#CCCCCC ~ #E5E7EB),
con la palabra "LOGO" centrada (tipografía simple, contraste legible).
No inventes ni dibujes un logo real, solo el marcador de posición integrado al diseño.

Layout deseado:
${proposal.front_layout}

La tarjeta debe parecer realista en mockup 3D sobre superficie limpia, luz suave.
Formato horizontal, tarjeta estándar profesional.
No incluyas marcas de agua ni texto "mockup".
      `.trim()

        const backPrompt = `
Diseña la vista TRASERA de la misma tarjeta de presentación corporativa.
Debe hacer match con el frente (misma identidad).
Estilo general: ${proposal.style_notes}.
Paleta de color (misma base): ${proposal.color_palette.join(', ')}.
Tagline / frase clave: "${proposal.tagline}".

Si existe un área de logo en el reverso, mantén el mismo LOGO PLACEHOLDER:
un marcador en gris claro con la palabra "LOGO" centrada (no inventar logotipo real).

Layout deseado:
${proposal.back_layout}

Mockup 3D similar, misma tarjeta física, mostrando el reverso.
Formato horizontal profesional.
No incluyas marcas de agua ni texto "mockup".
Todos los textos deben de estar en español
      `.trim()

        const frontImageResp = await openai.images.generate({
          model: 'gpt-image-1',
          prompt: frontPrompt,
          size: '1024x1024',
          n: 1,
          background: 'transparent',
        })

        if (
          !frontImageResp ||
          !frontImageResp.data ||
          !frontImageResp.data[0] ||
          !frontImageResp.data[0].b64_json
        ) {
          throw new Error('No front image generated by OpenAI')
        }

        const frontBuffer = Buffer.from(
          frontImageResp.data[0].b64_json,
          'base64'
        )

        const frontFileNameSafe = `business_card_front_user_${userId}`.replace(
          /[^a-zA-Z0-9-_]+/g,
          '_'
        )
        const frontFileKey = `business_cards/${frontFileNameSafe}_${Date.now()}_${i + 1}_front.png`

        const frontS3 = await s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: frontFileKey,
            Body: frontBuffer,
            ContentType: 'image/png',
          })
          .promise()

        const backImageResp = await openai.images.generate({
          model: 'gpt-image-1',
          prompt: backPrompt,
          size: '1024x1024',
          n: 1,
          background: 'transparent',
        })

        if (
          !backImageResp ||
          !backImageResp.data ||
          !backImageResp.data[0] ||
          !backImageResp.data[0].b64_json
        ) {
          throw new Error('No back image generated by OpenAI')
        }

        const backBuffer = Buffer.from(backImageResp.data[0].b64_json, 'base64')

        const backFileNameSafe = `business_card_back_user_${userId}`.replace(
          /[^a-zA-Z0-9-_]+/g,
          '_'
        )
        const backFileKey = `business_cards/${backFileNameSafe}_${Date.now()}_${i + 1}_back.png`

        const backS3 = await s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: backFileKey,
            Body: backBuffer,
            ContentType: 'image/png',
          })
          .promise()

        const business_card_front = await BusinessCard.create(frontS3.Location)
        const business_card_back = await BusinessCard.create(backS3.Location)
        console.log('inserted businessCards')

        const businessCardHistory = await BusinessCardHistory.create(
          'conceptualization',
          business_card_front.id,
          business_card_back.id,
          conceptualization_id,
          0,
          proposal.tagline,
          JSON.stringify(proposal.color_palette),
          proposal.style_notes
        )
        console.log('inserted businessCards history')

        mockupItems.push({
          history_id: businessCardHistory.id,
          tagline: proposal.tagline,
          color_palette: proposal.color_palette,
          style_notes: proposal.style_notes,
          front: {
            url: frontS3.Location,
            id: business_card_front.id,
          },
          back: {
            url: backS3.Location,
            id: business_card_back.id,
          },
          chosen: false,
        })
      }

      return res.status(201).json({
        mockups: mockupItems,
      })
    } catch (error) {
      console.error('Error in createBusinessCardMockups:', error)
      return res.status(500).json({ error: error.message })
    }
  },

  async updateBusinessCardChosen(req, res) {
    try {
      const { id: conceptualization_id } = req.params
      const { history_id } = req.body
      console.log(
        'conceptualization_id, history_id',
        conceptualization_id,
        history_id
      )
      await BusinessCardHistory.updateChosen(conceptualization_id, history_id)
      res.json({ updated: true })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
