# Serubix

Plataforma SaaS de automatización comercial e inteligencia artificial para empresas.

---

## ¿Qué es Serubix?

Serubix es una plataforma web que combina automatización de procesos empresariales, asistentes conversacionales con IA y herramientas SaaS de generación de contenido, orientada a autónomos, pequeñas empresas y agencias que quieren escalar sin aumentar carga operativa.

Este repositorio contiene el desarrollo completo del proyecto: landing page pública, área privada de clientes, API backend e infraestructura de despliegue.

---

## Estructura del repositorio

```
TFM/
├── FrontEnd/                  # Next.js 15 — landing + área cliente
├── Backend/                   # API REST — Express + Node.js + Prisma
├── nginx/                     # Configuración del reverse proxy
├── memoria/                   # Documentación académica del TFM
├── .github/workflows/         # Pipelines CI/CD
│   ├── ci.yml                 # Tests automáticos en PR y merge
│   └── deploy.yml             # Despliegue al VPS (manual)
├── docker-compose.yml         # Entorno de desarrollo local
├── docker-compose.prod.yml    # Despliegue en producción
└── .env.example               # Plantilla de variables de entorno
```

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15, TypeScript, TailwindCSS, Auth.js v5 |
| Backend | Node.js, Express 5, TypeScript |
| Base de datos | PostgreSQL 16 + Prisma ORM |
| IA | OpenAI API (TTS) |
| Infraestructura | Docker, Docker Compose, Nginx |
| CI/CD | GitHub Actions, GHCR |
| Testing (FE) | Vitest, React Testing Library |
| Testing (BE) | Vitest, Supertest |

---

## FrontEnd

### Arrancar en local

```bash
cd FrontEnd
npm install
npm run dev
```

Disponible en `http://localhost:3000`

### Comandos disponibles

```bash
npm run dev           # Servidor de desarrollo
npm run build         # Build de producción
npm run test          # Ejecutar tests
npm run test:watch    # Tests en modo watch
npm run test:coverage # Cobertura — >99% código fuente
```

### Estructura de componentes

```
FrontEnd/src/
├── app/
│   ├── layout.tsx                    # Layout raíz con SessionProvider + CookieBanner
│   ├── page.tsx                      # Página principal (composición de secciones)
│   ├── politica-de-cookies/page.tsx  # Política de cookies (RGPD/LSSI)
│   ├── (auth)/                       # Rutas de autenticación
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/                  # Área privada (requiere sesión)
│       ├── dashboard/page.tsx
│       ├── herramientas/page.tsx     # Text to Speech
│       ├── contenido/page.tsx        # Listado de contenido generado
│       ├── perfil/page.tsx
│       └── plan/page.tsx
├── components/
│   ├── Providers.tsx                 # Wrapper de SessionProvider (client)
│   ├── landing/
│   │   ├── CookieBanner.tsx          # Banner de consentimiento de cookies
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
│   ├── dashboard/
│   │   ├── ContentGrid.tsx           # Tabla de contenido con polling automático
│   │   ├── TtsWidget.tsx             # Formulario de Text to Speech
│   │   ├── ProfileForm.tsx
│   │   └── Sidebar.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       └── GoogleButton.tsx
├── hooks/
│   ├── useContentItems.ts            # Fetching + polling de contenido generado
│   └── useTtsGenerate.ts             # Lógica de llamada a la API TTS
├── lib/
│   └── api.ts                        # authHeaders() — cabeceras de autenticación
├── types/
│   └── content.ts                    # Tipo ContentItem compartido
└── features/landing/
    ├── landing-content.ts            # Contenido centralizado de la landing
    └── landing.types.ts              # Tipos TypeScript de la landing
```

### Flujo de autenticación

Auth.js v5 gestiona la sesión. El backend emite un `backendToken` JWT que se almacena en la sesión de NextAuth y se usa en todas las llamadas autenticadas a la API. Los componentes client usan `useSession()` y deben estar dentro del `<Providers>` wrapper en el layout raíz.

### Banner de cookies

`CookieBanner` se muestra en la primera visita. El usuario puede:
- **Aceptar todo**: guarda `'accepted'` en `localStorage` bajo la clave `serubix_cookies_consent`
- **Solo esenciales**: guarda `'rejected'`

El banner enlaza a `/politica-de-cookies`, que describe las cookies técnicas de sesión utilizadas (Auth.js) y cumple con RGPD art. 6.1.b/f y LSSI art. 22.2. La página está excluida de indexación con `robots: { index: false }`.

---

## Backend

### Arrancar en local

```bash
cd Backend
npm install
npx prisma migrate dev
npm run dev
```

API disponible en `http://localhost:4000`

### Comandos disponibles

```bash
npm run dev           # Servidor de desarrollo (ts-node-dev)
npm run build         # Compilar TypeScript
npm run test          # Ejecutar tests
npm run test:coverage # Cobertura — >99% código fuente
```

### Arquitectura

```
Backend/src/
├── app.ts                        # Express app (middlewares, rutas)
├── index.ts                      # Entry point (listen)
├── routes/
│   ├── auth.routes.ts            # POST /auth/register, POST /auth/login
│   ├── users.routes.ts           # GET /users/me, PATCH /users/me, GET /users/me/usage
│   ├── plans.routes.ts           # GET /plans
│   └── tools.routes.ts           # POST /tools/tts, GET /tools/content, GET /tools/content/:id/download
├── services/
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── plans.service.ts
│   ├── tts.service.ts            # Generación async con OpenAI + guardado en disco
│   └── content.service.ts        # CRUD de GeneratedContent en BD
├── middleware/
│   ├── auth.middleware.ts        # requireAuth — verifica JWT
│   ├── validate.middleware.ts    # Validación con Zod
│   └── error.middleware.ts       # Manejo centralizado de errores
├── lib/
│   ├── async-handler.ts          # asyncHandler() — elimina try/catch en rutas
│   ├── date.ts                   # currentMonth() — año*100 + mes
│   ├── errors.ts                 # AppError con código HTTP
│   ├── jwt.ts                    # sign / verify
│   └── prisma.ts                 # Cliente Prisma singleton
└── schemas/                      # Schemas Zod de validación
```

### Generación TTS asíncrona

`POST /tools/tts` devuelve `202 Accepted` inmediatamente con el `id` del contenido. La generación con OpenAI ocurre en segundo plano (_fire-and-forget_). El frontend monitoriza el progreso mediante polling cada 5 segundos en `GET /tools/content`, que devuelve los ítems de los últimos 7 días con su `status` (`pending` → `done` | `error`).

Los archivos de audio se guardan en `storage/` dentro del contenedor backend. Este directorio está montado como volumen Docker (`tts_storage`) para persistir los audios entre reinicios del contenedor.

### Principios aplicados (SOLID/DRY)

| Patrón | Dónde |
|---|---|
| `asyncHandler` | Elimina try/catch repetido en las 4 rutas (SRP en manejo de errores) |
| `currentMonth()` en `lib/date.ts` | Función compartida entre `tts.service` y `users.service` (DRY) |
| `useContentItems` hook | Separa la lógica de fetching/polling del componente `ContentGrid` (SRP) |
| `useTtsGenerate` hook | Separa la llamada a la API del componente `TtsWidget` (SRP) |
| `authHeaders()` en `lib/api.ts` | Cabeceras de autenticación centralizadas (DRY, usado en 3 componentes) |
| `ContentItem` en `types/content.ts` | Tipo compartido entre hook, componente y tests |

---

## Tests y cobertura

### Frontend — Vitest + React Testing Library

```bash
cd FrontEnd && npm run test:coverage
```

| Métrica | Resultado |
|---|---|
| Tests | >295 pasando |
| Statements | >99% |
| Branches | >99% |
| Functions | >99% |
| Lines | >99% |

**Archivos excluidos del coverage** (thin wrappers sobre librerías de terceros):
- `src/components/Providers.tsx` — wrapper de `SessionProvider` sin lógica propia
- `src/lib/auth.ts` — configuración declarativa de Auth.js
- `src/middleware.ts` — middleware de Next.js
- `src/app/api/**` — route handlers de Auth.js
- `src/features/landing/landing.types.ts` — solo tipos, sin código ejecutable

**Suites de test destacadas:**

| Suite | Tests | Qué cubre |
|---|---|---|
| `CookieBanner.test.tsx` | 9 | Banner cookies, localStorage mock, aceptar/rechazar |
| `PoliticaDeCookiesPage.test.tsx` | 9 | Política RGPD, tabla de cookies |
| `ContentGrid.test.tsx` | 8 | Tabla de contenido, descarga, cabecera Authorization |
| `TtsWidget.test.tsx` | 11 | Formulario TTS, estados, errores 402/red |
| `RegisterForm.test.tsx` | 9 | Registro, errores 409/400/red |

### Backend — Vitest + Supertest

```bash
cd Backend && npm run test:coverage
```

| Métrica | Resultado |
|---|---|
| Tests | >90 pasando |
| Statements | >99% |
| Branches | >98% |
| Functions | >99% |
| Lines | >99% |

---

## Infraestructura

### Volumes Docker

| Volume | Servicio | Propósito |
|---|---|---|
| `postgres_data` | `db` | Datos de PostgreSQL |
| `tts_storage` | `backend` | Audios generados en `/app/storage` |

Los audios se persisten en `tts_storage` para que no se pierdan al reiniciar o actualizar el contenedor del backend.

### Desarrollo local con Docker

```bash
docker compose up -d
```

Levanta: db (PostgreSQL), backend (4000), frontend (3000) y nginx (80).

### Producción

El despliegue en VPS se gestiona mediante GitHub Actions:

1. Push a `main` → tests automáticos en CI
2. Si pasan → build de imágenes Docker → push a GHCR
3. SSH al VPS → `docker compose -f docker-compose.prod.yml pull && up`

Las imágenes se publican en GitHub Container Registry (`ghcr.io`). En producción nginx gestiona TLS (Let's Encrypt) en los puertos 80/443 y hace proxy inverso a frontend y backend.

---

## CI/CD

### Pipeline de tests (`ci.yml`)

Se ejecuta en cada **PR** y **merge a main** cuando hay cambios en `FrontEnd/` o `Backend/`.

| Paso | Acción |
|---|---|
| Checkout | Descarga el código |
| Setup Node 20 | Instala el entorno |
| `npm ci` | Instalación limpia |
| `tsc --noEmit` | Verificación de tipos |
| `npm run test` | Tests con Vitest |
| Build | Compilación (Next.js / tsc) |

### Pipeline de despliegue (`deploy.yml`)

Activación **manual** (`workflow_dispatch`) desde GitHub → Actions → Deploy → Run workflow.

---

## Variables de entorno

Copia `.env.example` a `.env` y rellena los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `DOMAIN` | Dominio del VPS (sin `https://`) |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Credenciales de PostgreSQL |
| `DATABASE_URL` | Cadena de conexión (usada por Prisma) |
| `JWT_SECRET` | Secreto para tokens JWT del backend |
| `AUTH_SECRET` | Secreto de Auth.js (mín. 32 bytes) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Credenciales OAuth de Google |
| `OPENAI_API_KEY` | Clave de OpenAI para TTS |
| `NEXT_PUBLIC_API_URL` | URL de la API visible en el navegador |
| `GITHUB_REPOSITORY` | `usuario/repo` para GHCR (CI lo rellena automáticamente) |

---

## Secrets requeridos en GitHub

| Secret | Descripción |
|---|---|
| `VPS_HOST` | IP o dominio del servidor |
| `VPS_USER` | Usuario SSH |
| `VPS_SSH_KEY` | Clave privada SSH |
| `DOMAIN` | Dominio de producción |

---

## Servicios de Serubix

### Servicios a medida
- Automatización de procesos
- Asistentes conversacionales IA
- Integración de herramientas
- Gestión inteligente de leads
- Automatización comercial

### Productos SaaS
- **Text to Speech** — Disponible (generación async con OpenAI, descarga de audio)
- **Generación de Shorts** — Próximamente
- **Text to Image** — Próximamente

---

## Documentación académica

Ver carpeta [`memoria/`](memoria/) para la documentación completa del TFM.

---

## Contacto

[hola@serubix.com](mailto:hola@serubix.com)
