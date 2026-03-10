# Checklist de Entrega del Proyecto EmpowerMe

_Última actualización: 2026-03-10_

## Índice

1. Propósito y alcance
2. Arquitectura global
3. Checklist de validación de entrega
4. Módulo: Autenticación y control de acceso
5. Módulo: Onboarding de empresa (Build Company)
6. Módulo: Perfil central de empresa
7. Módulo: Servicios, planes, suscripciones y cobros
8. Módulo: Solicitudes de servicio e intakes legales/contables
9. Módulo: Citas y Calendly
10. Módulo: Notificaciones y comunicación
11. Módulo: Cuenta de usuario, roles y acceso por funcionalidades
12. Módulo: IA, conceptualización y análisis de mercado
13. Módulo: Landing y adquisición de leads
14. Módulo: Base de datos y activos de automatización
15. Consideraciones de seguridad transversales
16. Checklist final de recepción del cliente

---

## Propósito y alcance

Este documento consolida un checklist completo del estado funcional y técnico de EmpowerMe, cubriendo:

- Landing (`empowermelanding`)
- Frontend (`empowermefront`)
- Backend (`empowermeback`)
- Base de datos y automatizaciones (`dev_androide_17`)

Se utiliza para validación de recepción con cliente y cierre técnico interno.

---

## Arquitectura global

EmpowerMe está distribuido en múltiples repositorios:

- **Landing** para captación y conversión.
- **Frontend** para operación autenticada del usuario.
- **Backend API** para lógica de negocio y orquestación.
- **Repositorio SQL/automatizaciones** para persistencia y soporte operativo.

Integraciones principales: AWS Cognito, Stripe, Calendly y canales de comunicación.

---

## Checklist de validación de entrega

- [x] Inventario funcional integral del sistema.
- [x] Mapeo de módulos backend por dominio.
- [x] Cobertura de responsabilidades frontend y landing.
- [x] Cobertura de capa de base de datos.
- [x] Registro de validaciones, seguridad y casos borde.
- [x] Documento en inglés y español.

---

# Módulo: Autenticación y control de acceso

## 1. Overview
Gestiona ciclo de identidad de usuarios: registro, login, verificación, recuperación de contraseña y acceso a rutas protegidas.

## 2. Business Purpose
Permitir acceso seguro a funcionalidades y restringir vistas/acciones según permisos.

## 3. Module Responsibilities
- Alta de usuarios
- Inicio de sesión
- Recuperación de contraseña
- Resolución de sesión activa
- Protección de rutas frontend/backend

## 4. System Dependencies
### Dependencias internas
- Cuenta/usuarios
- Gestión de features
- Middlewares protegidos

### Dependencias externas
- AWS Cognito

## 5. Database Tables
Entidades de usuarios/sesiones definidas en el esquema SQL principal.

## 6. Backend Structure
`auth.routes.js`, capa de servicios/controladores de auth y middlewares protegidos.

## 7. API Endpoints
`/api/auth/*`, `/api/me`.

## 8. Frontend Components
Páginas de login/signup/verificación/recuperación y callback.

## 9. User Flows
Registro/login -> sesión válida -> navegación protegida.

## 10. Data Flow
Formulario frontend -> endpoint auth -> proveedor identidad -> respuesta sesión.

## 11. Validations
Campos requeridos, formato, validaciones de credenciales y token.

## 12. Security Considerations
Validación de token, protección de endpoints, control de acceso.

## 13. Edge Cases
Credenciales inválidas, token expirado, usuario no verificado.

---

# Módulo: Onboarding de empresa (Build Company)

## 1. Overview
Flujo wizard para crear y configurar empresas en la plataforma.

## 2. Business Purpose
Reducir fricción de alta y habilitar operación temprana del cliente.

## 3. Module Responsibilities
- Captura de datos iniciales
- Validación por pasos
- Persistencia de configuración
- Vinculación usuario-empresa

## 4. System Dependencies
### Dependencias internas
Company, catálogos país/región/rubro, módulos fiscales/legales.

### Dependencias externas
Cognito.

## 5. Database Tables
Tablas de company y tablas relacionadas de configuración/perfil.

## 6. Backend Structure
Rutas build-company públicas/protegidas + capas de dominio company.

## 7. API Endpoints
`/api/build-company/*` y endpoints de company asociados.

## 8. Frontend Components
`BuildCompanyWizardPage` y componentes del flujo.

## 9. User Flows
Inicio wizard -> captura -> validación -> creación empresa -> acceso dashboard.

## 10. Data Flow
Wizard -> API -> servicio dominio -> DB -> respuesta de finalización.

## 11. Validations
Campos obligatorios, coherencia de país/región, duplicados.

## 12. Security Considerations
Persistencia autenticada y ownership checks.

## 13. Edge Cases
Flujo incompleto, duplicidad de empresa, combinaciones legales inválidas.

---

# Módulo: Perfil central de empresa

## 1. Overview
Gestiona datos nucleares de empresa: fiscal, legal, representantes y socios.

## 2. Business Purpose
Consolidar el expediente operativo/legal para prestación de servicios.

## 3. Module Responsibilities
Alta/edición de empresa, datos fiscales, representantes y socios.

## 4. System Dependencies
Catálogos, representante legal, shareholder registry, tax info.

## 5. Database Tables
`companies` y tablas asociadas de perfiles/relaciones.

## 6. Backend Structure
Rutas company/tax/shareholder/legalRepresentative.

## 7. API Endpoints
`/api/company/*`, `/api/company-tax-info/*`, `/api/company-shareholder/*`, `/api/company-legal-representative/*`.

## 8. Frontend Components
Formularios/pantallas de cuenta y datos de empresa.

## 9. User Flows
Usuario admin actualiza perfil -> backend valida -> se persiste.

## 10. Data Flow
Formulario -> API -> servicio/modelo -> DB.

## 11. Validations
Formatos, requeridos, consistencia de relaciones.

## 12. Security Considerations
Restricción por rol y ownership.

## 13. Edge Cases
Actualizaciones conflictivas y datos societarios incompletos.

---

# Módulo: Servicios, planes, suscripciones y cobros

## 1. Overview
Administra catálogo de servicios, planes, suscripciones y pagos.

## 2. Business Purpose
Habilitar monetización y ciclo de vida de contratación.

## 3. Module Responsibilities
Catálogo, suscripción, intents de pago y confirmación de estado.

## 4. System Dependencies
Planes, ofertas de compañía, account/features.

## 5. Database Tables
Entidades de planes, suscripciones y pagos.

## 6. Backend Structure
`plan.routes.js`, `subscription.routes.js`, `billing.routes.js`, `companyOffering.routes.js`.

## 7. API Endpoints
`/api/plan/*`, `/api/subscription/*`, `/api/payments/*`.

## 8. Frontend Components
Pantallas de selección de plan, pago y gestión de suscripción.

## 9. User Flows
Selecciona plan -> paga -> activa suscripción.

## 10. Data Flow
Checkout frontend -> API billing -> Stripe -> webhook -> actualización estado.

## 11. Validations
Elegibilidad, montos, estado de pago.

## 12. Security Considerations
Verificación de webhooks y endpoints de cobro protegidos.

## 13. Edge Cases
Pago fallido, webhook duplicado, cancelaciones.

---

# Módulo: Solicitudes de servicio e intakes legales/contables

## 1. Overview
Gestiona solicitudes operativas y capturas especializadas por tipo de servicio.

## 2. Business Purpose
Traducir necesidades del cliente en casos accionables.

## 3. Module Responsibilities
Alta de solicitudes, validación de payloads y seguimiento.

## 4. System Dependencies
Company, service documents, notificaciones.

## 5. Database Tables
Tablas de solicitudes e intakes por servicio.

## 6. Backend Structure
Rutas `serviceRequest`, `serviceDocuments`, `monthlyAccounting`, `*Intake*` y variantes legales.

## 7. API Endpoints
Namespaces de `/api/*request*` y `/api/services/*/documents`.

## 8. Frontend Components
Formularios de solicitudes y seguimiento de estado.

## 9. User Flows
Selecciona servicio -> llena intake -> valida -> seguimiento.

## 10. Data Flow
Formulario -> endpoint -> schema -> servicio -> DB.

## 11. Validations
Campos requeridos por servicio, coherencia de código y adjuntos.

## 12. Security Considerations
Acceso autenticado y validación estricta de entrada.

## 13. Edge Cases
Payload incompleto, código inválido, duplicidad de solicitud.

---

# Módulo: Citas y Calendly

## 1. Overview
Orquesta agendamiento y sincronización de eventos.

## 2. Business Purpose
Coordinar agenda entre cliente y equipo de servicios.

## 3. Module Responsibilities
Citas, planes de citas, eventos públicos/privados y webhooks.

## 4. System Dependencies
Account/company/notificaciones.

## 5. Database Tables
Entidades de appointment y appointment-plan.

## 6. Backend Structure
`appointment.routes.js`, `appointmentPlan.routes.js`, `privateCalendly.routes.js`, `publicCalendly.routes.js`.

## 7. API Endpoints
`/api/appointment*`, `/api/calendly/*`, `/api/webhook/calendly/*`.

## 8. Frontend Components
Vista de citas y componentes de agenda.

## 9. User Flows
Usuario reserva -> confirmación -> webhook actualiza estado.

## 10. Data Flow
Frontend -> API -> Calendly -> webhook -> persistencia.

## 11. Validations
Rango horario, permisos, idempotencia de eventos.

## 12. Security Considerations
Validación de origen de webhook y endpoints protegidos.

## 13. Edge Cases
Doble reserva, cancelaciones, webhook tardío.

---

# Módulo: Notificaciones y comunicación

## 1. Overview
Entrega avisos de eventos y estado de procesos.

## 2. Business Purpose
Mantener al usuario informado y accionable.

## 3. Module Responsibilities
Feed de notificaciones, canales y preferencias.

## 4. System Dependencies
Solicitudes de servicio, citas, eventos de dominio.

## 5. Database Tables
Tablas de notificaciones y canales.

## 6. Backend Structure
`companyNotification.routes.js`, `customerServiceChannel.routes.js`.

## 7. API Endpoints
`/api/company-notifications/*`, `/api/customer-service-channel/*`.

## 8. Frontend Components
Vistas/listas de notificaciones.

## 9. User Flows
Evento -> notificación -> visualización por usuario.

## 10. Data Flow
Evento de dominio -> persistencia -> endpoint -> frontend.

## 11. Validations
Pertenencia de destinatario y estado de notificación.

## 12. Security Considerations
Solo usuarios autorizados pueden consultar notificaciones de su empresa.

## 13. Edge Cases
Estados desincronizados o duplicidad de notificaciones.

---

# Módulo: Cuenta de usuario, roles y acceso por funcionalidades

## 1. Overview
Controla perfil de cuenta, roles y habilitación de funcionalidades.

## 2. Business Purpose
Entregar experiencia y permisos según tipo de usuario.

## 3. Module Responsibilities
Cuenta, features disponibles y control de autorización.

## 4. System Dependencies
Auth, planes/suscripción, RBAC.

## 5. Database Tables
Usuarios, roles y mapeos de features.

## 6. Backend Structure
`account.routes.js`, `feature.routes.js`, `userFeature.routes.js`, `executive.routes.js`.

## 7. API Endpoints
`/api/account/*`, `/api/feature/*`, `/api/user-feature/*`.

## 8. Frontend Components
Cuenta de usuario y `RoleGuard` en rutas.

## 9. User Flows
Login -> carga perfil/features -> habilitación dinámica de UI.

## 10. Data Flow
Contexto auth -> endpoints account/feature -> guardado de rutas/componentes.

## 11. Validations
Consistencia de rol/permiso y checks de acceso.

## 12. Security Considerations
RBAC en backend y guardas en frontend.

## 13. Edge Cases
Desfase de permisos por cache o cambios recientes de rol.

---

# Módulo: IA, conceptualización y análisis de mercado

## 1. Overview
Habilita flujos asistidos por IA para conceptualización y análisis.

## 2. Business Purpose
Acelerar decisiones de negocio iniciales del cliente.

## 3. Module Responsibilities
Ejecución de análisis, persistencia de resultados y exposición en UI.

## 4. System Dependencies
Módulos IA, conceptualización, market analysis y today focus.

## 5. Database Tables
Tablas para resultados de conceptualización/análisis.

## 6. Backend Structure
`ia.routes.js`, `conceptualization.routes.js`, `marketAnalysis.routes.js`, `todayFocus.routes.js`.

## 7. API Endpoints
`/api/ia/*`, `/api/conceptualization/*`, `/api/market-analysis/*`, `/api/today-focus/*`.

## 8. Frontend Components
Páginas de conceptualización, orientación y resultados.

## 9. User Flows
Usuario solicita análisis -> backend procesa -> resultado visible.

## 10. Data Flow
Solicitud frontend -> endpoint -> lógica IA -> persistencia -> render.

## 11. Validations
Formato de entrada y reglas de negocio.

## 12. Security Considerations
Acceso autenticado y control de endpoints de generación.

## 13. Edge Cases
Timeouts, respuestas parciales e inconsistencias prompt-schema.

---

# Módulo: Landing y adquisición de leads

## 1. Overview
Capa pública de captación y conversión de usuarios.

## 2. Business Purpose
Aumentar adquisición y enrutar a onboarding/app.

## 3. Module Responsibilities
Propuesta de valor, CTAs, formularios y redirección.

## 4. System Dependencies
Rutas públicas y analytics (si aplica).

## 5. Database Tables
Generalmente indirecto (vía backend/herramientas externas).

## 6. Backend Structure
Consume endpoints públicos cuando corresponde.

## 7. API Endpoints
Endpoints públicos de interacción/captura.

## 8. Frontend Components
Secciones de landing, CTAs y formularios.

## 9. User Flows
Visita -> interés -> CTA -> app/login/build-company.

## 10. Data Flow
Interacción en landing -> evento/API -> transición al producto.

## 11. Validations
Campos de contacto y validación básica del formulario.

## 12. Security Considerations
Sanitización y mitigación de abuso en formularios públicos.

## 13. Edge Cases
Redirecciones rotas, envío incompleto, leads duplicados.

---

# Módulo: Base de datos y activos de automatización

## 1. Overview
Define persistencia del sistema y soporte operativo documentado.

## 2. Business Purpose
Asegurar integridad de datos y trazabilidad operativa.

## 3. Module Responsibilities
Mantener SQL base, bitácoras y documentación de automatizaciones.

## 4. System Dependencies
Contrato con modelos/schemas del backend.

## 5. Database Tables
Definidas en `/var/www/empowerme/dev_androide_17/db/empowerMe database.sql`.

## 6. Backend Structure
Modelos backend deben permanecer alineados con el esquema SQL.

## 7. API Endpoints
Impacto transversal a todos los endpoints con persistencia.

## 8. Frontend Components
Impacto transversal a todas las vistas con datos persistidos.

## 9. User Flows
Toda operación persistente termina en la capa DB.

## 10. Data Flow
Frontend -> backend -> servicio/modelo -> DB -> respuesta.

## 11. Validations
Constraints SQL + validaciones backend + reglas de negocio.

## 12. Security Considerations
Sin secretos en repo, disciplina de cambios y control de integridad.

## 13. Edge Cases
Desalineación de esquema, scripts no idempotentes, drift de migraciones.

---

## Consideraciones de seguridad transversales

- Endpoints protegidos por autenticación.
- Control de acceso por roles en módulos sensibles.
- Validación de entrada en backend.
- Verificación de origen/firma en webhooks.
- Controles anti-abuso en endpoints públicos.

---

## Checklist final de recepción del cliente

### Cobertura funcional
- [x] Landing documentada
- [x] Frontend documentado
- [x] Backend documentado
- [x] Base de datos/automatizaciones documentadas

### Entrega técnica
- [x] Dependencias por módulo documentadas
- [x] Mapa de endpoints por dominio
- [x] Flujos de datos y validaciones descritos
- [x] Seguridad y casos borde cubiertos

### Criterio de aceptación
- [x] Checklist extenso y útil para recepción integral con cliente
- [x] Incluye landing, frontend, backend y base de datos
- [x] Se entrega versión en inglés y versión en español

---

## Anexo - Cobertura ampliada solicitada (Dev task 12)

### A) Alcance de diseño de logo (módulo Graphic Design)

#### Cobertura funcional
- Ruta dedicada: `dashboard/graphic_design/logo_design`.
- Página/componente principal: `features/Dashboard/GraphicDesign/LogoDesignPage`.
- Selector reutilizable: `components/LogoSelector/LogoSelector.jsx`.
- Integración en conceptualización/branding:
  - `ConceptualizationWizardStep5` (selección de tipo de logo)
  - `ConceptualizationWizardStep6` (selección de logo generado)
  - `BrandBook` (vista previa/descarga del logo)

#### Objetivo de negocio
Permitir generación/selección de identidad visual dentro del flujo de conceptualización de empresa.

#### Dependencias de datos/API
- Endpoints de conceptualización y consulta de historial de logos.
- Persistencia de logo seleccionado en el flujo de brand book.

#### Casos borde
- Aún no hay logos generados.
- Usuario intenta continuar sin seleccionar logo.
- Fallo al descargar activos de imagen.

### B) Alcance de app administradora por tipos de usuario (ejecutivo/admin)

#### Frontend protegido por rol
Las restricciones por rol se aplican con `RoleGuard` en `src/routes/AppRoutes.jsx` para:
- `dashboard/services`
- `dashboard/panel`
- `dashboard/companies`
- `dashboard/users`

#### Backend de administración de roles
Endpoints relevantes en `src/routes/executive.routes.js`:
- `GET /api/executive/roles`
- `POST /api/executive/roles/:roleId` (actualización de rol)
- `GET /api/executive/executives/:serviceId`
- Endpoints de apoyo para intake/asignación de servicios

La implementación contempla flujos de mutación de rol (admin/ejecutivo) y mapeo contra tablas de roles.

### C) Alcance de gestión de citas

#### Frontend
- Ruta: `dashboard/appointments`.
- Componentes:
  - `features/Dashboard/Appointments/AppointmentsPage.jsx`
  - `features/Dashboard/Appointments/AppointmentsTable.jsx`
- Integración pago->cita en múltiples componentes de `components/PayAndScheduleAppointment/*`.

#### Backend
- APIs de citas:
  - `src/routes/appointment.routes.js`
  - `src/routes/appointmentPlan.routes.js`
- Integración Calendly:
  - `src/routes/privateCalendly.routes.js`
  - `src/routes/publicCalendly.routes.js`
  - `controllers/external/calendly.controller.js`

#### Flujo principal
Pago/selección de servicio -> planificación de cita -> reserva -> sincronización webhook Calendly -> actualización de estado.

### D) Inventario detallado de Wizards/Intakes

Actualmente existen, como mínimo, los siguientes dominios:

1. Monthly accounting intake (`monthlyAccounting.routes.js` / `accounting_client_intakes`)
2. Audit process intake (`auditProcessIntake.routes.js` / `audit_process_intakes`)
3. Balance preparation intake (`balancePreparationIntake.routes.js` / `balance_preparation_intakes`)
4. Dissolution company intake (`dissolutionCompanyIntake.routes.js` / `dissolution_company_intakes`)
5. Shareholder registry intake (`shareholderRegistry.routes.js` / `shareholder_registry_intakes`)
6. Constitution review intake (`constitutionReviewIntake.routes.js` / `constitution_review_intakes`)
7. Virtual office intake (`virtualOfficeIntake.routes.js` / `virtual_office_contract_intakes`)
8. Ordinary shareholders meeting intake (`ordinaryShareholdersMeetingIntake.routes.js` / `ordinary_shareholders_meeting_intakes`)
9. Company modifications intake (`companyModificationsIntake.routes.js` / `company_modifications_intakes`)
10. Purchase/sale intake (`purchaseSaleIntake.routes.js` / `purchase_sale_intakes`)
11. Wizard de onboarding Build Company (frontend)
12. Wizard de conceptualización (frontend, incluyendo etapa de logo)

Consolidación transversal en:
- `src/routes/intakes.routes.js`
- `src/controllers/intakes/intakes.controller.js`

Estos endpoints resuelven valores reutilizables por compañía, metadata por servicio y consultas de citas por código de servicio.

---

## Funcionalidades por módulo (detalle funcional)

### Autenticación y control de acceso
- Registro de usuario (email/password)
- Inicio de sesión
- Manejo de callback de login federado
- Verificación de correo
- Inicio de recuperación de contraseña
- Confirmación de cambio de contraseña
- Resolución de sesión actual (`/me`)
- Cierre de sesión
- Protección de rutas (frontend + backend)
- Acceso por rol (admin/ejecutivo/usuario)

### Onboarding de empresa (Build Company)
- Inicio del wizard de onboarding
- Captura de datos base de empresa
- Selección de catálogos (país/región/rubro, etc.)
- Validación por pasos
- Guardado progresivo/continuidad de estado
- Creación final de empresa y vínculo usuario-empresa
- Reanudación de onboarding incompleto

### Perfil central de empresa
- Crear perfil de empresa
- Editar datos generales
- Gestionar representante legal
- Gestionar socios/accionistas
- Gestionar información tributaria
- Consultar estado/configuración de empresa

### Servicios, planes, suscripciones y cobros
- Listar servicios disponibles
- Listar planes
- Crear intent de pago (pago único)
- Ejecutar flujo de pago único
- Crear suscripción
- Actualizar/reconciliar estado de suscripción
- Cancelar suscripción
- Procesar eventos webhook de Stripe
- Reflejar estado de pago/suscripción en disponibilidad de servicios

### Solicitudes de servicio e intakes legales/contables
- Crear intake de contabilidad mensual
- Crear intake de proceso de auditoría
- Crear intake de preparación de balance
- Crear intake de disolución
- Crear intake de registro de accionistas
- Crear intake de revisión de constitución
- Crear intake de oficina virtual
- Crear intake de junta ordinaria de accionistas
- Crear intake de modificaciones de sociedad
- Crear intake de compra/venta
- Obtener valores reutilizables de intake por empresa
- Consultar citas por código de servicio para continuidad operativa

### Citas y Calendly
- Listar planes de cita
- Crear cita
- Consultar citas por empresa/servicio
- Gestionar agendamiento desde flujos de pago de servicios
- Procesar flujos públicos/privados de Calendly
- Actualizar estados de cita por webhook de Calendly
- Soportar cancelación/reagendamiento según ciclo del evento

### Notificaciones y comunicación
- Consultar notificaciones por empresa
- Soporte de visualización de estado de notificaciones en dashboard
- Consultar canales de atención
- Soportar disparadores de comunicación por eventos

### Cuenta de usuario, roles y acceso por funcionalidades
- Consultar datos de cuenta/perfil
- Consultar catálogo de funcionalidades
- Consultar mapeo usuario-funcionalidad
- Aplicar guardas de acceso por rol en frontend
- Exponer endpoints de gestión admin/ejecutivo
- Actualizar asignación de roles de usuario

### IA, conceptualización y diseño de logo
- Iniciar flujo de conceptualización
- Generar resultados de análisis de negocio/mercado
- Capturar atributos de marca (nombre/slogan/colorimetría/tipo de logo)
- Generar opciones de logo
- Seleccionar logo final
- Persistir contexto de conceptualización + logo seleccionado
- Renderizar/descargar activos del brand book

### Landing y adquisición de leads
- Mostrar propuesta de valor comercial
- Exponer CTAs a registro/login/onboarding
- Soportar interacciones/formularios públicos (si están configurados)
- Enrutar usuarios al embudo de la app

### Base de datos y activos de automatización
- Persistir entidades de negocio transversales
- Mantener baseline del esquema SQL
- Soportar mapeos relacionales de rol/servicio/intake
- Registrar trazabilidad operativa en `dev_androide_17`


---

## Análisis funcional por tipo de usuario (Admin vs Ejecutivo)

### Usuario Administrador (capacidades por rol)
- Visibilidad global de órdenes de servicio.
- Acceso a módulos protegidos de administración (`services`, `panel`, `companies`, `users`).
- Gobierno de usuarios y roles:
  - Consultar listado de usuarios.
  - Consultar roles disponibles.
  - Actualizar asignación de roles.
- Gobierno operativo de servicios:
  - Configurar servicios habilitados por usuario ejecutivo.
  - Supervisar cola operativa por empresa/estado.

### Usuario Ejecutivo (capacidades por rol)
- Acceso acotado al alcance operativo asignado.
- Cola de trabajo de órdenes de servicio enfocada en asignaciones.
- Acceso a intakes por servicio/empresa para continuidad operativa.
- Operaciones de ciclo de vida de la orden (actualización de estado, seguimiento).
- Gestión de asignación operativa de órdenes.

### Soporte de autoasignación automática de servicios
La plataforma soporta comportamiento de autoasignación mediante configuración rol-servicio y operaciones de asignación:
- Elegibilidad de servicios por ejecutivo configurable (`user_services`).
- Endpoint de asignación disponible para vincular órdenes con ejecutivos (`/api/executive/:serviceOrderId/assigne`).
- Operativamente, esto habilita flujos de asignación rápida/automática basados en mapeos de servicios habilitados.

> Nota: el comportamiento de asignación se controla por relaciones backend de rol/servicio y registros de asignación de órdenes.

### Soporte de plataforma: Mobile y Desktop
EmpowerMe tiene soporte responsivo para ambos contextos:
- **Frontend** con utilidades responsive de Tailwind.
- Dashboard con manejo explícito de navegación móvil (`mobileOpen`, menú móvil).
- Flujos core (auth, dashboard, servicios, citas y conceptualización) disponibles en layouts desktop y mobile.

