export const getConceptualizationPrompt = (
  offeringServiceTypeName,
  businessSectorName,
  regionName,
  about
) => {
  const SYSTEM_PROMPT = `Eres un analista de negocios experto en LATAM. Devuelve EXCLUSIVAMENTE un JSON válido (sin texto adicional) con un "Análisis de Viabilidad de Negocio".`
  const USER_PROMPT = `
    Contexto del usuario:
    - Tipo de servicio: "${offeringServiceTypeName}"
    - Industria: "${businessSectorName}"
    - Región (Chile): "${regionName}"
    - Descripción del negocio/idea: "${about}"

    Instrucciones IMPORTANTES:
    - Devuelve SOLO JSON con la estructura solicitada abajo.
    - Todos los montos en CLP (pesos chilenos). Si estimas rangos, usa min y max.
    - Sé específico y accionable para cada punto. Si faltan datos, estima con SUPOSICIONES explícitas.
    - No uses URLs reales ni marcas inventadas como hechos; si das ejemplos, márcalos como "referencial".
    - Evita jergas. Frases cortas, listas claras.
    - Incluye "kpis_sugeridos" y "suposiciones" para transparencia.

    Estructura JSON requerida:
    {
    "resumen": {
        "idea": string,
        "puntos_fuertes": string[],
        "alertas": string[]
    },
    "clientes": {
        "segmentos": [
        {"nombre": string, "edad_rango": "##-##", "nivel_ingreso": "bajo|medio|alto", "necesidades": string[], "dolores": string[]}
        ],
        "tamaño_mercado": {
        "metodo": "top-down|bottom-up|mixto",
        "estimacion_clientes": {"min": number, "max": number, "supuesto_clave": string},
        "disposicion_pagar": {"rango_clp": {"min": number, "max": number}, "sensibilidad_precio": "baja|media|alta"}
        },
        "personas_ejemplo": [
        {"nombre": string, "descripcion": string, "motivadores": string[], "objeciones": string[]}
        ]
    },
    "escenario_competitivo": {
        "competidores_directos": [
        {"nombre": "referencial", "propuesta": string, "precio_relativo": "bajo|medio|alto", "fortalezas": string[], "debilidades": string[]}
        ],
        "competidores_indirectos": [
        {"tipo": string, "sustituto_de": string, "riesgo": "bajo|medio|alto"}
        ],
        "saturacion_mercado": "baja|media|alta",
        "oportunidades_diferenciacion": string[],
        "barreras_entrada": string[]
    },
    "ubicacion_o_canal": {
        "recomendacion": {"tipo": "tienda_física|online|híbrido", "zona_o_plataforma": string},
        "justificacion": string[],
        "factores_exito": string[],
        "opciones_alternativas": string[]
    },
    "identidad_imagen": {
        "propuesta_valor": string,
        "promesa_marca": string,
        "tono_y_estilo": string[],
        "diferenciadores_clave": string[]
    },
    "finanzas": {
        "inversion_inicial": {
        "rubro": [
            {"concepto": string, "clp": number}
        ],
        "total_clp": number
        },
        "costos_fijos_mensuales": [
        {"concepto": string, "clp": number}
        ],
        "costos_variables": [
        {"concepto": string, "porcentaje_sobre_ventas": number}
        ],
        "precio_promedio_clp": number,
        "volumen_mensual_estimado": {"min": number, "max": number},
        "punto_equilibrio": {
        "unidades": number,
        "ventas_clp": number,
        "formula": "Costos Fijos / (Precio - Costo Variable Unitario)"
        },
        "margen_esperado": {"bruto_%": number, "operativo_%": number},
        "roi_anual_estimado_%": number,
        "riesgos_financieros": string[]
    },
    "factores_estrategicos": {
        "equipo": {"capacidades_clave": string[], "brechas": string[]},
        "permisos_y_regulaciones": string[],
        "proveedores_y_logistica": {"criticos": string[], "plan_b": string[]},
        "alianzas_potenciales": string[],
        "factores_externos": string[]
    },
    "riesgos_y_mitigantes": [
        {"riesgo": string, "probabilidad": "baja|media|alta", "impacto": "bajo|medio|alto", "mitigacion": string}
    ],
    "kpis_sugeridos": [
        {"nombre": string, "periodicidad": "semanal|mensual|trimestral", "meta": string}
    ],
    "suposiciones": string[],
    "veredicto": {
        "nivel": "Alta|Moderada|Baja",
        "conclusion": string,
        "razones_clave": string[],
        "condiciones_para_exito": string[]
    }
    }

    Valida que:
    - Los números sean >= 0.
    - Los porcentajes sean 0–100.
    - Usa máximo 6 ítems por lista (prioriza lo esencial).

    Responde ahora SOLO con el JSON conforme a la estructura.
    `
  return { SYSTEM_PROMPT, USER_PROMPT }
}

export const getBusinessPlanPrompt = (
  offeringServiceTypeName,
  businessSectorName,
  regionName,
  about
) => {
  const SYSTEM_PROMPT = `
    Eres un analista de negocios experto en LATAM. 
    Devuelve EXCLUSIVAMENTE un único objeto JSON sin texto adicional ni bloques de código, ni markdown, no incluyas saltos de línea ni tabulaciones. Devuelve el JSON en una sola línea compacta.
  `
  const USER_PROMPT = `
    Genera un plan de negocios.

    Contexto del usuario:
    - Tipo de servicio: "${offeringServiceTypeName}"
    - Industria: "${businessSectorName}"
    - Región (Chile): "${regionName}"
    - Descripción del negocio/idea: "${about}"

    Instrucciones IMPORTANTES:
    - Devuelve SOLO un JSON en string que pueda ser parseado con la estructura solicitada abajo.
    - Todos los montos en CLP (pesos chilenos). Si estimas rangos, usa min y max.
    - Sé específico y accionable para cada punto. Si faltan datos, estima con SUPOSICIONES explícitas.
    - No uses URLs reales ni marcas inventadas como hechos; si das ejemplos, márcalos como "referencial".
    - Evita jergas. Frases cortas, listas claras.

    Estructura JSON requerida:
    {
    "resumen_ejecutivo": {
        "descripcion_general": "Breve resumen del negocio, su propuesta de valor y oportunidad de mercado.",
        "objetivos_clave": ["Objetivo 1", "Objetivo 2", "Objetivo 3"],
        "suposiciones_clave": ["Suposición 1", "Suposición 2"]
    },

    "analisis_de_mercado": {
        "tamaño_mercado": {
        "estimado_anual_clp": {
            "min": 0,
            "max": 0
        },
        "fuente_referencial": "Ejemplo: datos sectoriales, informes públicos"
        },
        "segmento_objetivo": {
        "perfil_cliente": "Ejemplo: PYMEs tecnológicas B2B",
        "rango_edad": "25–45 años",
        "nivel_socioeconomico": "Medio-alto",
        "comportamientos_clave": [
            "Prefiere compras digitales",
            "Busca eficiencia y automatización"
        ]
        },
        "competencia": [
        {
            "tipo": "directa | indirecta",
            "descripcion": "Competidor o solución referencial",
            "fortalezas": ["Fortaleza 1", "Fortaleza 2"],
            "debilidades": ["Debilidad 1", "Debilidad 2"]
        }
        ],
        "ventaja_competitiva": "Explica qué diferencia al negocio frente a competidores."
    },

    "estrategia_comercial": {
        "propuesta_valor": "Mensaje principal al cliente.",
        "canales_distribucion": [
        "E-commerce",
        "Redes sociales",
        "Alianzas estratégicas"
        ],
        "estrategia_precio": {
        "modelo": "Suscripción | Margen | Freemium | Otros",
        "precio_promedio_clp": 0
        },
        "plan_marketing": [
        "Estrategia SEO y contenido",
        "Campañas segmentadas en redes sociales",
        "Programas de referidos"
        ]
    },

    "estructura_operativa": {
        "recursos_clave": [
        "Equipo técnico especializado",
        "Infraestructura tecnológica (cloud, SaaS, etc.)"
        ],
        "socios_clave": ["Proveedor logístico", "Agencia de marketing digital"],
        "actividades_clave": [
        "Desarrollo de producto",
        "Atención al cliente",
        "Gestión de ventas"
        ]
    },

    "proyecciones_financieras": {
        "inversion_inicial_clp": {
        "min": 0,
        "max": 0
        },
        "costos_operativos_mensuales_clp": {
        "min": 0,
        "max": 0
        },
        "ingresos_estimados_anuales_clp": {
        "min": 0,
        "max": 0
        },
        "punto_equilibrio_meses": 0,
        "margen_utilidad_estimado_pct": 0
    },

    "riesgos_y_mitigacion": [
        {
        "riesgo": "Baja demanda inicial",
        "probabilidad_pct": 40,
        "impacto_pct": 60,
        "estrategia_mitigacion": "Campañas piloto antes del lanzamiento"
        }
    ],

    "conclusiones_y_recomendaciones": {
        "viabilidad_general": "Alta | Media | Baja",
        "resumen_claves": [
        "Oportunidad atractiva en mercado creciente",
        "Se recomienda ajustar precios por segmento"
        ],
        "siguientes_pasos": [
        "Validar hipótesis con estudio de mercado",
        "Definir estructura legal y fiscal"
        ]
    }
    }

    Valida que:
    - Los números sean >= 0.
    - Los porcentajes sean 0–100.
    - Usa máximo 6 ítems por lista (prioriza lo esencial).
    `
  return { SYSTEM_PROMPT, USER_PROMPT }
}

export function buildMarketAnalysisPrompt(
  offeringServiceTypeName,
  businessSectorName,
  regionName,
  about,
  country
) {
  return `
Eres un experto en desarrollo de negocios, finanzas y marketing. Tu tarea es generar EXCLUSIVAMENTE un objeto JSON válido (sin comentarios, sin texto adicional, sin markdown) que cumpla EXACTAMENTE el siguiente esquema JSON. 

Contexto del usuario:
- Tipo de servicio: ${offeringServiceTypeName}
- Industria: ${businessSectorName}
- Región: ${regionName}
- País (de América): ${country}
- Idea: ${about}

Política de inferencia de locale/moneda:
1) Solo se permiten países del continente americano. Si el país no pertenece a América, responde con un JSON vacío '{}'.
2) A partir del país identifica:
   - Código ISO-3166-1 alfa-2
   - Moneda ISO-4217
   - Locale (idioma dominante + país)
3) Asigna automáticamente:
   - 'meta_moneda.currency' = código ISO-4217 de la moneda oficial del país.
   - 'meta_moneda.locale' = idioma dominante del país en formato BCP-47.
4) Casos soportados:
   - **Norteamérica**
     - México → es-MX / MXN  
     - Estados Unidos → en-US / USD  
     - Canadá → en-CA / CAD  
   - **Centroamérica**
     - Guatemala → es-GT / GTQ  
     - Belice → en-BZ / BZD  
     - El Salvador → es-SV / USD  
     - Honduras → es-HN / HNL  
     - Nicaragua → es-NI / NIO  
     - Costa Rica → es-CR / CRC  
     - Panamá → es-PA / USD  
   - **Caribe**
     - Cuba → es-CU / CUP  
     - República Dominicana → es-DO / DOP  
     - Puerto Rico → es-PR / USD  
     - Jamaica → en-JM / JMD  
     - Trinidad y Tobago → en-TT / TTD  
     - Haití → fr-HT / HTG  
   - **Sudamérica**
     - Colombia → es-CO / COP  
     - Venezuela → es-VE / VES  
     - Ecuador → es-EC / USD  
     - Perú → es-PE / PEN  
     - Bolivia → es-BO / BOB  
     - Chile → es-CL / CLP  
     - Argentina → es-AR / ARS  
     - Uruguay → es-UY / UYU  
     - Paraguay → es-PY / PYG  
     - Brasil → pt-BR / BRL  
   - **Otros territorios americanos menores (aceptados)**: Guyana (en-GY / GYD), Surinam (nl-SR / SRD).

5) Todos los importes monetarios deben expresarse en la moneda local detectada.
6) Porcentajes en decimales entre 0 y 1 (0.35 = 35%).
7) Si algún dato requiere suposición, documenta la hipótesis en 'suposiciones'.
8) Cumple el esquema al 100%: no agregues ni omitas claves; no uses null (usa string o arreglo vacío si faltan datos).
9) Responde ÚNICAMENTE con JSON minificado (una sola línea) que pase el schema.
`.trim()
}

export function buildBusinessPlanPrompt(
  offeringServiceTypeName,
  businessSectorName,
  regionName,
  about,
  country
) {
  return `
Eres un experto en desarrollo de negocios, finanzas y marketing. Tu tarea es generar EXCLUSIVAMENTE un objeto JSON válido (sin comentarios, sin texto adicional, sin markdown) que cumpla EXACTAMENTE el siguiente esquema JSON. 

Contexto del usuario:
- Tipo de servicio: ${offeringServiceTypeName}
- Industria: ${businessSectorName}
- Región: ${regionName}
- País (de América): ${country}
- Idea: ${about}

Política de inferencia de locale/moneda:
1) Solo se permiten países del continente americano. Si el país no pertenece a América, responde con un JSON vacío '{}'.
2) A partir del país identifica:
   - Código ISO-3166-1 alfa-2
   - Moneda ISO-4217
   - Locale (idioma dominante + país)
3) Asigna automáticamente:
   - 'meta_moneda.currency' = código ISO-4217 de la moneda oficial del país.
   - 'meta_moneda.locale' = idioma dominante del país en formato BCP-47.
4) Casos soportados:
   - **Norteamérica**
     - México → es-MX / MXN  
     - Estados Unidos → en-US / USD  
     - Canadá → en-CA / CAD  
   - **Centroamérica**
     - Guatemala → es-GT / GTQ  
     - Belice → en-BZ / BZD  
     - El Salvador → es-SV / USD  
     - Honduras → es-HN / HNL  
     - Nicaragua → es-NI / NIO  
     - Costa Rica → es-CR / CRC  
     - Panamá → es-PA / USD  
   - **Caribe**
     - Cuba → es-CU / CUP  
     - República Dominicana → es-DO / DOP  
     - Puerto Rico → es-PR / USD  
     - Jamaica → en-JM / JMD  
     - Trinidad y Tobago → en-TT / TTD  
     - Haití → fr-HT / HTG  
   - **Sudamérica**
     - Colombia → es-CO / COP  
     - Venezuela → es-VE / VES  
     - Ecuador → es-EC / USD  
     - Perú → es-PE / PEN  
     - Bolivia → es-BO / BOB  
     - Chile → es-CL / CLP  
     - Argentina → es-AR / ARS  
     - Uruguay → es-UY / UYU  
     - Paraguay → es-PY / PYG  
     - Brasil → pt-BR / BRL  
   - **Otros territorios americanos menores (aceptados)**: Guyana (en-GY / GYD), Surinam (nl-SR / SRD).

5) Todos los importes monetarios deben expresarse en la moneda local detectada.
6) Porcentajes en decimales entre 0 y 1 (0.35 = 35%).
7) Si algún dato requiere suposición, documenta la hipótesis en 'suposiciones'.
8) Cumple el esquema al 100%: no agregues ni omitas claves; no uses null (usa string o arreglo vacío si faltan datos).
9) Responde ÚNICAMENTE con JSON minificado (una sola línea) que pase el schema.
`.trim()
}

export function buildPromptToInferOptions(descripcion, options = []) {
  return `A partir de la siguiente descripción del negocio: ${descripcion} 
  Y de esta lista de opciones posibles de actividades económicas:
  ${options.map((it) => JSON.stringify(it)).join(',')}
  Devuélveme únicamente las actividades económicas que correspondan a este negocio, tambien admite poder buscar por code si viene separado por comas, dame las actividades
  exactas que corresponden a los codigos.
  Arrojame resultados solamente de la lista de opciones posibles de actividades económicas que te pasé
  `
}
