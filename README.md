# Serubix

Plataforma SaaS de automatización comercial e inteligencia artificial para empresas.

---

## ¿Qué es Serubix?

Serubix es una plataforma web que combina automatización de procesos empresariales, asistentes conversacionales con IA y herramientas SaaS de generación de contenido, orientada a autónomos, pequeñas empresas y agencias que quieren escalar sin aumentar carga operativa.

Este repositorio contiene el desarrollo completo del proyecto: landing page pública, futura área privada de clientes, API backend e infraestructura de despliegue.

---

## Estructura del repositorio

```
TFM/
├── FrontEnd/                  # Next.js 15 — landing + área cliente
├── Backend/                   # API REST (en desarrollo)
├── nginx/                     # Configuración del reverse proxy
├── memoria/                   # Documentación académica del TFM
├── .github/workflows/         # Pipelines CI/CD
│   ├── ci.yml                 # Tests automáticos en PR y merge
│   └── deploy.yml             # Despliegue al VPS (desactivado hasta configuración)
├── docker-compose.yml         # Entorno de desarrollo local
├── docker-compose.prod.yml    # Despliegue en producción
└── .env.example               # Plantilla de variables de entorno
```

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15, TypeScript, TailwindCSS |
| Backend | Node.js (en desarrollo) |
| Base de datos | PostgreSQL + Prisma ORM |
| IA | OpenAI API, Claude API |
| Automatización | n8n |
| Infraestructura | Docker, Docker Compose, Nginx |
| CI/CD | GitHub Actions, GHCR |
| Gestión VPS | Portainer |
| Observabilidad | Sentry |
| Testing | Vitest, React Testing Library |

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
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run test         # Ejecutar tests (151 tests)
npm run test:watch   # Tests en modo watch
npm run test:coverage # Cobertura — 100% código fuente
```

### Estructura de componentes

```
FrontEnd/src/
├── app/
│   ├── layout.tsx             # Layout raíz con metadatos SEO
│   └── page.tsx               # Página principal (composición de secciones)
├── components/landing/        # Componentes de la landing
│   ├── Navbar.tsx             # Navegación sticky con scroll
│   ├── HeroSection.tsx        # Hero con CTAs
│   ├── ProblemSection.tsx     # Problemas que resuelve
│   ├── SolutionSection.tsx    # Propuesta de valor + flujo visual
│   ├── ServicesSection.tsx    # Servicios a medida + Productos SaaS
│   ├── ProcessSection.tsx     # Proceso en 4 pasos
│   ├── BenefitsSection.tsx    # Métricas de impacto
│   ├── ProductPreviewSection.tsx # Mock del dashboard
│   ├── FinalCTASection.tsx    # CTA de conversión
│   └── Footer.tsx             # Pie de página
├── features/landing/
│   ├── landing-content.ts     # Todo el contenido centralizado
│   └── landing.types.ts       # Tipos TypeScript
└── test/
    ├── unit/                  # Tests de integridad de datos
    ├── components/            # Tests de cada componente
    └── integration/           # Tests de página completa
```

---

## Infraestructura

### Desarrollo local con Docker

```bash
docker compose up -d
```

Levanta: frontend (3000), backend (4000) y nginx (80).

### Producción

El despliegue en VPS se gestiona mediante GitHub Actions:

1. Push a `main` → tests automáticos
2. Si pasan → build de imágenes Docker → push a GHCR
3. SSH al VPS → `docker compose pull && up`

Las imágenes se publican en GitHub Container Registry (`ghcr.io`).

---

## CI/CD

### Pipeline de tests (`ci.yml`)

Se ejecuta en cada **PR** y **merge a main** cuando hay cambios en `FrontEnd/`.

| Paso | Acción |
|---|---|
| Checkout | Descarga el código |
| Setup Node 20 | Instala el entorno |
| `npm ci` | Instalación limpia |
| `tsc --noEmit` | Verificación de tipos |
| `npm run test` | 151 tests con Vitest |
| Build | Compilación Next.js |

### Pipeline de despliegue (`deploy.yml`)

Actualmente en modo **manual** (`workflow_dispatch`). Se activa desde GitHub → Actions → Deploy → Run workflow.

---

## Variables de entorno

Copia `.env.example` a `.env` y rellena los valores:

```bash
cp .env.example .env
```

Variables principales:

| Variable | Descripción |
|---|---|
| `DOMAIN` | Dominio del VPS |
| `DATABASE_URL` | Conexión PostgreSQL |
| `JWT_SECRET` | Secreto para tokens |
| `NEXT_PUBLIC_API_URL` | URL de la API desde el navegador |

---

## Secrets requeridos en GitHub

Para activar el despliegue automático al VPS:

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
- **Text to Speech** — Disponible
- **Generación de Shorts** — Próximamente
- **Text to Image** — Próximamente

---

## Documentación académica

Ver carpeta [`memoria/`](memoria/) para la documentación completa del TFM.

---

## Contacto

[hola@serubix.com](mailto:hola@serubix.com)
