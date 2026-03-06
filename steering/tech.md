# Stack tecnológico

## Backend
- Runtime: Node.js.
- Lenguaje: JavaScript.
- Arquitectura: API REST modular.

## Componentes técnicos
- Rutas en `src/routes`.
- Controladores en `src/controllers`.
- Servicios de dominio/integración en `src/services`.
- Modelos y esquemas en `src/models` y `src/schemas`.
- Validaciones y middlewares en carpetas dedicadas.

## Comandos comunes (referenciales)
- Instalar dependencias: `npm install`
- Ejecutar en desarrollo: `npm run dev` o `npm start`
- Ejecutar pruebas (si existen): `npm test`
- Lint (si está configurado): `npm run lint`

## Configuración y seguridad
- Configuración por variables de entorno.
- No subir secretos, tokens, llaves o `.env` al repositorio.
- Mantener validaciones y controles de acceso en endpoints sensibles.
