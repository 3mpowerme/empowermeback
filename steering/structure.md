# Estructura del proyecto

## Layout general

empowermeback/
├── documentation/ # Documentación funcional y técnica de endpoints
├── src/
│   ├── config/ # Configuraciones de entorno y app
│   ├── controllers/ # Controladores por módulo
│   ├── middlewares/ # Middlewares de auth/validación/error
│   ├── models/ # Modelos de datos
│   ├── routes/ # Definición de rutas API
│   ├── schemas/ # Esquemas/validaciones
│   ├── services/ # Lógica de negocio y acceso a integraciones
│   ├── templates/ # Plantillas auxiliares
│   ├── utils/ # Utilidades compartidas
│   └── validations/ # Reglas de validación específicas
└── steering/ # Archivos de dirección técnica y de producto

## Convenciones clave
- JavaScript (sin TypeScript).
- Organización por capas manteniendo separación de responsabilidades.
- Nuevos endpoints deben seguir patrón route -> controller -> service.
- Reutilizar validaciones y utilidades existentes antes de crear nuevas.

## API y mantenimiento
- Mantener consistencia de naming entre routes/controllers/models/schemas.
- Documentar cambios relevantes en `documentation/` cuando aplique.
- Evitar refactors no solicitados en tareas puntuales.
