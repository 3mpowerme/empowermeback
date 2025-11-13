export const ANALYSIS_AND_BUSINESS_PLAN_JSON_OPENAI_SCHEMA = {
  title: 'analisis_de_viabilidad_y_plan_de_negocios',
  type: 'object',
  additionalProperties: false,
  properties: {
    analisis_de_viabilidad: {
      type: 'object',
      additionalProperties: false,
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
                required: [
                  'nombre',
                  'descripcion',
                  'motivadores',
                  'objeciones',
                ],
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
    },
    plan_de_negocios: {
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
              required: [
                'infraestructura',
                'equipamiento',
                'proveedores_clave',
              ],
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
                  responsabilidades: {
                    type: 'array',
                    items: { type: 'string' },
                  },
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
                  responsabilidades: {
                    type: 'array',
                    items: { type: 'string' },
                  },
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
                  responsabilidades: {
                    type: 'array',
                    items: { type: 'string' },
                  },
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
            condiciones_para_exito: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
    },
  },
  required: ['analisis_de_viabilidad', 'plan_de_negocios'],
}
