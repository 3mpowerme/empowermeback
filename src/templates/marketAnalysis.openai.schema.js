export const MARKET_ANALYSIS_JSON_OPENAI_SCHEMA = {
  title: 'analisis_viabilidad',
  type: 'object',
  additionalProperties: false,
  properties: {
    meta_moneda: {
      type: 'object',
      additionalProperties: false,
      required: ['locale', 'currency'],
      properties: {
        locale: { type: 'string', minLength: 2 },
        currency: { type: 'string', pattern: '^[A-Z]{3}$' },
      },
    },
    resumen: {
      type: 'object',
      additionalProperties: false,
      properties: {
        idea: { type: 'string' },
        puntos_fuertes: { type: 'array', items: { type: 'string' } },
        alertas: { type: 'array', items: { type: 'string' } },
      },
      required: ['idea', 'puntos_fuertes', 'alertas'],
    },
    clientes: {
      type: 'object',
      additionalProperties: false,
      properties: {
        segmentos: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              nombre: { type: 'string' },
              edad_rango: { type: 'string', pattern: '^\\d{2}-\\d{2}$' },
              nivel_ingreso: {
                type: 'string',
                enum: ['bajo', 'medio', 'alto'],
              },
              necesidades: { type: 'array', items: { type: 'string' } },
              dolores: { type: 'array', items: { type: 'string' } },
            },
            required: [
              'nombre',
              'edad_rango',
              'nivel_ingreso',
              'necesidades',
              'dolores',
            ],
          },
        },
        tamaño_mercado: {
          type: 'object',
          additionalProperties: false,
          properties: {
            metodo: {
              type: 'string',
              enum: ['top-down', 'bottom-up', 'mixto'],
            },
            estimacion_clientes: {
              type: 'object',
              additionalProperties: false,
              properties: {
                min: { type: 'number', minimum: 0 },
                max: { type: 'number', minimum: 0 },
                supuesto_clave: { type: 'string' },
              },
              required: ['min', 'max', 'supuesto_clave'],
            },
            disposicion_pagar: {
              type: 'object',
              additionalProperties: false,
              properties: {
                rango: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    min: { type: 'number', minimum: 0 },
                    max: { type: 'number', minimum: 0 },
                  },
                  required: ['min', 'max'],
                },
                sensibilidad_precio: {
                  type: 'string',
                  enum: ['baja', 'media', 'alta'],
                },
              },
              required: ['rango', 'sensibilidad_precio'],
            },
          },
          required: ['metodo', 'estimacion_clientes', 'disposicion_pagar'],
        },
        personas_ejemplo: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              nombre: { type: 'string' },
              descripcion: { type: 'string' },
              motivadores: { type: 'array', items: { type: 'string' } },
              objeciones: { type: 'array', items: { type: 'string' } },
            },
            required: ['nombre', 'descripcion', 'motivadores', 'objeciones'],
          },
        },
      },
      required: ['segmentos', 'tamaño_mercado', 'personas_ejemplo'],
    },
    escenario_competitivo: {
      type: 'object',
      additionalProperties: false,
      properties: {
        competidores_directos: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              nombre: { type: 'string' },
              propuesta: { type: 'string' },
              precio_relativo: {
                type: 'string',
                enum: ['bajo', 'medio', 'alto'],
              },
              fortalezas: { type: 'array', items: { type: 'string' } },
              debilidades: { type: 'array', items: { type: 'string' } },
            },
            required: [
              'nombre',
              'propuesta',
              'precio_relativo',
              'fortalezas',
              'debilidades',
            ],
          },
        },
        competidores_indirectos: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              tipo: { type: 'string' },
              sustituto_de: { type: 'string' },
              riesgo: { type: 'string', enum: ['bajo', 'medio', 'alto'] },
            },
            required: ['tipo', 'sustituto_de', 'riesgo'],
          },
        },
        saturacion_mercado: {
          type: 'string',
          enum: ['baja', 'media', 'alta'],
        },
        oportunidades_diferenciacion: {
          type: 'array',
          items: { type: 'string' },
        },
        barreras_entrada: { type: 'array', items: { type: 'string' } },
      },
      required: [
        'competidores_directos',
        'competidores_indirectos',
        'saturacion_mercado',
        'oportunidades_diferenciacion',
        'barreras_entrada',
      ],
    },
    ubicacion_o_canal: {
      type: 'object',
      additionalProperties: false,
      properties: {
        recomendacion: {
          type: 'object',
          additionalProperties: false,
          properties: {
            tipo: {
              type: 'string',
              enum: ['tienda_física', 'online', 'híbrido'],
            },
            zona_o_plataforma: { type: 'string' },
          },
          required: ['tipo', 'zona_o_plataforma'],
        },
        justificacion: { type: 'array', items: { type: 'string' } },
        factores_exito: { type: 'array', items: { type: 'string' } },
        opciones_alternativas: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: [
        'recomendacion',
        'justificacion',
        'factores_exito',
        'opciones_alternativas',
      ],
    },
    identidad_imagen: {
      type: 'object',
      additionalProperties: false,
      properties: {
        propuesta_valor: { type: 'string' },
        promesa_marca: { type: 'string' },
        tono_y_estilo: { type: 'array', items: { type: 'string' } },
        diferenciadores_clave: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: [
        'propuesta_valor',
        'promesa_marca',
        'tono_y_estilo',
        'diferenciadores_clave',
      ],
    },
    finanzas: {
      type: 'object',
      additionalProperties: false,
      properties: {
        inversion_inicial: {
          type: 'object',
          additionalProperties: false,
          properties: {
            rubro: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  concepto: { type: 'string' },
                  amount: { type: 'number', minimum: 0 },
                },
                required: ['concepto', 'amount'],
              },
            },
            total: { type: 'number', minimum: 0 },
          },
          required: ['rubro', 'total'],
        },
        costos_fijos_mensuales: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              concepto: { type: 'string' },
              amount: { type: 'number', minimum: 0 },
            },
            required: ['concepto', 'amount'],
          },
        },
        costos_variables: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              concepto: { type: 'string' },
              porcentaje_sobre_ventas: {
                type: 'number',
                minimum: 0,
                maximum: 100,
              },
            },
            required: ['concepto', 'porcentaje_sobre_ventas'],
          },
        },
        precio_promedio: { type: 'number', minimum: 0 },
        volumen_mensual_estimado: {
          type: 'object',
          additionalProperties: false,
          properties: {
            min: { type: 'number', minimum: 0 },
            max: { type: 'number', minimum: 0 },
          },
          required: ['min', 'max'],
        },
        punto_equilibrio: {
          type: 'object',
          additionalProperties: false,
          properties: {
            unidades: { type: 'number', minimum: 0 },
            ventas: { type: 'number', minimum: 0 },
            formula: {
              type: 'string',
              const: 'Costos Fijos / (Precio - Costo Variable Unitario)',
            },
          },
          required: ['unidades', 'ventas', 'formula'],
        },
        margen_esperado: {
          type: 'object',
          additionalProperties: false,
          properties: {
            'bruto_%': { type: 'number', minimum: 0, maximum: 100 },
            'operativo_%': { type: 'number', minimum: 0, maximum: 100 },
          },
          required: ['bruto_%', 'operativo_%'],
        },
        'roi_anual_estimado_%': { type: 'number' },
        riesgos_financieros: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: [
        'inversion_inicial',
        'costos_fijos_mensuales',
        'costos_variables',
        'precio_promedio',
        'volumen_mensual_estimado',
        'punto_equilibrio',
        'margen_esperado',
        'roi_anual_estimado_%',
        'riesgos_financieros',
      ],
    },
    factores_estrategicos: {
      type: 'object',
      additionalProperties: false,
      properties: {
        equipo: {
          type: 'object',
          additionalProperties: false,
          properties: {
            capacidades_clave: {
              type: 'array',
              items: { type: 'string' },
            },
            brechas: { type: 'array', items: { type: 'string' } },
          },
          required: ['capacidades_clave', 'brechas'],
        },
        permisos_y_regulaciones: {
          type: 'array',
          items: { type: 'string' },
        },
        proveedores_y_logistica: {
          type: 'object',
          additionalProperties: false,
          properties: {
            criticos: { type: 'array', items: { type: 'string' } },
            plan_b: { type: 'array', items: { type: 'string' } },
          },
          required: ['criticos', 'plan_b'],
        },
        alianzas_potenciales: {
          type: 'array',
          items: { type: 'string' },
        },
        factores_externos: { type: 'array', items: { type: 'string' } },
      },
      required: [
        'equipo',
        'permisos_y_regulaciones',
        'proveedores_y_logistica',
        'alianzas_potenciales',
        'factores_externos',
      ],
    },
    riesgos_y_mitigantes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          riesgo: { type: 'string' },
          probabilidad: {
            type: 'string',
            enum: ['baja', 'media', 'alta'],
          },
          impacto: { type: 'string', enum: ['bajo', 'medio', 'alto'] },
          mitigacion: { type: 'string' },
        },
        required: ['riesgo', 'probabilidad', 'impacto', 'mitigacion'],
      },
    },
    kpis_sugeridos: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          nombre: { type: 'string' },
          periodicidad: {
            type: 'string',
            enum: ['semanal', 'mensual', 'trimestral'],
          },
          meta: { type: 'string' },
        },
        required: ['nombre', 'periodicidad', 'meta'],
      },
    },
    suposiciones: { type: 'array', items: { type: 'string' } },
    veredicto: {
      type: 'object',
      additionalProperties: false,
      properties: {
        nivel: { type: 'string', enum: ['Alta', 'Moderada', 'Baja'] },
        conclusion: { type: 'string' },
        razones_clave: { type: 'array', items: { type: 'string' } },
        condiciones_para_exito: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: [
        'nivel',
        'conclusion',
        'razones_clave',
        'condiciones_para_exito',
      ],
    },
  },
  required: [
    'meta_moneda',
    'resumen',
    'clientes',
    'escenario_competitivo',
    'ubicacion_o_canal',
    'identidad_imagen',
    'finanzas',
    'factores_estrategicos',
    'riesgos_y_mitigantes',
    'kpis_sugeridos',
    'suposiciones',
    'veredicto',
  ],
}
