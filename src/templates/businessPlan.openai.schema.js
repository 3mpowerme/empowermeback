export const BUSINESS_PLAN_JSON_OPENAI_SCHEMA = {
  title: 'Plan de Negocios',
  type: 'object',
  additionalProperties: false,
  required: [
    'meta_moneda',
    'resumen_ejecutivo',
    'descripcion_negocio',
    'analisis_mercado',
    'producto_servicio',
    'marketing_ventas',
    'plan_operativo',
    'estructura_organizacional',
    'plan_financiero',
    'plan_implementacion',
    'veredicto',
  ],
  properties: {
    meta_moneda: {
      type: 'object',
      additionalProperties: false,
      required: ['locale', 'currency'],
      properties: {
        locale: { type: 'string', description: 'Ejemplo: es-MX, es-CL' },
        currency: { type: 'string', description: 'Ejemplo: MXN, CLP' },
      },
    },

    resumen_ejecutivo: {
      type: 'object',
      additionalProperties: false,
      required: [
        'vision_clara',
        'puntos_clave',
        'propuesta_valor',
        'objetivo_general',
      ],
      properties: {
        vision_clara: { type: 'string' },
        puntos_clave: { type: 'array', items: { type: 'string' } },
        propuesta_valor: { type: 'string' },
        objetivo_general: { type: 'string' },
      },
    },

    descripcion_negocio: {
      type: 'object',
      additionalProperties: false,
      required: [
        'mision',
        'vision',
        'objetivos',
        'estructura_legal',
        'ubicacion',
        'historia',
      ],
      properties: {
        mision: { type: 'string' },
        vision: { type: 'string' },
        objetivos: { type: 'array', items: { type: 'string' } },
        estructura_legal: { type: 'string' },
        ubicacion: { type: 'string' },
        historia: { type: 'string' },
      },
    },

    analisis_mercado: {
      type: 'object',
      additionalProperties: false,
      required: [
        'tamano',
        'segmentos_clientes',
        'competencia',
        'oportunidades',
      ],
      properties: {
        tamano: {
          type: 'object',
          additionalProperties: false,
          required: ['metodo', 'estimacion_clientes'],
          properties: {
            metodo: { type: 'string' },
            estimacion_clientes: {
              type: 'object',
              additionalProperties: false,
              required: ['min', 'max'],
              properties: {
                min: { type: 'number', minimum: 0 },
                max: { type: 'number', minimum: 0 },
              },
            },
          },
        },
        segmentos_clientes: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: [
              'nombre',
              'perfil',
              'necesidades',
              'dolores',
              'disposicion_pagar',
            ],
            properties: {
              nombre: { type: 'string' },
              perfil: { type: 'string' },
              necesidades: { type: 'array', items: { type: 'string' } },
              dolores: { type: 'array', items: { type: 'string' } },
              disposicion_pagar: {
                type: 'object',
                additionalProperties: false,
                required: ['rango', 'sensibilidad_precio'],
                properties: {
                  rango: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['min', 'max'],
                    properties: {
                      min: { type: 'number', minimum: 0 },
                      max: { type: 'number', minimum: 0 },
                    },
                  },
                  sensibilidad_precio: { type: 'string' },
                },
              },
            },
          },
        },
        competencia: {
          type: 'object',
          additionalProperties: false,
          required: [
            'directa',
            'indirecta',
            'barreras_entrada',
            'oportunidades',
          ],
          properties: {
            directa: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: [
                  'nombre',
                  'propuesta',
                  'precio_relativo',
                  'fortalezas',
                  'debilidades',
                ],
                properties: {
                  nombre: { type: 'string' },
                  propuesta: { type: 'string' },
                  precio_relativo: { type: 'string' },
                  fortalezas: { type: 'array', items: { type: 'string' } },
                  debilidades: { type: 'array', items: { type: 'string' } },
                },
              },
            },
            indirecta: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['tipo', 'sustituto_de', 'riesgo'],
                properties: {
                  tipo: { type: 'string' },
                  sustituto_de: { type: 'string' },
                  riesgo: { type: 'string' },
                },
              },
            },
            barreras_entrada: { type: 'array', items: { type: 'string' } },
            oportunidades: { type: 'array', items: { type: 'string' } },
          },
        },
        oportunidades: { type: 'array', items: { type: 'string' } },
      },
    },

    producto_servicio: {
      type: 'object',
      additionalProperties: false,
      required: ['oferta', 'beneficios', 'diferenciadores', 'roadmap'],
      properties: {
        oferta: { type: 'string' },
        beneficios: { type: 'array', items: { type: 'string' } },
        diferenciadores: { type: 'array', items: { type: 'string' } },
        roadmap: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: [
              'nombre',
              'descripcion',
              'inicio',
              'fin',
              'dependencias',
            ],
            properties: {
              nombre: { type: 'string' },
              descripcion: { type: 'string' },
              inicio: { type: 'string', format: 'date' },
              fin: { type: 'string', format: 'date' },
              dependencias: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },

    marketing_ventas: {
      type: 'object',
      additionalProperties: false,
      required: ['precios', 'canales', 'promocion', 'posicionamiento'],
      properties: {
        precios: {
          type: 'object',
          additionalProperties: false,
          required: ['precio_promedio', 'estrategia_precio'],
          properties: {
            precio_promedio: { type: 'number', minimum: 0 },
            estrategia_precio: { type: 'string' },
          },
        },
        canales: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['tipo', 'descripcion'],
            properties: {
              tipo: { type: 'string' },
              descripcion: { type: 'string' },
            },
          },
        },
        promocion: { type: 'array', items: { type: 'string' } },
        posicionamiento: { type: 'string' },
      },
    },

    plan_operativo: {
      type: 'object',
      additionalProperties: false,
      required: ['procesos', 'recursos', 'tecnologia', 'logistica'],
      properties: {
        procesos: { type: 'array', items: { type: 'string' } },
        recursos: {
          type: 'object',
          additionalProperties: false,
          required: ['infraestructura', 'equipamiento', 'proveedores_clave'],
          properties: {
            infraestructura: { type: 'string' },
            equipamiento: { type: 'string' },
            proveedores_clave: { type: 'array', items: { type: 'string' } },
          },
        },
        tecnologia: { type: 'string' },
        logistica: { type: 'string' },
      },
    },

    estructura_organizacional: {
      type: 'object',
      additionalProperties: false,
      required: ['roles', 'equipo_fundador', 'personal_clave'],
      properties: {
        roles: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['rol', 'responsabilidades'],
            properties: {
              rol: { type: 'string' },
              responsabilidades: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        equipo_fundador: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['nombre', 'rol', 'experiencia', 'responsabilidades'],
            properties: {
              nombre: { type: 'string' },
              rol: { type: 'string' },
              experiencia: { type: 'string' },
              responsabilidades: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        personal_clave: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['nombre', 'rol', 'experiencia', 'responsabilidades'],
            properties: {
              nombre: { type: 'string' },
              rol: { type: 'string' },
              experiencia: { type: 'string' },
              responsabilidades: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },

    plan_financiero: {
      type: 'object',
      additionalProperties: false,
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
      properties: {
        inversion_inicial: {
          type: 'object',
          additionalProperties: false,
          required: ['rubro', 'total'],
          properties: {
            rubro: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['concepto', 'amount'],
                properties: {
                  concepto: { type: 'string' },
                  amount: { type: 'number', minimum: 0 },
                },
              },
            },
            total: { type: 'number', minimum: 0 },
          },
        },
        costos_fijos_mensuales: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['concepto', 'amount'],
            properties: {
              concepto: { type: 'string' },
              amount: { type: 'number', minimum: 0 },
            },
          },
        },
        costos_variables: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['concepto', 'porcentaje_sobre_ventas'],
            properties: {
              concepto: { type: 'string' },
              porcentaje_sobre_ventas: {
                type: 'number',
                minimum: 0,
                maximum: 1,
              },
            },
          },
        },
        precio_promedio: { type: 'number', minimum: 0 },
        volumen_mensual_estimado: {
          type: 'object',
          additionalProperties: false,
          required: ['min', 'max'],
          properties: {
            min: { type: 'number', minimum: 0 },
            max: { type: 'number', minimum: 0 },
          },
        },
        punto_equilibrio: {
          type: 'object',
          additionalProperties: false,
          required: ['unidades', 'ventas', 'formula'],
          properties: {
            unidades: { type: 'number', minimum: 0 },
            ventas: { type: 'number', minimum: 0 },
            formula: { type: 'string' },
          },
        },
        margen_esperado: {
          type: 'object',
          additionalProperties: false,
          required: ['bruto_%', 'operativo_%'],
          properties: {
            'bruto_%': { type: 'number', minimum: 0 },
            'operativo_%': { type: 'number', minimum: 0 },
          },
        },
        'roi_anual_estimado_%': { type: 'number', minimum: 0 },
        riesgos_financieros: { type: 'array', items: { type: 'string' } },
      },
    },

    plan_implementacion: {
      type: 'object',
      additionalProperties: false,
      required: ['cronograma', 'hitos', 'riesgos', 'mitigaciones'],
      properties: {
        cronograma: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: [
              'nombre',
              'descripcion',
              'inicio',
              'fin',
              'dependencias',
            ],
            properties: {
              nombre: { type: 'string' },
              descripcion: { type: 'string' },
              inicio: { type: 'string', format: 'date' },
              fin: { type: 'string', format: 'date' },
              dependencias: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        hitos: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: [
              'nombre',
              'descripcion',
              'inicio',
              'fin',
              'dependencias',
            ],
            properties: {
              nombre: { type: 'string' },
              descripcion: { type: 'string' },
              inicio: { type: 'string', format: 'date' },
              fin: { type: 'string', format: 'date' },
              dependencias: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        riesgos: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['riesgo', 'probabilidad', 'impacto', 'mitigacion'],
            properties: {
              riesgo: { type: 'string' },
              probabilidad: { type: 'string' },
              impacto: { type: 'string' },
              mitigacion: { type: 'string' },
            },
          },
        },
        mitigaciones: { type: 'array', items: { type: 'string' } },
      },
    },

    veredicto: {
      type: 'object',
      additionalProperties: false,
      required: [
        'nivel',
        'conclusion',
        'razones_clave',
        'condiciones_para_exito',
      ],
      properties: {
        nivel: { type: 'string' },
        conclusion: { type: 'string' },
        razones_clave: { type: 'array', items: { type: 'string' } },
        condiciones_para_exito: { type: 'array', items: { type: 'string' } },
      },
    },
  },
}
