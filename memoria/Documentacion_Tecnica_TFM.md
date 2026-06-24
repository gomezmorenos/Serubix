# Serubix — Documentación Técnica para la Defensa del TFM

**Autor:** Sergio Gomez  
**Fecha:** Junio 2026  
**Título:** Serubix: plataforma SaaS de automatización comercial e inteligencia artificial para empresas

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Justificación del proyecto](#2-justificación-del-proyecto)
3. [Arquitectura del sistema](#3-arquitectura-del-sistema)
4. [Stack tecnológico — decisiones y justificaciones](#4-stack-tecnológico--decisiones-y-justificaciones)
5. [Frontend — implementación real](#5-frontend--implementación-real)
6. [Backend — implementación real](#6-backend--implementación-real)
7. [Calidad del código y testing](#7-calidad-del-código-y-testing)
8. [CI/CD y DevOps](#8-cicd-y-devops)
9. [Infraestructura y despliegue](#9-infraestructura-y-despliegue)
10. [Seguridad](#10-seguridad)
11. [Accesibilidad y SEO](#11-accesibilidad-y-seo)
12. [Principios de ingeniería aplicados](#12-principios-de-ingeniería-aplicados)
13. [Métricas del proyecto](#13-métricas-del-proyecto)
14. [Valor académico y profesional](#14-valor-académico-y-profesional)
15. [Roadmap y evolución futura](#15-roadmap-y-evolución-futura)
16. [Posibles preguntas del tribunal](#16-posibles-preguntas-del-tribunal)

---

## 1. Resumen ejecutivo

Serubix es una plataforma SaaS real orientada a la automatización de procesos empresariales mediante inteligencia artificial, desarrollada simultáneamente como Trabajo de Fin de Máster y como proyecto empresarial viable.

El proyecto resuelve un problema concreto: las pequeñas empresas y autónomos dedican más del 40% de su tiempo a tareas manuales repetitivas que podrían automatizarse. Serubix ofrece dos líneas de valor:

- **Servicios a medida:** automatización de procesos, asistentes IA, integración de herramientas, gestión de leads y automatización comercial adaptados a cada cliente.
- **Productos SaaS:** herramientas de IA listas para usar — Text to Speech (disponible), generación de Shorts para YouTube y Text to Image (próximamente).

**Estado actual del proyecto:**

| Capa | Estado | Detalles |
|---|---|---|
| Landing page | Completado | 10 secciones, SEO, accesibilidad WCAG |
| Área de clientes | Completado | Login/registro, dashboard con 4 páginas |
| Backend API | Completado | 8 endpoints REST, JWT, PostgreSQL, TTS |
| CI/CD | Completado | 4 jobs: tests FE, build FE, check BE, integración BE+DB |
| Infraestructura | Completado | Docker multi-stage, Nginx, compose para dev/prod/CI |

El proyecto demuestra competencias en arquitectura software fullstack, integración de IA, DevOps y seguridad aplicada.

---

## 2. Justificación del proyecto

### 2.1 Problema real que resuelve

| Problema | Impacto estimado |
|---|---|
| Tareas manuales repetitivas | +40% del tiempo operativo perdido |
| Pérdida de leads por falta de seguimiento | El 80% de ventas requieren 5+ contactos |
| Datos dispersos entre herramientas | Falta de visibilidad y control |
| Procesos que no escalan | Crecimiento bloqueado por operativa |
| Generación de contenido manual | Horas perdidas en voz, imagen, vídeo |

### 2.2 Mercado objetivo

- Autónomos y freelancers con procesos repetitivos
- Pequeñas y medianas empresas (1–50 empleados)
- Consultoras y agencias digitales
- Creadores de contenido que necesitan automatizar producción

### 2.3 Propuesta de valor diferencial

1. **Implementación a medida** para casos de uso específicos de cada cliente
2. **Productos SaaS propios** con IA generativa (voz, vídeo, imagen)
3. **Integración con n8n** para orquestación de workflows complejos
4. **Arquitectura escalable** desde MVP hasta empresa

---

## 3. Arquitectura del sistema

### 3.1 Vista general

```
                         Internet
                            │
                    ┌───────▼───────┐
                    │     Nginx     │  puertos 80 / 443
                    └───────┬───────┘
                   ┌────────┴────────┐
                   │                 │
          ┌────────▼────────┐  ┌─────▼──────────┐
          │  Next.js 15     │  │  Express API   │
          │  (FrontEnd)     │  │  (Backend)     │
          │  puerto 3000    │  │  puerto 4000   │
          └────────┬────────┘  └─────┬──────────┘
                   │                 │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │   PostgreSQL 16  │
                   │  (Docker Volume) │
                   └─────────────────┘
```

### 3.2 Arquitectura del Frontend

```
FrontEnd/src/
├── app/
│   ├── layout.tsx                # Layout raíz — metadatos SEO globales
│   ├── page.tsx                  # Landing page (composición de secciones)
│   ├── (auth)/                   # Route group — páginas de autenticación
│   │   ├── layout.tsx            # Layout centrado con logo Serubix
│   │   ├── login/page.tsx        # Página de inicio de sesión
│   │   └── register/page.tsx     # Página de registro
│   ├── (dashboard)/              # Route group — área privada
│   │   ├── layout.tsx            # Layout con Sidebar (lee sesión server-side)
│   │   ├── dashboard/page.tsx    # Panel principal con stats y accesos rápidos
│   │   ├── herramientas/page.tsx # TTS disponible + Shorts/Image próximamente
│   │   ├── perfil/page.tsx       # Info personal, seguridad, zona de peligro
│   │   └── plan/page.tsx         # Free vs Pro, barra de uso, facturación
│   └── api/auth/[...nextauth]/route.ts  # Handler de Auth.js v5
│
├── components/
│   ├── landing/                  # Componentes de la landing (presentación pura)
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── SolutionSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── ProductPreviewSection.tsx
│   │   ├── FinalCTASection.tsx
│   │   └── Footer.tsx
│   ├── auth/                     # Formularios de autenticación (Client Components)
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── GoogleButton.tsx
│   └── dashboard/                # UI del área privada
│       ├── Sidebar.tsx
│       └── ProfileForm.tsx
│
├── features/landing/
│   ├── landing-content.ts        # Fuente única de verdad del contenido
│   └── landing.types.ts          # Contratos TypeScript
│
├── lib/
│   └── auth.ts                   # Configuración Auth.js v5 (Google + Credentials)
│
└── middleware.ts                 # Protección de rutas (unauthenticated → /login)
```

### 3.3 Arquitectura del Backend

```
Backend/src/
├── app.ts          # Express app (middlewares, rutas, error handler)
├── index.ts        # Entry point — app.listen()
│
├── routes/         # HTTP layer — solo reciben req y llaman al servicio
│   ├── auth.routes.ts
│   ├── users.routes.ts
│   ├── plans.routes.ts
│   └── tools.routes.ts
│
├── services/       # Lógica de negocio — no sabe nada de HTTP
│   ├── auth.service.ts    # register, login, getMe
│   ├── users.service.ts   # getProfile, updateProfile, getUsage
│   ├── plans.service.ts   # getAll
│   └── tts.service.ts     # generate (OpenAI TTS + control de límites)
│
├── middleware/     # Funciones transversales
│   ├── auth.middleware.ts    # requireAuth — valida JWT Bearer token
│   ├── validate.middleware.ts # validate(schema) — Zod validation
│   └── error.middleware.ts   # errorMiddleware — manejo centralizado de errores
│
├── schemas/        # Contratos de entrada con Zod
│   ├── auth.schema.ts    # registerSchema, loginSchema
│   ├── users.schema.ts   # updateProfileSchema
│   └── tools.schema.ts   # ttsSchema
│
├── lib/            # Infraestructura
│   ├── prisma.ts   # Singleton del cliente Prisma
│   ├── jwt.ts      # signToken / verifyToken
│   └── errors.ts   # AppError (error tipado con statusCode)
│
└── types/
    └── express.d.ts  # Module augmentation: Request.user
```

### 3.4 Flujo de autenticación

```
  Browser                  Next.js (FrontEnd)          Express (Backend)
     │                           │                            │
     │──POST /login──────────────▶                            │
     │   {email, password}       │                            │
     │                           │──POST /auth/login─────────▶
     │                           │   {email, password}       │
     │                           │                    bcrypt.compare()
     │                           │                    signToken() → JWT
     │                           │◀──{user, token}────────────
     │                           │                            │
     │                    NextAuth crea sesión JWT            │
     │                    (backendToken guardado             │
     │                     dentro del JWT de Auth.js)        │
     │◀──Set-Cookie: next-auth.session-token─────────────────
     │                           │                            │
     │──GET /dashboard───────────▶                            │
     │                    middleware.ts                       │
     │                    verifica sesión                     │
     │◀──200 Dashboard────────────                            │
     │                           │                            │
     │──PATCH /users/me──────────▶                            │
     │  (client fetch)           │                            │
     │                           │──PATCH /users/me──────────▶
     │                           │   Authorization: Bearer JWT│
     │                           │                   requireAuth()
     │                           │                   prisma.user.update()
     │                           │◀──{user}───────────────────
     │◀──200 OK───────────────────                            │
```

### 3.5 Modelo de datos (Prisma)

```
┌─────────────────────┐         ┌───────────────────┐
│       users         │         │      plans         │
├─────────────────────┤         ├───────────────────┤
│ id       String (PK)│    ┌───▶│ id       String   │
│ email    String UNIQ│    │    │ name     String   │
│ name     String?    │    │    │ ttsLimit Int      │
│ passwordHash String?│    │    │   (0 = ilimitado) │
│ provider String     │    │    └───────────────────┘
│ planId   String ────┼────┘
│ createdAt DateTime  │
│ updatedAt DateTime  │         ┌───────────────────┐
└─────────┬───────────┘         │      usages       │
          │                     ├───────────────────┤
          └────────────────────▶│ id       String   │
                                │ userId   String FK│
                                │ tool     String   │
                                │ amount   Int      │
                                │ month    Int YYYYMM│
                                │ createdAt DateTime│
                                └───────────────────┘
```

`ttsLimit = 0` significa uso ilimitado (plan Pro). Para el plan Free, `ttsLimit = 5000` caracteres/mes.

### 3.6 Endpoints de la API REST

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/health` | No | Health check |
| `POST` | `/auth/register` | No | Crea usuario → `{user, token}` |
| `POST` | `/auth/login` | No | Valida credenciales → `{user, token}` |
| `GET` | `/auth/me` | JWT | Usuario actual con plan |
| `GET` | `/users/me` | JWT | Perfil completo con plan |
| `PATCH` | `/users/me` | JWT | Actualiza nombre |
| `GET` | `/users/me/usage` | JWT | Uso del mes actual por herramienta |
| `GET` | `/plans` | No | Lista de planes disponibles |
| `POST` | `/tools/tts` | JWT | Genera audio MP3 via OpenAI TTS |

---

## 4. Stack tecnológico — decisiones y justificaciones

### 4.1 Next.js 15 con App Router

**Por qué Next.js y no React puro o Vite:**

| Criterio | React + Vite | Next.js 15 |
|---|---|---|
| SSR / SSG | Manual | Nativo |
| SEO | Requiere configuración | Incorporado |
| Routing | Librería adicional | File-based nativo |
| API routes | No | Sí (fullstack) |
| Optimización imágenes | Manual | Automática |
| Metadatos dinámicos | Manual | Metadata API |
| Despliegue Docker | Estándar | `output: standalone` |

**App Router y route groups:** la autenticación y el dashboard se organizan con route groups `(auth)` y `(dashboard)`, lo que permite layouts distintos sin afectar las URLs. La landing page se renderiza como estática (`○`), el dashboard como dinámica (`ƒ`). Una sola aplicación Next.js sirve ambas con el rendimiento óptimo para cada una.

**`output: standalone`:** Next.js genera un servidor Node.js autocontenido con solo las dependencias utilizadas. La imagen Docker final es ~100 MB frente a ~600 MB sin esta opción.

### 4.2 Auth.js v5 (NextAuth)

**Por qué Auth.js y no implementación propia:**

Auth.js gestiona toda la complejidad de la autenticación en el servidor: sesiones JWT firmadas, callbacks, rotación de tokens, CSRF, proveedores OAuth. Implementar todo esto correctamente desde cero es propenso a errores de seguridad.

**Estrategia de sesión:** `jwt` (stateless). El token se firma con `AUTH_SECRET` y viaja en una cookie `httpOnly`. No se necesita base de datos para las sesiones del frontend.

**Integración con el backend:** el `authorize` del proveedor `Credentials` llama a `POST /auth/login` del backend. Si recibe `{user, token}` exitoso, Auth.js crea una sesión y almacena el token JWT del backend dentro. Así, los Client Components pueden obtener el `backendToken` de la sesión para llamar directamente a la API.

**Fallback de desarrollo:** si el backend no está disponible (arranque sin Docker), el `authorize` captura el error de red y crea un usuario mock, permitiendo continuar el desarrollo del frontend de forma independiente.

### 4.3 Express.js + TypeScript (Backend)

**Por qué Express y no Fastify, NestJS o Hono:**

| Criterio | NestJS | Fastify | Express |
|---|---|---|---|
| Curva de aprendizaje | Alta (decoradores, DI) | Media | Baja |
| Opiniones | Muy opinionado | Medio | Mínimo |
| Overhead boilerplate | Alto | Bajo | Bajo |
| Madurez ecosistema | Alta | Alta | Muy alta |
| Adecuado para MVP | Overkill | Sí | Sí |

Para un MVP con un solo desarrollador, Express es la elección pragmática: mínimo boilerplate, máximo control, y toda la complejidad de Clean Architecture la aporta la estructura de carpetas, no el framework.

### 4.4 Prisma ORM

**Por qué Prisma y no Drizzle, TypeORM o SQL puro:**

- **Type-safety completo:** las consultas son completamente tipadas. Si se cambia el schema, TypeScript falla en compile time en todos los lugares que usan ese modelo.
- **Migraciones versionadas:** `prisma migrate dev` genera ficheros SQL versionados y los aplica en orden. El historial de cambios del schema es trazable en git.
- **Prisma Client generado:** el cliente se genera a partir del schema, garantizando que tipos y base de datos están siempre sincronizados.
- **Studio visual:** `npx prisma studio` proporciona un explorador de datos sin instalar herramientas externas.

### 4.5 Zod para validación de entradas

**Por qué Zod:**

Zod valida y transforma las entradas en el boundary del sistema (HTTP request body) antes de que lleguen a la lógica de negocio. El middleware `validate(schema)` aplica el schema correspondiente y devuelve un `400` estructurado si la validación falla, con el detalle de qué campo es inválido. Ningún servicio recibe datos no validados.

```typescript
export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})
// TypeScript infiere: { name: string; email: string; password: string }
```

### 4.6 bcryptjs para contraseñas

Las contraseñas **nunca se almacenan en texto plano**. Se usa `bcrypt` con factor de coste 12 (12 rondas de hashing). bcryptjs es la versión pure-JavaScript de bcrypt, lo que elimina las dependencias nativas y facilita el build Docker en Alpine Linux.

El tiempo de verificación de bcrypt con factor 12 es ~300ms intencionado, lo que hace los ataques de fuerza bruta inviables incluso con una base de datos comprometida.

### 5.7 OpenAI TTS

El servicio TTS (`tts-1`) convierte texto a voz usando la API de OpenAI. El flujo completo:

1. Verificar que el usuario tiene cuota disponible (`ttsLimit - usedThisMonth`)
2. Llamar a `openai.audio.speech.create({ model: 'tts-1', voice, input: text })`
3. Registrar el uso en la tabla `usages` con el mes actual en formato `YYYYMM`
4. Devolver el buffer MP3 directamente al cliente con `Content-Type: audio/mpeg`

Las voces disponibles son: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`.

### 4.8 TypeScript (full-stack)

TypeScript en ambas capas garantiza que los contratos entre frontend y backend son verificables. El modelo de la base de datos, el schema Zod de validación y los tipos de los servicios son la misma fuente de verdad. Un cambio en el schema Prisma que no se refleje en el servicio falla en compilación.

### 4.9 Docker + Docker Compose

**Arquitectura de contenedores (3 ficheros compose):**

| Fichero | Cuándo | Características |
|---|---|---|
| `docker-compose.yml` | Desarrollo local | Build desde fuente, puertos 3000/4000 |
| `docker-compose.prod.yml` | VPS producción | Imágenes GHCR, HTTPS, DB persistente |
| `docker-compose.ci.yml` | Tests integración | Stage `builder`, DB efímera, puertos distintos |

**Multi-stage build Backend:**
```dockerfile
# Stage 1: builder — instala deps, genera Prisma client, compila TypeScript
FROM node:20-alpine AS builder
RUN npm ci && npx prisma generate && npm run build

# Stage 2: runner — solo artefactos finales (dist/ + node_modules + prisma/)
FROM node:20-alpine AS runner
# → usuario no-root 'backend' (UID 1001)
# → imagen mínima: sin src/, sin tsconfig, sin devDeps extra
```

### 4.10 GitHub Actions

**4 jobs en el pipeline CI:**

| Job | Trigger | Verifica |
|---|---|---|
| `test-frontend` | cambios en `FrontEnd/` | TS types + 244 tests |
| `build-frontend` | pasa `test-frontend` | `next build` completo |
| `check-backend` | cambios en `Backend/` | Prisma generate + TS types + build |
| `test-backend-integration` | pasa `check-backend` | PostgreSQL real + migraciones + seed + smoke test |

---

## 5. Frontend — implementación real

### 5.1 Landing page — 10 secciones

| Sección | Propósito | Elemento clave |
|---|---|---|
| `Navbar` | Navegación sticky | Comportamiento scroll con `useEffect`, CTA → `/login` |
| `HeroSection` | Primer impacto | H1 semántico, dos CTAs diferenciados |
| `ProblemSection` | Empatía con el usuario | 6 problemas reales con iconos |
| `SolutionSection` | Propuesta de valor | Lista de beneficios + diagrama de flujo |
| `ServicesSection` | Oferta de servicios | Dos bloques: a medida (azul) y SaaS (violeta) |
| `ProcessSection` | Generar confianza | 4 pasos con numeración visual |
| `BenefitsSection` | Prueba social | Métricas visuales (70%, 3x, 90%…) |
| `ProductPreviewSection` | Visión del producto | Mock de dashboard con datos reales |
| `FinalCTASection` | Conversión | CTA principal con email de contacto |
| `Footer` | Cierre + navegación | Links, contacto, copyright |

**Decisión clave:** todo el contenido está centralizado en `landing-content.ts`. Ningún componente tiene texto hardcodeado, lo que permite cambios de copia sin tocar ningún componente y facilita la migración futura a un CMS.

### 5.2 Área de clientes — autenticación

El flujo completo de autenticación con Auth.js v5:

**Registro (`/register`):**
1. El usuario rellena nombre, email y contraseña (validación client-side: contraseñas coinciden, mínimo 6 caracteres)
2. `RegisterForm` llama a `POST {API_URL}/auth/register`
3. El backend crea el usuario con contraseña hasheada y devuelve el token
4. Redirección a `/login?registered=true` con mensaje de confirmación

**Login (`/login`):**
1. `LoginForm` llama a `signIn('credentials', { email, password, redirect: false })`
2. Auth.js invoca el `authorize` del provider Credentials
3. `authorize` hace fetch a `POST {API_URL}/auth/login`
4. El backend valida con bcrypt y devuelve `{user, token}`
5. Auth.js crea la sesión JWT con `user.id` y `backendToken` almacenados
6. `useRouter().push(callbackUrl)` redirige al destino original

**Google OAuth (`/login`):**
1. `GoogleButton` llama a `signIn('google', { callbackUrl })`
2. Redirección a Google OAuth → callback → sesión Auth.js

**Protección de rutas (middleware):**
```typescript
// Rutas protegidas → redirige a /login?callbackUrl=...
const PROTECTED = ['/dashboard', '/herramientas', '/perfil', '/plan']
// Rutas solo para no autenticados → redirige a /dashboard
const AUTH_ONLY = ['/login', '/register']
```

### 5.3 Área de clientes — dashboard

4 páginas del área privada, todas Server Components que leen la sesión con `await auth()`:

| Página | Ruta | Contenido |
|---|---|---|
| Dashboard | `/dashboard` | Bienvenida personalizada, stats del plan, accesos rápidos |
| Herramientas | `/herramientas` | TTS (textarea + selector de voz), Shorts y Image (próximamente) |
| Perfil | `/perfil` | Edición de nombre, info de seguridad, zona de peligro |
| Plan | `/plan` | Free vs Pro, barra de uso (0/5000 chars), facturación |

**Sidebar:** Client Component con `usePathname()` para marcar la ruta activa con `aria-current="page"`. El botón de "Cerrar sesión" llama a `signOut({ callbackUrl: '/' })`.

**ProfileForm:** usa `useSession()` para obtener el `backendToken` y llamar a `PATCH /users/me` con autenticación.

---

## 6. Backend — implementación real

### 6.1 Capa de servicios (lógica de negocio)

Los servicios son el núcleo del backend. No saben nada de HTTP: reciben parámetros tipados y devuelven datos o lanzan `AppError`.

**`auth.service.ts`:**
```typescript
register({ name, email, password })
  // 1. Verifica email único (AppError 409 si existe)
  // 2. bcrypt.hash(password, 12)
  // 3. prisma.user.create()
  // 4. signToken({ id, email }) → JWT 7 días
  // → { user, token }

login({ email, password })
  // 1. prisma.user.findUnique({ where: { email } })
  // 2. bcrypt.compare(password, passwordHash)  → AppError 401 si falla
  // 3. signToken() → { user (sin passwordHash), token }
```

**`tts.service.ts`:**
```typescript
generate(userId, { text, voice })
  // 1. Verifica OPENAI_API_KEY → AppError 503 si no configurada
  // 2. Busca el plan del usuario
  // 3. Si ttsLimit > 0: verifica uso del mes actual
  //    → AppError 402 si límite superado
  // 4. openai.audio.speech.create({ model: 'tts-1', voice, input: text })
  // 5. prisma.usage.create() → registra consumo
  // → Buffer MP3
```

### 6.2 Middleware reutilizable

**`requireAuth`:** extrae el Bearer token del header `Authorization`, verifica la firma con `JWT_SECRET`. Añade `req.user = { id, email }` al request. Si no hay token o es inválido devuelve `401`.

**`validate(schema)`:** aplica un schema Zod al `req.body`. Si la validación falla, devuelve `400` con `{ error: 'Datos inválidos', details: { campo: ['mensaje'] } }`. Si pasa, `req.body` queda tipado según el schema.

**`errorMiddleware`:** middleware Express de 4 parámetros que captura todos los errores lanzados con `next(err)`. Distingue entre `AppError` (errores de negocio con statusCode controlado) y errores inesperados (500).

### 6.3 Control de límites de uso (TTS)

```
Plan Free:  ttsLimit = 5000 caracteres/mes
Plan Pro:   ttsLimit = 0 (0 significa ilimitado)

Cada llamada a POST /tools/tts:
  1. Lee ttsLimit del plan del usuario
  2. Si ttsLimit > 0:
     SELECT SUM(amount) FROM usages
     WHERE userId = ? AND tool = 'tts' AND month = YYYYMM
  3. Si used + text.length > ttsLimit → 402 Payment Required
  4. Si OK → genera audio → registra usage
```

El campo `month` se almacena como entero `YYYYMM` (ej: `202606`), lo que permite consultas eficientes por mes sin necesidad de funciones de fecha en SQL. El índice `@@index([userId, tool, month])` garantiza que esta consulta sea O(log n).

### 6.4 Arranque local sin Docker

```bash
# 1. Tener PostgreSQL corriendo en localhost:5432
# 2. Crear la base de datos: createdb serubix
cd Backend
cp .env.example .env          # editar DATABASE_URL, JWT_SECRET, OPENAI_API_KEY
npm install
npx prisma migrate dev --name init   # crea tablas
npm run db:seed                       # inserta planes Free y Pro
npm run dev                           # http://localhost:4000
```

---

## 7. Calidad del código y testing

### 7.1 Métricas de testing (FrontEnd)

| Métrica | Valor |
|---|---|
| Ficheros de test | 26 |
| Tests totales | 244 |
| Tests pasando | 244 (100%) |
| Cobertura statements | 99,89% |
| Cobertura branches | ~95% |
| Cobertura functions | 100% |
| Tiempo de ejecución | ~3.7s |

### 7.2 Distribución de tests por tipo

| Tipo | Ficheros | Tests | Qué valida |
|---|---|---|---|
| **Unitarios** | 1 | 36 | Integridad del content (textos, URLs, arrays) |
| **Componentes** | 24 | 190 | Render, accesibilidad, estados, interacciones |
| **Integración** | 1 | 18 | Página completa, marca, navegación |

### 7.3 Componentes nuevos con tests completos

**Área de autenticación:**
- `LoginForm` (8 tests): render campos, llama `signIn('credentials')`, redirige al `callbackUrl`, muestra error 'CredentialsSignin', deshabilita botón en carga
- `RegisterForm` (10 tests): validación client-side, render campos, estados de carga, redirección
- `GoogleButton` (5 tests): `signIn('google')`, usa `callbackUrl`, estado de carga
- `LoginPage` (6 tests): async Server Component, `searchParams` como Promise, mensaje de registro exitoso
- `RegisterPage` (3 tests): render del formulario
- `AuthLayout` (4 tests): logo con enlace home, copyright

**Dashboard:**
- `Sidebar` (11 tests): 4 nav items, `aria-current="page"` en ruta activa, avatar con iniciales, `signOut({ callbackUrl: '/' })`
- `ProfileForm` (7 tests): edición de nombre, email deshabilitado, estado de carga, mensaje de éxito
- `DashboardPage` (7 tests): nombre del usuario, stat cards, herramientas de acceso rápido
- `PerfilPage` (9 tests): avatar, badge Plan Free, secciones, props al ProfileForm
- `PlanPage` (10 tests): dos planes, barra de progreso, botón Pro
- `HerramientasPage` (9 tests): widget TTS, badges de estado
- `DashboardLayout` (3 tests): render con sesión, redirección sin sesión

### 7.4 Técnicas de mocking aplicadas

**`vi.hoisted()`:** necesario cuando una variable mock se referencia directamente en el objeto del factory de `vi.mock()` (no dentro de una función closure). Sin hoisting, la variable está en el temporal dead zone cuando el factory se ejecuta.

```typescript
// NECESITA hoisting — mockSignIn se referencia en el objeto del factory
const mockSignIn = vi.hoisted(() => vi.fn())
vi.mock('next-auth/react', () => ({ signIn: mockSignIn }))

// NO necesita hoisting — mockPush está dentro de una función closure
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),  // se llama cuando el componente monta
}))
```

**Exclusiones de cobertura justificadas:**

```typescript
exclude: [
  'src/test/**',                    // los propios tests no se miden
  'src/features/landing/landing.types.ts',  // interfaces = 0 runtime code
  'src/lib/auth.ts',                // configuración Auth.js — no unit-testable
  'src/middleware.ts',              // infraestructura Next.js
  'src/app/api/**',                 // re-export de 2 líneas
]
```

### 7.5 Backend — verificación de tipos y build

El backend no tiene tests unitarios en esta fase (el tiempo se priorizó en la implementación), pero tiene dos niveles de verificación automatizados en CI:

1. **`npx tsc --noEmit`** — verificación estática de tipos TypeScript. Sin Prisma client generado esto fallaría, por lo que el job de CI ejecuta `npx prisma generate` previamente.

2. **Smoke test de integración** con PostgreSQL real: el job `test-backend-integration` levanta una instancia de PostgreSQL en GitHub Actions, ejecuta las migraciones, el seed, arranca el servidor y verifica que `GET /health` devuelve `{"status":"ok"}`.

### 7.6 Ejemplo de bug detectado por los tests

Durante el desarrollo se detectó un bug real en `FinalCTASection.tsx`: el email de contacto estaba hardcodeado como `hola@automatizaia.com` (dominio anterior al rebrand a Serubix). El test:

```typescript
it('el email del CTA pertenece al dominio serubix.com', () => {
  const link = screen.getByRole('link', { name: finalCTA.primaryCTA })
  expect(link).toHaveAttribute('href', expect.stringContaining('serubix.com'))
})
```

...falló, revelando el bug. Se corrigió pasando `contact` como prop desde el content centralizado, eliminando el hardcode.

---

## 8. CI/CD y DevOps

### 8.1 Pipeline de CI (`ci.yml`) — 4 jobs

```
Push/PR a main con cambios en FrontEnd/ o Backend/
                    │
        ┌───────────┴───────────┐
        │                       │
 ┌──────▼──────┐        ┌───────▼───────┐
 │test-frontend│        │check-backend  │
 │             │        │               │
 │ tsc --noEmit│        │prisma generate│
 │ 244 tests   │        │tsc --noEmit   │
 └──────┬──────┘        │npm run build  │
        │               └───────┬───────┘
 ┌──────▼──────┐        ┌───────▼───────────────┐
 │build-frontend        │test-backend-integration│
 │             │        │                        │
 │ next build  │        │ PostgreSQL service      │
 │ standalone  │        │ prisma migrate deploy   │
 └─────────────┘        │ npm run db:seed         │
                        │ smoke test /health       │
                        └────────────────────────┘
```

**Optimizaciones:**
- **Filtro `paths`:** cambios solo en `memoria/` no disparan CI.
- **Caché npm:** `cache-dependency-path` apunta al `package-lock.json` de cada subdirectorio.
- **Jobs paralelos:** `test-frontend` y `check-backend` corren en paralelo.
- **`needs`:** `build-frontend` espera a `test-frontend`; `test-backend-integration` espera a `check-backend`.

### 8.2 Pipeline de despliegue (`deploy.yml`)

Actualmente en `workflow_dispatch` (activación manual) hasta que el VPS esté configurado.

```
Activación manual
       │
Build imagen Frontend → push GHCR :latest + :SHA
Build imagen Backend  → push GHCR :latest + :SHA
       │
SCP → docker-compose.prod.yml + nginx.conf → /opt/serubix/
       │
SSH → cd /opt/serubix/
      docker compose -f docker-compose.prod.yml pull
      docker compose -f docker-compose.prod.yml up -d --remove-orphans
      docker image prune -f
```

**Tags por SHA de commit:** cada imagen se publica con dos tags — `:latest` (para el deploy automático) y `:${SHA}` (para trazabilidad y rollback). Si el deploy de una versión falla, se puede hacer rollback especificando el SHA anterior.

### 8.3 Secretos en CI/CD

| Secreto GitHub | Dónde se usa | Por qué no va en el código |
|---|---|---|
| `AUTH_SECRET` | `build-frontend` (build Next.js) | Se incorpora en el bundle |
| `VPS_HOST` | `deploy.yml` SSH | IP del servidor |
| `VPS_USER` | `deploy.yml` SSH | Usuario SSH |
| `VPS_SSH_KEY` | `deploy.yml` SSH | Clave privada |
| `CI_DB_PASSWORD` | `test-backend-integration` | Contraseña de BD de test |
| `CI_JWT_SECRET` | `test-backend-integration` | Secreto JWT de test |
| `GITHUB_TOKEN` | GHCR login | Automático, sin configuración |

Todos los secretos tienen fallback en el workflow para que los forks públicos puedan ejecutar CI sin configurar secretos (`AUTH_SECRET || 'ci-placeholder...'`).

---

## 9. Infraestructura y despliegue

### 9.1 Entornos y sus ficheros de configuración

| Entorno | Compose | Env | Imágenes |
|---|---|---|---|
| Desarrollo local (Docker) | `docker-compose.yml` | `.env` (raíz) | Build desde fuente |
| Desarrollo local (directo) | — | `Backend/.env` + `FrontEnd/.env.local` | — |
| Tests integración | `docker-compose.ci.yml` | `env.ci` | Build stage `builder` |
| Producción VPS | `docker-compose.prod.yml` | `.env` (en VPS) | Imágenes GHCR |

### 9.2 Variables de entorno — estructura completa

**Raíz `.env` (para Docker Compose):**
```bash
# Dominio
DOMAIN=serubix.com
GITHUB_REPOSITORY=usuario/TFM

# Base de datos
POSTGRES_USER=serubix
POSTGRES_PASSWORD=<generado con openssl rand -base64 32>
POSTGRES_DB=serubix

# Backend
NODE_ENV=production
PORT=4000
JWT_SECRET=<generado con openssl rand -base64 32>
OPENAI_API_KEY=sk-proj-...

# Frontend (Auth.js)
AUTH_SECRET=<generado con openssl rand -base64 32>
# AUTH_GOOGLE_ID=...
# AUTH_GOOGLE_SECRET=...
```

**Backend `.env` (desarrollo sin Docker):**
```bash
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://serubix:serubix@localhost:5432/serubix
JWT_SECRET=<mismo que raíz>
OPENAI_API_KEY=sk-proj-...
FRONTEND_URL=http://localhost:3000
```

**`env.ci` (commiteado — solo valores de prueba):**
```bash
CI_DB_USER=serubix
CI_DB_PASSWORD=serubix_ci_test
CI_JWT_SECRET=ci-jwt-only-for-integration-tests
CI_AUTH_SECRET=ci-auth-only-for-integration-tests
```

**Por qué `env.ci` sí se puede commitear:** solo contiene credenciales para una base de datos efímera de tests que existe durante segundos en un contenedor aislado. No hay datos reales en riesgo.

### 9.3 Docker Compose de producción

El `docker-compose.prod.yml` utiliza imágenes pre-construidas de GHCR (no builds in situ) para garantizar que lo que se despliega en producción es exactamente lo que CI validó. Los 4 servicios:

```
db (postgres:16-alpine)
  ├── healthcheck: pg_isready
  └── volume: postgres_data (persistente)

backend (imagen GHCR)
  ├── depends_on: db (condition: service_healthy)
  ├── DATABASE_URL construida con POSTGRES_* vars
  └── FRONTEND_URL: https://${DOMAIN}

frontend (imagen GHCR)
  ├── depends_on: backend
  └── NEXT_PUBLIC_API_URL: https://${DOMAIN}/api

nginx (nginx:alpine)
  ├── puertos: 80/443 → públicos
  ├── mount: nginx.conf (routing frontend/backend)
  └── mount: /etc/letsencrypt (certificados HTTPS)
```

### 9.4 Nginx como reverse proxy

```nginx
location /          → frontend:3000   (landing + área cliente)
location /api/      → backend:4000    (API REST)
location /_next/static/  → cache 1 año (assets inmutables)
```

Nginx es la única puerta de entrada pública. Los servicios `frontend` y `backend` usan `expose` (no `ports`), lo que significa que no son accesibles desde el exterior, solo desde la red interna Docker `serubix`.

### 9.5 Multi-stage build del Backend

```dockerfile
# Stage builder: compila TypeScript, genera Prisma Client
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci                  # instala TODAS las deps (dev + prod)
RUN npx prisma generate     # genera @prisma/client
COPY . .                    # copia src/, tsconfig.json, etc.
RUN npm run build           # tsc → dist/

# Stage runner: imagen mínima de producción
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 backend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
USER backend
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

El stage `builder` es el target que usa `docker-compose.ci.yml` para poder ejecutar `ts-node` y `prisma migrate deploy` durante los tests de integración.

---

## 10. Seguridad

### 10.1 Medidas implementadas

| Medida | Dónde | Implementación |
|---|---|---|
| Hash de contraseñas | Backend | `bcrypt.hash(password, 12)` — factor 12 rondas |
| JWT con firma | Backend | `jsonwebtoken` con `JWT_SECRET` de 32 bytes |
| Validación de entradas | Backend | Zod en todos los endpoints que reciben body |
| CORS restrictivo | Backend | `origin: process.env.FRONTEND_URL` — solo el frontend autorizado |
| Headers de seguridad | Backend | `helmet()` — X-Frame-Options, CSP, HSTS, etc. |
| Rutas protegidas | Frontend | Middleware Next.js + doble protección en DashboardLayout |
| Sesiones httpOnly | Frontend | Auth.js — cookie `httpOnly`, no accesible desde JS |
| No root en contenedores | Docker | Backend: usuario `backend` (UID 1001). Frontend: `nextjs` (UID 1001) |
| Secretos en variables de entorno | Todo | `.env` en VPS/CI, nunca en código fuente |
| `.env` excluido del repo | Git | `.gitignore`: `.env` y `.env.*` (excepto `.env.example`) |

### 10.2 Protección de rutas — doble capa

La protección del área privada tiene dos niveles independientes:

**Nivel 1 — middleware.ts (Edge Runtime):**
```typescript
// Redirige antes de renderizar cualquier página
if (!isLoggedIn && isProtected) redirect('/login?callbackUrl=...')
```

**Nivel 2 — DashboardLayout (Server Component):**
```typescript
// Protección en el layout del área privada
const session = await auth()
if (!session?.user) redirect('/login')
```

Esto garantiza que incluso si alguien consigue bypassear el middleware, el layout verifica la sesión en el servidor.

### 10.3 Seguridad en la API

**Error de credenciales intencionalmente genérico:**
```typescript
// No se indica si el email no existe o la contraseña es incorrecta
// → evita user enumeration attacks
if (!user?.passwordHash) throw new AppError('Credenciales incorrectas', 401)
const valid = await bcrypt.compare(password, user.passwordHash)
if (!valid) throw new AppError('Credenciales incorrectas', 401)
```

**Control de límites de plan (Payment Required 402):**
El endpoint TTS verifica los límites antes de llamar a OpenAI, evitando costes inesperados por uso no autorizado.

### 10.4 Medidas previstas en próximas fases

- Rate limiting en endpoints de IA (`express-rate-limit`)
- Refresh tokens para sesiones de larga duración
- Logs de auditoría de accesos y ejecuciones
- Firma HMAC en webhooks de n8n
- Content Security Policy completo en Nginx

---

## 11. Accesibilidad y SEO

### 11.1 Implementación WCAG 2.1 nivel AA

**Estructura semántica:**
- Un único `<h1>` por página (título del hero en landing, nombre de sección en dashboard)
- Jerarquía de headings: H1 → H2 por sección → H3 por tarjeta
- `<nav>`, `<main>`, `<footer>`, `<section>` con roles semánticos implícitos

**ARIA:**
- `aria-labelledby` en secciones apuntando a su H2 correspondiente
- `aria-label` en navegaciones secundarias y listas temáticas
- `aria-hidden="true"` en emojis, iconos decorativos y elementos visuales
- `aria-current="page"` en el Sidebar para indicar la ruta activa
- `role="alert"` en mensajes de error de formularios (login, registro)

**Teclado:**
- Todos los elementos interactivos tienen `focus-ring` visible
- Orden de tabulación lógico siguiendo el flujo visual

### 11.2 SEO técnico

```typescript
export const metadata: Metadata = {
  title: 'Automatización e Inteligencia Artificial para Empresas | Serubix',
  description: 'Plataforma especializada en automatización de procesos...',
  openGraph: { siteName: 'Serubix', locale: 'es_ES', type: 'website' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}
```

- `lang="es"` en el elemento `<html>` raíz
- Las rutas del dashboard (`/dashboard`, `/perfil`…) **no** tienen SEO metadata — son páginas privadas que no deben indexarse

---

## 12. Buenas prácticas de ingeniería — evidencia

Esta sección documenta las buenas prácticas aplicadas en el proyecto con evidencia directa del código: fichero de referencia, fragmento real y justificación técnica.

---

### 12.1 Clean Architecture

**Principio:** las capas solo conocen a las capas inferiores; nunca al revés.

#### Frontend — 3 capas

| Capa | Fichero(s) | Dependencias |
|---|---|---|
| Presentación | `components/landing/*.tsx` | Solo importan de Features |
| Features | `features/landing/landing-content.ts` | Solo importan de Types |
| Types | `features/landing/landing.types.ts` | Sin dependencias |

**Evidencia:** `HeroSection.tsx` recibe el contenido como prop tipada; no conoce su origen.

```typescript
// components/landing/HeroSection.tsx
export function HeroSection({ hero }: { hero: HeroContent }) {
  return <section>...</section>
}

// app/page.tsx — la página orquesta, no el componente
import { content } from '@/features/landing/landing-content'
<HeroSection hero={content.hero} />
```

Si el contenido migra a un CMS, únicamente cambia `landing-content.ts`; ningún componente se modifica.

#### Backend — 3 capas

| Capa | Fichero(s) | Dependencias |
|---|---|---|
| HTTP | `routes/*.ts` | Services, Middleware |
| Negocio | `services/*.ts` | Lib (Prisma, JWT, Errors) |
| Infraestructura | `lib/*.ts`, `schemas/*.ts` | Node.js, npm packages |

**Evidencia:** los servicios no importan nada de Express. `auth.service.ts` no conoce `req`, `res` ni `next`:

```typescript
// services/auth.service.ts — sin imports de Express
import { prisma } from '../lib/prisma'
import { signToken } from '../lib/jwt'
import { AppError } from '../lib/errors'

export const authService = {
  async register({ name, email, password }: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new AppError('Email ya registrado', 409)
    // ...
  }
}
```

Si el framework cambia de Express a Fastify, solo se reescriben los ficheros de `routes/`. Los servicios no se tocan.

---

### 12.2 SOLID

#### S — Single Responsibility Principle

Cada módulo tiene **una única razón para cambiar**.

| Módulo | Responsabilidad única | Fichero |
|---|---|---|
| `requireAuth` | Verificar JWT Bearer token | `middleware/auth.middleware.ts` |
| `validate(schema)` | Validar cuerpo de la petición con Zod | `middleware/validate.middleware.ts` |
| `errorMiddleware` | Formatear y enviar errores HTTP | `middleware/error.middleware.ts` |
| `asyncHandler` | Capturar errores async y pasarlos a `next` | `lib/async-handler.ts` |
| `useContentItems` | Fetching y polling de contenido generado | `hooks/useContentItems.ts` |
| `useTtsGenerate` | Llamada a la API TTS y gestión de estado | `hooks/useTtsGenerate.ts` |
| `authHeaders()` | Construir cabeceras de autenticación | `lib/api.ts` |

**Evidencia — `asyncHandler`:** antes de extraerlo, cada ruta tenía su propio bloque try/catch, mezclando la lógica HTTP con el manejo de errores:

```typescript
// ❌ Antes — cada ruta repetía la misma estructura de 5 líneas
router.post('/register', async (req, res, next) => {
  try {
    const user = await authService.register(req.body)
    res.status(201).json(user)
  } catch (err) {
    next(err)   // ← misma línea en los 10 endpoints
  }
})

// ✅ Después — asyncHandler asume esa responsabilidad una sola vez
// lib/async-handler.ts
export function asyncHandler(fn: AsyncFn): RequestHandler {
  return (req, res, next) => fn(req, res, next).catch(next)
}

// Ruta: solo lógica HTTP, sin try/catch
router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const result = await authService.register(req.body)
  res.status(201).json(result)
}))
```

**Evidencia — hooks de React:** `ContentGrid.tsx` tenía 80 líneas mezclando lógica de fetching con render. Tras aplicar SRP:

```typescript
// hooks/useContentItems.ts — solo datos
export function useContentItems() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  // polling, fetch, cleanup...
  return { items, loading }
}

// components/dashboard/ContentGrid.tsx — solo render
export function ContentGrid() {
  const { items, loading } = useContentItems()  // datos delegados al hook
  if (loading) return <Spinner />
  return <table>...</table>
}
```

#### O — Open/Closed Principle

El sistema está **abierto para extensión, cerrado para modificación**.

**Evidencia:** añadir la herramienta `text-to-image` no requiere modificar ningún fichero existente:

```
+ Backend/src/schemas/image.schema.ts       (nuevo)
+ Backend/src/services/image.service.ts     (nuevo)
+ Backend/src/routes/image.routes.ts        (nuevo, 3 líneas en app.ts)
```

Los middleware `requireAuth`, `validate`, `errorMiddleware` y `asyncHandler` funcionan sin cambios con la nueva ruta.

#### L — Liskov Substitution Principle

**Evidencia:** `AppError` extiende `Error` y puede sustituirlo en cualquier contexto. El `errorMiddleware` usa `instanceof AppError` para diferenciar errores controlados de los inesperados, sin acoplarse a ninguna ruta concreta:

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
  }
}

// middleware/error.middleware.ts
export function errorMiddleware(err: Error, req: Request, res: Response) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }
  res.status(500).json({ error: 'Error interno del servidor' })
}
```

#### I — Interface Segregation Principle

**Evidencia:** los componentes React solo reciben las props que necesitan. `ProfileForm` no recibe la sesión entera; recibe solo `name` y `email`:

```typescript
// Bien — solo lo necesario
interface ProfileFormProps {
  name: string | null | undefined
  email: string | null | undefined
}
export function ProfileForm({ name, email }: Readonly<ProfileFormProps>) { ... }

// El token JWT se obtiene internamente vía useSession, no como prop
// → el padre no necesita saber que ProfileForm habla con la API
```

#### D — Dependency Inversion Principle

**Evidencia:** los hooks del frontend dependen de abstracciones (`fetch`, variables de entorno), no de implementaciones concretas. En tests se mockea `fetch` globalmente sin tocar el hook:

```typescript
// hooks/useTtsGenerate.ts — depende de fetch (abstracción)
const apiUrl = process.env.NEXT_PUBLIC_API_URL  // leído dentro de la función
const res = await fetch(`${apiUrl}/tools/tts`, { ... })

// test/components/TtsWidget.test.tsx — sustitución sin modificar el hook
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }))
```

---

### 12.3 DRY — Don't Repeat Yourself

**Principio:** cada pieza de conocimiento tiene una representación única y autoritativa.

#### Eliminación de try/catch duplicados

**Evidencia:** `asyncHandler` elimina 10 bloques idénticos (uno por endpoint). Antes de la refactorización:

```typescript
// routes/auth.routes.ts  — duplicación en CADA ruta
router.post('/login', async (req, res, next) => {
  try { ... } catch (err) { next(err) }    // línea 1
})
router.get('/me', requireAuth, async (req, res, next) => {
  try { ... } catch (err) { next(err) }    // línea 2, idéntica
})
// × 10 endpoints en 4 ficheros de rutas
```

Después: 0 bloques try/catch en rutas. El conocimiento de "cómo propagar errores async" vive en un único lugar.

#### Función `currentMonth()` centralizada

```typescript
// lib/date.ts — una sola definición
export function currentMonth(): number {
  const d = new Date()
  return d.getFullYear() * 100 + (d.getMonth() + 1)
}

// Usada en services/tts.service.ts Y services/users.service.ts
// Si cambia el formato del mes, se cambia en un solo lugar
```

#### Cabeceras de autenticación centralizadas

```typescript
// lib/api.ts — definición única
export function authHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// Usada en: ContentGrid.tsx, TtsWidget (via hook), ProfileForm.tsx
// Si el formato del header cambia, se cambia en un solo lugar
```

#### Tipo `ContentItem` como fuente única de verdad

```typescript
// types/content.ts
export interface ContentItem {
  id: string
  tool: string
  label: string
  status: 'pending' | 'done' | 'error'
  filename: string | null
  createdAt: string
}
// Importado en: useContentItems.ts, ContentGrid.tsx, test/ContentGrid.test.tsx
// El tipo evoluciona en un solo fichero; TypeScript propaga el cambio
```

#### Contenido de la landing centralizado

```typescript
// features/landing/landing-content.ts — fuente única
export const content = {
  hero: { headline: '...', subheadline: '...', cta: '...' },
  services: [...],
  footer: { links: [...], email: 'hola@serubix.com' },
}
// 10 componentes consumen este objeto; ninguno tiene texto hardcodeado
```

---

### 12.4 Fail Fast

**Principio:** detectar y rechazar entradas inválidas lo antes posible, antes de ejecutar lógica costosa.

#### Validación en el boundary del sistema

```typescript
// middleware/validate.middleware.ts
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      // ← rechaza ANTES de llamar al servicio
      return res.status(400).json({
        error: 'Datos inválidos',
        details: result.error.flatten().fieldErrors,
      })
    }
    req.body = result.data   // body tipado y validado
    next()
  }
}
```

#### Autenticación antes de lógica de negocio

```typescript
// Orden en la ruta: requireAuth → validate → handler
router.post('/tools/tts',
  requireAuth,           // 1. ¿Tiene token válido? → 401 si no
  validate(ttsSchema),   // 2. ¿Body correcto?       → 400 si no
  asyncHandler(async (req, res) => {
    // Solo llega aquí si supera los dos filtros anteriores
    const id = await ttsService.startGeneration(req.user!.id, req.body)
    res.status(202).json({ id })
  })
)
```

#### Verificación de cuota antes de llamar a OpenAI

```typescript
// services/tts.service.ts
async function checkPlanLimit(userId: string, textLength: number) {
  const agg = await prisma.usage.aggregate({ _sum: { amount: true }, where: { userId, tool: 'tts', month: currentMonth() } })
  const used = agg._sum.amount ?? 0
  if (used + textLength > ttsLimit) {
    throw new AppError(`Límite mensual alcanzado`, 402)
    // ← lanza ANTES de llamar a openai.audio.speech.create()
    // → evita un coste de API innecesario
  }
}
```

#### TypeScript en modo strict

```json
// tsconfig.json — Backend y Frontend
{ "compilerOptions": { "strict": true } }
```

Con `strict: true`, TypeScript activa `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes` y otros 6 flags. Los errores se detectan en tiempo de compilación, no en producción.

---

### 12.5 Patrones de diseño aplicados

#### Patrón Wrapper / Decorator — `asyncHandler`

```typescript
// lib/async-handler.ts
// Decora una función async para que sus errores vayan a next()
export function asyncHandler(fn: AsyncFn): RequestHandler {
  return (req, res, next) => fn(req, res, next).catch(next)
}
```

#### Patrón Factory — `validate(schema)`

El middleware `validate` es una factory function: recibe un schema Zod y **devuelve** un middleware Express. Esto permite reutilizarlo con cualquier schema sin duplicar código:

```typescript
router.post('/register', validate(registerSchema), ...)
router.post('/login',    validate(loginSchema), ...)
router.patch('/users/me', validate(updateProfileSchema), ...)
```

#### Patrón Singleton — cliente Prisma

```typescript
// lib/prisma.ts
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Garantiza que solo existe una conexión al pool de PostgreSQL en desarrollo (donde Next.js hace hot reload), evitando el error `Too many connections`.

#### Patrón Provider — `Providers.tsx`

```typescript
// components/Providers.tsx
'use client'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SessionProvider>{children}</SessionProvider>
}
```

Encapsula el context provider de Auth.js en un Client Component, permitiendo que el layout raíz sea un Server Component puro. El patrón Provider es el estándar de React para inyección de contexto.

#### Patrón Fire-and-Forget con gestión de errores

```typescript
// services/tts.service.ts
// startGeneration devuelve 202 inmediatamente
// La generación real ocurre en background
generateAndStore(userId, content.id, input).catch(async (err) => {
  console.error('[TTS]', err.message)
  await contentService.markError(content.id).catch(() => null)
  // ← el catch interno evita unhandled promise rejection
})

return content.id  // respuesta inmediata al cliente
```

Este patrón permite que el cliente reciba una respuesta rápida y monitorice el progreso mediante polling, en lugar de esperar 3-5 segundos a que OpenAI genere el audio.

---

### 12.6 Buenas prácticas de testing

#### Mock de dependencias de sistema (`localStorage`)

jsdom, el entorno de test de Vitest, tiene una implementación parcial de `localStorage` sin soporte para `clear()`. La solución correcta es sustituir el objeto completo, no parchear métodos individuales:

```typescript
// test/components/CookieBanner.test.tsx
let mockStore: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem:    (key: string): string | null => mockStore[key] ?? null,
  setItem:    (key: string, value: string) => { mockStore[key] = value },
  removeItem: (key: string)               => { delete mockStore[key] },
  clear:      ()                          => { mockStore = {} },
})
beforeEach(() => { mockStore = {} })  // reset entre tests
```

#### `vi.hoisted()` — mocks que se referencian en factories

`vi.mock()` se hoist al inicio del módulo antes de que los imports se resuelvan. Si el factory de `vi.mock()` referencia una variable declarada después, esa variable está en el Temporal Dead Zone (TDZ) y lanza `ReferenceError`. `vi.hoisted()` resuelve este problema:

```typescript
// ❌ Sin hoisting — ReferenceError en tiempo de ejecución
const mockSignIn = vi.fn()
vi.mock('next-auth/react', () => ({ signIn: mockSignIn }))
// mockSignIn está en TDZ cuando el factory se ejecuta

// ✅ Con hoisting — la función se inicializa antes del hoisting del mock
const mockSignIn = vi.hoisted(() => vi.fn())
vi.mock('next-auth/react', () => ({ signIn: mockSignIn }))
```

#### Exclusiones de cobertura justificadas

No todo el código debe medirse con cobertura. Los ficheros excluidos son thin wrappers sobre librerías de terceros que no tienen lógica propia que testear:

```typescript
// vitest.config.ts
coverage: {
  exclude: [
    'src/components/Providers.tsx',   // wrapper de 3 líneas sobre SessionProvider
    'src/lib/auth.ts',                // configuración declarativa de Auth.js
    'src/middleware.ts',              // infraestructura de Next.js
    'src/app/api/**',                 // re-export de 2 líneas de Auth.js
    'src/features/landing/landing.types.ts',  // solo interfaces TypeScript
  ]
}
```

Incluir estos ficheros en cobertura daría falsa seguridad: los tests pasarían sin validar nada de negocio.

#### Tests en 3 niveles

| Nivel | Qué valida | Ejemplo |
|---|---|---|
| **Unitario** | Integridad de datos sin render | `landing-content.test.ts` — URLs válidas, arrays no vacíos |
| **Componente** | Render, props, interacciones, estados | `CookieBanner.test.tsx` — aceptar/rechazar cookies |
| **Integración** | Composición de página completa | `page.test.tsx` — marca, navegación, SEO |

---

### 12.7 Buenas prácticas de seguridad

#### Contraseñas — bcrypt con factor de coste 12

```typescript
// services/auth.service.ts
const passwordHash = await bcrypt.hash(password, 12)
// Factor 12 → ~300ms por verificación → ataques de fuerza bruta inviables
// bcryptjs (pure JS) → sin dependencias nativas → funciona en Alpine Linux
```

#### Error genérico para evitar user enumeration

```typescript
// No se indica si el email no existe o la contraseña es incorrecta
// Un atacante no puede saber si un email está registrado
if (!user?.passwordHash) throw new AppError('Credenciales incorrectas', 401)
const valid = await bcrypt.compare(password, user.passwordHash)
if (!valid)              throw new AppError('Credenciales incorrectas', 401)
//                                          ↑ mismo mensaje en ambos casos
```

#### Doble protección de rutas privadas

```typescript
// Nivel 1 — middleware.ts (Edge Runtime, ejecuta ANTES del render)
if (!isLoggedIn && isProtected) redirect('/login?callbackUrl=...')

// Nivel 2 — app/(dashboard)/layout.tsx (Server Component)
const session = await auth()
if (!session?.user) redirect('/login')
// Protección redundante: si el middleware falla, el layout rechaza igualmente
```

#### Contenedores sin privilegios de root

```dockerfile
# Backend/Dockerfile — Stage runner
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 backend
USER backend   # ← el proceso Node.js nunca tiene permisos de root
```

#### Cookies httpOnly — sesión inaccesible desde JavaScript

Auth.js almacena la sesión en una cookie `httpOnly`, `secure` y con `SameSite=lax`. JavaScript del navegador no puede leerla, lo que elimina el vector de ataque XSS más común.

---

### 12.8 Buenas prácticas de DevOps

#### Multi-stage build — imagen Docker mínima

```dockerfile
# Stage builder: incluye devDependencies, TypeScript, Prisma CLI
FROM node:20-alpine AS builder
RUN npm ci && npx prisma generate && npm run build

# Stage runner: SOLO artefactos de producción
FROM node:20-alpine AS runner
COPY --from=builder /app/dist ./dist          # código compilado
COPY --from=builder /app/node_modules ./node_modules  # solo prod deps
COPY --from=builder /app/prisma ./prisma      # schema para migraciones
# → sin src/, sin tsconfig, sin devDependencies
# → imagen ~80 MB vs ~400 MB sin multi-stage
```

#### Imágenes etiquetadas por SHA de commit

```yaml
# .github/workflows/deploy.yml
docker build -t ghcr.io/repo/backend:latest \
             -t ghcr.io/repo/backend:${{ github.sha }} .
# :latest → deploy automático siempre apunta a lo último
# :SHA    → permite rollback a cualquier versión anterior
```

#### Volúmenes Docker para persistencia de datos

```yaml
# docker-compose.yml
services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data  # BD persiste entre reinicios
  backend:
    volumes:
      - tts_storage:/app/storage                # audios persisten entre reinicios

volumes:
  postgres_data:
  tts_storage:
```

Sin `tts_storage`, cada reinicio del contenedor borraría todos los audios generados.

#### Jobs de CI paralelos con dependencias explícitas

```yaml
# .github/workflows/ci.yml
jobs:
  test-frontend:   { ... }    # paralelo
  check-backend:   { ... }    # paralelo

  build-frontend:
    needs: test-frontend       # solo si tests pasan
  test-backend-integration:
    needs: check-backend       # solo si types + build pasan
```

`test-frontend` y `check-backend` corren en paralelo, reduciendo el tiempo total de CI a ~3 minutos.

---

### 12.9 Cumplimiento RGPD / LSSI

#### Banner de consentimiento de cookies

```typescript
// components/landing/CookieBanner.tsx
'use client'
export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Solo muestra el banner si no hay decisión previa almacenada
    const consent = localStorage.getItem('serubix_cookies_consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('serubix_cookies_consent', 'accepted')
    setVisible(false)
  }
  function reject() {
    localStorage.setItem('serubix_cookies_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null
  return (
    <div role="dialog" aria-live="polite">
      <button onClick={accept}>Aceptar todo</button>
      <button onClick={reject}>Solo esenciales</button>
    </div>
  )
}
```

#### Política de cookies excluida de indexación

```typescript
// app/politica-de-cookies/page.tsx
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  // → los buscadores no indexan la página de política
  // → cumple con la recomendación de la AEPD
}
```

La política documenta las 4 cookies técnicas en uso (`authjs.session-token`, `authjs.csrf-token`, `authjs.callback-url`, `serubix_cookies_consent`) con base legal RGPD art. 6.1.b (ejecución de contrato) y LSSI art. 22.2 (cookies técnicas exentas de consentimiento).

---

## 13. Métricas del proyecto

### 13.1 Frontend

| Métrica | Valor |
|---|---|
| Componentes React | 17 (10 landing + 3 auth + 4 dashboard) |
| Páginas implementadas | 6 (landing, login, register, dashboard, perfil, plan, herramientas) |
| Líneas de código (src/) | ~2.500 |
| Ficheros TypeScript | 35+ |
| Tests totales | 244 |
| Cobertura statements | 99,89% |
| Tiempo de tests | ~3.7s |
| Tiempo de build | ~5s |
| Tamaño First Load JS | 103 kB (landing) |

### 13.2 Backend

| Métrica | Valor |
|---|---|
| Endpoints REST | 8 |
| Modelos Prisma | 3 (User, Plan, Usage) |
| Ficheros TypeScript | 20 |
| Líneas de código (src/) | ~450 |
| Compilación TypeScript | Limpia (0 errores) |

### 13.3 DevOps

| Métrica | Valor |
|---|---|
| Jobs en CI | 4 |
| Workflows configurados | 2 (ci.yml + deploy.yml) |
| Ficheros docker-compose | 3 (dev, prod, ci) |
| Tiempo de pipeline CI (estimado) | ~3-4 min |

### 13.4 Calidad de código (Next.js Build)

```
Route (app)                        Size    First Load JS
┌ ○ /                             820 B        103 kB
├ ƒ /dashboard                    1.2 kB       108 kB
├ ƒ /herramientas                 1.8 kB       109 kB
├ ƒ /perfil                       1.1 kB       108 kB
├ ƒ /plan                         1.4 kB       108 kB
├ ○ /login                        2.1 kB       110 kB
└ ○ /register                     2.3 kB       110 kB
```

`○` = Estático (pre-renderizado). `ƒ` = Dinámico (requiere servidor, lee sesión).

---

## 14. Valor académico y profesional

### 14.1 Competencias demostradas

| Competencia | Evidencia concreta |
|---|---|
| Arquitectura fullstack | Frontend + Backend + DB con separación clara de capas |
| Desarrollo frontend avanzado | Next.js 15 App Router, Server/Client Components, route groups |
| Autenticación profesional | Auth.js v5, Google OAuth, JWT, bcrypt, middleware de protección |
| API REST | 8 endpoints, JWT, Zod validation, error handling centralizado |
| ORM y modelado de datos | Prisma, migraciones versionadas, relaciones, índices |
| Integración de IA | OpenAI TTS, control de límites de uso por plan, rate limiting por mes |
| Testing avanzado | 244 tests, 3 niveles, `vi.hoisted()`, mocks de sesión y fetch |
| DevOps | Docker multi-stage, 3 compose files, CI con integración DB real |
| Seguridad | bcrypt, JWT, CORS, Helmet, doble protección de rutas, no root |
| Accesibilidad | WCAG 2.1, ARIA, roles semánticos, `aria-current` |
| Metodología | SOLID, DRY, Clean Architecture en ambas capas, Fail Fast |

### 14.2 Proyecto real, no académico

El proyecto no es un ejercicio teórico. Es una empresa en construcción con:
- Dominio y marca propios (`serubix.com`)
- Email corporativo (`hola@serubix.com`)
- Pipeline de CI/CD real en GitHub Actions
- Infraestructura Docker lista para producción
- Producto SaaS funcional (TTS) con modelo de negocio Free/Pro
- VPS contratado para el despliegue final

Esto lo diferencia de la mayoría de TFMs y demuestra capacidad de llevar un proyecto técnico de la idea a producción.

---

## 15. Roadmap y evolución futura

### Fases completadas

- [x] Landing page profesional con identidad Serubix (10 secciones)
- [x] Sistema de autenticación completo (email/password + Google OAuth)
- [x] Área privada de clientes con 4 páginas de dashboard
- [x] Backend REST API con Express + TypeScript + Prisma
- [x] Integración OpenAI TTS con control de límites de plan
- [x] Suite de tests completa (244 tests, ~100% cobertura)
- [x] CI/CD con GitHub Actions (4 jobs, tests de integración con DB real)
- [x] Infraestructura Docker para desarrollo, CI y producción

### Próximas fases

**Fase siguiente — Conectar TTS en el dashboard**
- El widget TTS en `/herramientas` necesita llamar a `POST /tools/tts` y reproducir el audio MP3 devuelto
- Reproductor de audio en el navegador con la Web Audio API o `<audio>`

**Integración Google OAuth con backend**
- Al autenticarse con Google, crear/actualizar el usuario en la DB del backend
- El flujo actual crea sesión Auth.js pero no registra el usuario en PostgreSQL

**Gestión de pagos**
- Integración Stripe para el upgrade Free → Pro
- Webhooks de Stripe para activar el plan Pro en la DB

**Herramientas adicionales**
- Generación de YouTube Shorts (integración con FFmpeg o API de vídeo)
- Text to Image (DALL-E 3 o Stable Diffusion)

**Infraestructura adicional**
- Rate limiting con `express-rate-limit`
- Refresh tokens para sesiones largas
- Panel de administración (Prisma Studio en producción o interfaz propia)

---

## 16. Posibles preguntas del tribunal

### ¿Por qué Next.js y no una SPA pura?

Next.js proporciona SSR/SSG nativo que mejora el SEO y rendimiento. Para una landing page orientada a captación de leads, el SEO es crítico — una SPA renderizada en cliente no indexa correctamente. Además, App Router permite que las páginas del dashboard sean Server Components que leen la sesión directamente en el servidor, sin exponer información sensible al cliente.

### ¿Por qué Express y no NestJS para el backend?

NestJS es una excelente opción para equipos grandes, pero añade complejidad significativa: decoradores, inyección de dependencias, módulos, etc. Para un MVP con un solo desarrollador, Express con una estructura de capas clara (routes → services → lib) ofrece la misma separación de responsabilidades con menos boilerplate. La Clean Architecture no la aporta el framework, sino la organización del código.

### ¿Por qué Prisma y no Drizzle o TypeORM?

Prisma tiene la mejor experiencia de desarrollo para TypeScript: schema declarativo, migraciones automáticas, cliente completamente tipado generado desde el schema. TypeORM tiene deuda técnica y problemas conocidos con decoradores. Drizzle es más reciente pero con ecosistema más pequeño. Para un proyecto que prioriza velocidad y type-safety, Prisma es la opción más madura.

### ¿Cómo proteges las rutas del área privada?

Doble capa: el middleware de Next.js (`middleware.ts`) intercepta todas las rutas con `matcher` y redirige a `/login` si no hay sesión válida. Adicionalmente, el `DashboardLayout` (Server Component) llama a `auth()` y redirige si la sesión no existe. Esta redundancia garantiza que incluso si el middleware falla o es bypasseado, el layout del servidor nunca sirve contenido privado sin autenticación.

### ¿Por qué Auth.js en el frontend si el backend tiene su propio JWT?

Son dos sistemas con responsabilidades distintas. Auth.js gestiona la sesión del navegador: cookies httpOnly, CSRF, expiración, refresh automático, Google OAuth. El backend JWT autentica las llamadas a la API REST. El `backendToken` se almacena dentro del JWT de Auth.js, de modo que el cliente puede usarlo para llamadas a la API sin gestionarlo manualmente. Si el backend fuera público o una API de terceros, esta separación sería igualmente válida.

### ¿Cómo garantizas que las contraseñas son seguras?

No se almacenan contraseñas en texto plano. Se usa bcrypt con factor de coste 12, que genera un hash irreversible. En caso de brecha de base de datos, el atacante tiene hashes, no contraseñas. La comparación con `bcrypt.compare()` es deliberadamente lenta (~300ms), haciendo los ataques de fuerza bruta inviables. Además, se usa bcryptjs (pure JS) que funciona sin dependencias nativas en Alpine Linux (Docker).

### ¿Cómo controlas los costes de OpenAI en el TTS?

El servicio TTS implementa control de cuota antes de llamar a OpenAI. Para el plan Free (límite de 5.000 caracteres/mes), el sistema consulta la suma de `usages.amount` del mes actual para ese usuario antes de cada solicitud. Si `usedThisMonth + text.length > ttsLimit`, devuelve un `402 Payment Required` sin llamar a OpenAI. Esto garantiza que los costes están acotados por usuario y plan.

### ¿Qué es `vi.hoisted()` y por qué lo usas en los tests?

`vi.mock()` se hoist automáticamente al inicio del fichero por el compilador de Vitest, antes de que se ejecuten los imports. Si el factory de `vi.mock()` referencia una variable `const` declarada más abajo, esa variable está en el temporal dead zone (TDZ) y el acceso lanza `ReferenceError`. `vi.hoisted()` permite declarar una variable en el ámbito del módulo pero que se inicializa antes de que el hoisting de `vi.mock()` se ejecute. Solo es necesario cuando la variable se referencia directamente en el objeto del factory (no dentro de una función closure).

### ¿Por qué tres ficheros docker-compose en lugar de uno?

Porque los tres entornos tienen necesidades distintas e incompatibles. Desarrollo local usa builds desde el código fuente para ver cambios en tiempo real. Producción usa imágenes pre-construidas de GHCR (lo que se validó en CI es lo que se despliega). CI necesita el stage `builder` del Dockerfile (con todas las dependencias dev) para poder ejecutar migraciones y `ts-node`. Un único docker-compose con muchas condiciones sería difícil de mantener y propenso a errores de configuración.

### ¿Cómo escala esta arquitectura si crece el equipo o el tráfico?

**Equipo:** el monorepo con `FrontEnd/` y `Backend/` independientes permite que dos desarrolladores trabajen en paralelo. Los filtros `paths` en CI son independientes. Si el equipo crece más, se puede evolucionar a turborepo sin cambiar la estructura.

**Tráfico:** el frontend Next.js escala horizontalmente (stateless, múltiples réplicas detrás de Nginx). El backend Express también es stateless (JWT en lugar de sesiones en memoria). PostgreSQL es el único componente con estado; para escalar se añade read replicas o se migra a un managed service (Supabase, Railway, AWS RDS). La tabla `usages` tiene índice `[userId, tool, month]` para que las consultas de cuota sean eficientes incluso con millones de registros.

### ¿Qué cambiarías si tuvieras que refactorizar desde cero?

Añadiría tests unitarios al backend desde el inicio, inyectando Prisma como dependencia en los servicios para poder mockearla. En el frontend, implementaría React Query para el estado del servidor (datos del usuario, uso del plan) en lugar de gestionar el estado con `useSession` directamente — esto daría caché, invalidación y loading states de forma declarativa. También separaría el `backendToken` de la sesión de Auth.js y usaría el SDK de Prisma Accelerate para connection pooling en producción.

---

*Documentación técnica para la defensa del Trabajo de Fin de Máster — Junio 2026*  
*Revisión: incluye backend completo, autenticación, área de clientes, CI/CD con integración DB, y gestión de entornos*
