# Serubix — Memoria v0.1

## Título del TFM

**Serubix: plataforma SaaS de automatización comercial e inteligencia artificial para empresas**

---

# 1. Visión General del Proyecto

Serubix es una plataforma SaaS orientada a la automatización comercial y prestación de servicios basados en inteligencia artificial para pequeñas y medianas empresas, así como para usuarios particulares interesados en herramientas de generación de contenido mediante IA.

La plataforma combinará:

- una web corporativa pública,
- un chatbot inteligente orientado a captación de leads,
- una aplicación SaaS privada,
- y herramientas de automatización IA integradas mediante pipelines externos en n8n.

El objetivo del proyecto es construir una solución real, escalable y mantenible, aplicando buenas prácticas profesionales de arquitectura software, seguridad, testing, DevOps e integración de servicios IA.

---

# 2. Objetivos del Proyecto

## Objetivos funcionales

- Crear una web corporativa profesional para Serubix.
- Implementar un chatbot IA para atención y captación de clientes.
- Desarrollar un SaaS privado con autenticación y control de acceso.
- Integrar automatizaciones IA externas mediante n8n.
- Permitir el uso de herramientas IA como:
  - Text-to-Speech.
  - Generador de Shorts para YouTube.
- Gestionar usuarios, permisos y límites de uso.
- Registrar el histórico de ejecuciones y resultados.

---

## Objetivos técnicos

- Aplicar Clean Architecture.
- Diseñar una arquitectura modular y escalable.
- Implementar autenticación y autorización segura.
- Integrar pipelines externos mediante APIs seguras.
- Utilizar Docker y Docker Compose.
- Desplegar el sistema en un VPS Ubuntu.
- Aplicar testing básico automatizado.
- Documentar técnicamente el sistema.

---

# 3. Público Objetivo

## Empresas

- pequeñas y medianas empresas,
- negocios de servicios,
- profesionales,
- emprendedores,
- empresas interesadas en automatización comercial.

## Particulares

- creadores de contenido,
- usuarios interesados en generación automática de contenido,
- usuarios que necesiten herramientas IA de voz o generación multimedia.

---

# 4. Arquitectura General

La plataforma estará compuesta por dos grandes bloques:

## 4.1 Web Corporativa Pública

Funciones principales:

- presentación de Serubix,
- explicación de servicios,
- captación de leads,
- chatbot IA público,
- formularios de contacto,
- acceso al SaaS.

---

## 4.2 Plataforma SaaS Privada

Funciones principales:

- autenticación de usuarios,
- gestión de accesos,
- ejecución de herramientas IA,
- visualización del histórico,
- administración de usuarios,
- control de límites de uso.

---

# 5. Herramientas IA Integradas

## 5.1 Text-to-Speech

Herramienta conectada a un pipeline externo de n8n encargado de:

- procesar texto,
- generar audio,
- almacenar el resultado,
- devolver el archivo generado.

---

## 5.2 Generador de Shorts para YouTube

Herramienta conectada a un pipeline externo de n8n encargado de:

- procesar ideas o prompts,
- generar contenido multimedia,
- producir un short final,
- devolver el archivo generado.

---

# 6. Integración con n8n

Las automatizaciones estarán externalizadas en workflows ya desplegados en un VPS mediante n8n.

La aplicación SaaS actuará como capa segura de acceso y control.

## Flujo general

```txt
Usuario
   ↓
SaaS Serubix
   ↓
API interna segura
   ↓
Webhook protegido n8n
   ↓
Pipeline IA
   ↓
Callback seguro
   ↓
Resultado final
```

---

# 7. Seguridad

El sistema implementará medidas de seguridad para evitar el acceso no autorizado a las automatizaciones.

## Medidas previstas

- autenticación segura,
- autorización basada en roles,
- validación de payloads,
- rate limiting,
- protección de secretos mediante variables de entorno,
- firma HMAC para callbacks y webhooks,
- separación frontend/backend,
- sanitización de entradas,
- logs seguros.

---

# 8. Roles del Sistema

## Visitor

Usuario no autenticado.

Puede:
- navegar por la web,
- utilizar el chatbot,
- solicitar contacto.

---

## Registered User

Usuario autenticado.

Puede:
- acceder al SaaS,
- visualizar herramientas disponibles,
- ejecutar módulos autorizados.

---

## Administrator

Puede:
- gestionar usuarios,
- activar/desactivar accesos,
- asignar planes,
- consultar logs,
- visualizar errores,
- gestionar módulos activos.

---

# 9. Planes y Accesos

## Free

- acceso básico al SaaS,
- sin acceso a herramientas IA.

## Pro

Acceso a:
- Text-to-Speech,
- Generador de Shorts.

Con límites:
- 20 ejecuciones TTS mensuales,
- 5 ejecuciones Shorts mensuales.

---

# 10. Gestión de Ejecuciones

Cada automatización generará un registro interno.

## Estados posibles

- `PENDING`
- `PROCESSING`
- `COMPLETED`
- `FAILED`
- `EXPIRED`

---

## Información almacenada

- usuario,
- tipo de herramienta,
- fecha,
- estado,
- resultado,
- errores,
- referencia al archivo generado.

---

# 11. Almacenamiento

Los archivos generados se almacenarán en el VPS del proyecto mediante almacenamiento persistente gestionado con Docker Volumes.

## Estructura prevista

```txt
/storage
  /generated
    /tts
    /shorts
```

Los metadatos permanecerán en base de datos incluso tras la expiración de archivos.

---

# 12. Stack Tecnológico

## Frontend

- Next.js
- TypeScript
- TailwindCSS

## Backend

- Next.js Fullstack
- API Routes / Server Actions

## Base de Datos

- PostgreSQL

## ORM

- Prisma ORM

## IA

- OpenAI API
- Claude API

## Automatización

- n8n

## DevOps

- Docker
- Docker Compose
- GitHub Actions

## Observabilidad

- Sentry

---

# 13. Arquitectura Software

Se aplicará una arquitectura modular inspirada en:

- Clean Architecture,
- separación de responsabilidades,
- principios SOLID,
- DTOs,
- Services,
- Repository Pattern,
- Adapter Pattern.

---

# 14. Despliegue

La aplicación se desplegará en:

- VPS Ubuntu,
- contenedores Docker,
- Docker Compose,
- almacenamiento persistente,
- variables de entorno seguras.

---

# 15. Testing

Se implementarán:

- unit tests,
- integration tests,
- validación de APIs,
- tests básicos E2E,
- test de contratos,
- validaciones de seguridad básicas.

---

# 16. Objetivos Académicos

El proyecto busca demostrar competencias en:

- arquitectura software,
- desarrollo fullstack,
- integración de APIs,
- inteligencia artificial,
- automatización,
- DevOps,
- seguridad,
- testing,
- documentación técnica,
- despliegue real de aplicaciones.

---

# 17. Alcance MVP

## Incluido en MVP

- web corporativa,
- chatbot IA,
- autenticación,
- panel admin básico,
- integración TTS,
- integración Shorts,
- control de accesos,
- histórico de ejecuciones,
- despliegue VPS,
- Docker,
- seguridad básica.

---

## Fuera del MVP

- pagos reales,
- sistema billing,
- multiempresa avanzada,
- realtime chat humano,
- microservicios,
- Kubernetes,
- generación multimedia local,
- aplicación móvil,
- analytics avanzados,
- sistema complejo de memoria IA.

---

# 18. Buenas prácticas implementadas

Esta sección recoge las buenas prácticas de ingeniería aplicadas en el proyecto, organizadas por ámbito, como evidencia de su aplicación real en el código.

---

## 18.1 Arquitectura — Clean Architecture

El proyecto aplica separación estricta por capas en ambas partes del sistema.

**Backend:** las rutas (`routes/`) solo reciben la petición HTTP y llaman al servicio. Los servicios (`services/`) contienen la lógica de negocio sin conocer HTTP. La infraestructura (`lib/`) agrupa clientes de base de datos, JWT y errores.

**Frontend:** los componentes de presentación (`components/`) reciben datos como props. Las features (`features/landing/`) centralizan el contenido. Los tipos (`types/`) no tienen dependencias.

---

## 18.2 Principios SOLID

| Principio | Evidencia en el código |
|---|---|
| **S** — Single Responsibility | `asyncHandler`, `requireAuth`, `validate`, `errorMiddleware`, `useContentItems`, `useTtsGenerate` — cada módulo tiene una sola responsabilidad |
| **O** — Open/Closed | Añadir un nuevo endpoint o herramienta IA requiere crear ficheros nuevos; no modificar los existentes |
| **L** — Liskov Substitution | `AppError extends Error` — sustituible en cualquier contexto; `errorMiddleware` lo trata polimórficamente |
| **I** — Interface Segregation | Los componentes React reciben solo las props que necesitan, no objetos completos |
| **D** — Dependency Inversion | Los hooks dependen de `fetch` (abstracción); en tests se sustituye sin tocar el hook |

---

## 18.3 DRY — Don't Repeat Yourself

- `asyncHandler` elimina 10 bloques `try/catch` idénticos en las rutas Express.
- `currentMonth()` en `lib/date.ts` — función compartida entre `tts.service.ts` y `users.service.ts`.
- `authHeaders()` en `lib/api.ts` — cabeceras de autenticación usadas en 3 componentes distintos.
- `ContentItem` en `types/content.ts` — tipo compartido entre hook, componente y tests.
- `landing-content.ts` — todo el texto de la landing en un único fichero; ningún componente tiene texto hardcodeado.

---

## 18.4 Fail Fast

- Zod valida el cuerpo de la petición **antes** de que llegue al servicio.
- `requireAuth` rechaza la petición **antes** de ejecutar lógica de negocio.
- El servicio TTS verifica la cuota disponible **antes** de llamar a la API de OpenAI, evitando costes innecesarios.
- TypeScript en modo `strict` detecta errores en compilación, no en producción.

---

## 18.5 Patrones de diseño

| Patrón | Implementación |
|---|---|
| **Wrapper / Decorator** | `asyncHandler` decora funciones async para propagar errores |
| **Factory** | `validate(schema)` devuelve un middleware específico para cada schema Zod |
| **Singleton** | Cliente Prisma con `globalThis` para evitar múltiples conexiones en dev |
| **Provider** | `Providers.tsx` encapsula `SessionProvider` como Client Component |
| **Fire-and-Forget** | TTS devuelve `202 Accepted` inmediatamente; la generación ocurre en background |

---

## 18.6 Testing

- Cobertura de código >99% en frontend y backend.
- Tests en 3 niveles: unitarios (datos), componentes (render + interacción), integración (página completa).
- `vi.stubGlobal('localStorage', {...})` — mock correcto de APIs de navegador en jsdom.
- `vi.hoisted()` — resolución correcta del Temporal Dead Zone en mocks que se referencian dentro de factories de `vi.mock()`.
- Exclusiones de cobertura documentadas y justificadas: solo thin wrappers sobre librerías de terceros sin lógica propia.

---

## 18.7 Seguridad

- Contraseñas hasheadas con bcrypt, factor de coste 12 (~300 ms por verificación).
- Mensaje de error genérico en login para evitar user enumeration attacks.
- Sesiones en cookies `httpOnly` — inaccesibles desde JavaScript del navegador.
- Doble protección de rutas privadas: middleware Edge Runtime + Server Component layout.
- Contenedores Docker ejecutan con usuario no-root (UID 1001).
- Secretos en variables de entorno; nunca en código fuente.
- Helmet en Express para cabeceras de seguridad HTTP (CSP, X-Frame-Options, HSTS).

---

## 18.8 DevOps

- **Multi-stage Docker builds:** la imagen de producción no contiene código fuente, `devDependencies` ni herramientas de compilación (~80 MB vs ~400 MB).
- **Imágenes etiquetadas por SHA de commit:** permite rollback a cualquier versión anterior.
- **Volúmenes Docker:** `postgres_data` (base de datos) y `tts_storage` (audios generados) persisten entre reinicios de contenedores.
- **Jobs de CI en paralelo:** `test-frontend` y `check-backend` corren simultáneamente, con dependencias explícitas mediante `needs`.
- **Filtros `paths` en CI:** cambios en `memoria/` no disparan el pipeline de tests.

---

## 18.9 Cumplimiento RGPD / LSSI

- Banner de consentimiento con opciones "Aceptar todo" / "Solo esenciales".
- Preferencia almacenada en `localStorage` (clave `serubix_cookies_consent`), no como cookie real.
- Página `/politica-de-cookies` con tabla de cookies usadas, base legal y datos de contacto.
- Página de política excluida de indexación (`robots: noindex`).
- Cumplimiento RGPD art. 6.1.b (ejecución de contrato) y LSSI art. 22.2 (cookies técnicas).

---

# 19. Roadmap Inicial

## Fase 1
Definición funcional y arquitectura.

## Fase 2
Setup del proyecto y estructura base.

## Fase 3
Sistema de autenticación y roles.

## Fase 4
Web pública y chatbot IA.

## Fase 5
Integración con n8n.

## Fase 6
Dashboard admin y control de usuarios.

## Fase 7
Testing y hardening.

## Fase 8
Despliegue y documentación final.
