export const ECONOMIC_ACTIVITIES_JSON_OPENAI_SCHEMA = {
  title: 'activades_economicas_del_negocio',
  type: 'object',
  additionalProperties: false,
  properties: {
    options: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['code', 'name'],
        properties: {
          code: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
  required: ['options'],
}
