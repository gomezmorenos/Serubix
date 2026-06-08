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
6. [Calidad del código y testing](#6-calidad-del-código-y-testing)
7. [CI/CD y DevOps](#7-cicd-y-devops)
8. [Infraestructura y despliegue](#8-infraestructura-y-despliegue)
9. [Seguridad](#9-seguridad)
10. [Accesibilidad y SEO](#10-accesibilidad-y-seo)
11. [Principios aplicados](#11-principios-aplicados)
12. [Métricas del proyecto](#12-métricas-del-proyecto)
13. [Valor académico y profesional](#13-valor-académico-y-profesional)
14. [Roadmap y evolución futura](#14-roadmap-y-evolución-futura)
15. [Posibles preguntas del tribunal](#15-posibles-preguntas-del-tribunal)

---

## 1. Resumen ejecutivo

Serubix es una plataforma SaaS real orientada a la automatización de procesos empresariales mediante inteligencia artificial, desarrollada simultáneamente como Trabajo de Fin de Máster y como proyecto empresarial viable.

El proyecto resuelve un problema concreto: las pequeñas empresas y autónomos dedican más del 40% de su tiempo a tareas manuales repetitivas que podrían automatizarse. Serubix ofrece dos líneas de valor:

- **Servicios a medida:** automatización de procesos, asistentes IA, integración de herramientas, gestión de leads y automatización comercial adaptados a cada cliente.
- **Productos SaaS:** herramientas de IA listas para usar (Text to Speech, generación de Shorts para YouTube, Text to Image).

El proyecto demuestra competencias en arquitectura software, desarrollo fullstack profesional, integración de IA, DevOps e infraestructura de producción real.

---

## 2. Justificación del proyecto

### 2.1 Problema real que resuelve

| Problema | Impacto estimado |
|---|---|
| Tareas manuales repetitivas | +40% del tiempo operativo perdido |
| Pérdida de leads por falta de seguimiento | El 80% de ventas requieren 5+ contactos |
| Datos dispersos entre herramientas | Falta de visibilidad y control |
| Procesos que no escalan | Crecimiento bloqueado por operativa |
| Ausencia de automatización comercial | Oportunidades perdidas sistemáticamente |

### 2.2 Mercado objetivo

- Autónomos y freelancers con procesos repetitivos
- Pequeñas y medianas empresas (1-50 empleados)
- Consultoras y agencias digitales
- Negocios de servicios que gestionan clientes

### 2.3 Propuesta de valor diferencial

Serubix no es solo una herramienta de automatización genérica. Combina:

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
                    Nginx
                   (80/443)
                  ┌────┴────┐
                  │         │
              Frontend   Backend API
           (Next.js 15)  (Node.js)
                  │         │
                  └────┬────┘
                       │
                  PostgreSQL
                       │
                  n8n Workflows
                       │
                  APIs de IA
              (OpenAI / Claude)
```

### 3.2 Arquitectura del Frontend

Se ha implementado una arquitectura de **componentes con separación de contenido y presentación**:

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Layout raíz — metadatos SEO globales
│   └── page.tsx            # Composición de secciones (pure orchestration)
│
├── components/landing/     # Componentes de UI (presentación pura)
│   ├── Navbar.tsx          # Navegación sticky + comportamiento de scroll
│   ├── HeroSection.tsx     # Sección hero con CTAs
│   ├── ProblemSection.tsx  # Problemas del usuario
│   ├── SolutionSection.tsx # Propuesta de valor + diagrama de flujo
│   ├── ServicesSection.tsx # Dos bloques: a medida + SaaS
│   ├── ProcessSection.tsx  # Proceso en 4 pasos
│   ├── BenefitsSection.tsx # Métricas de beneficio
│   ├── ProductPreviewSection.tsx  # Mock del dashboard
│   ├── FinalCTASection.tsx # CTA de conversión
│   └── Footer.tsx          # Pie de página
│
├── features/landing/       # Lógica de dominio de la landing
│   ├── landing-content.ts  # Fuente única de verdad del contenido
│   └── landing.types.ts    # Contratos TypeScript
│
└── test/                   # Suite de tests completa
    ├── unit/               # Tests unitarios de datos
    ├── components/         # Tests de componentes aislados
    └── integration/        # Tests de página completa
```

**Decisión clave:** todo el contenido está centralizado en `landing-content.ts`. Ningún componente tiene texto hardcodeado. Esto permite:
- Cambios de contenido sin tocar componentes
- Tests de datos independientes de la UI
- Escalabilidad hacia un CMS en el futuro

### 3.3 Patrón de comunicación entre servicios

```
Browser → Nginx → Next.js (/:path)
Browser → Nginx → Backend API (/api/:path)
Backend → n8n webhook (autenticado con HMAC)
n8n → APIs externas (OpenAI, Claude, ElevenLabs)
n8n → Backend callback (resultado de la ejecución)
```

### 3.4 Estrategia de datos

- **PostgreSQL** como base de datos principal (relacional, ACID, fiable)
- **Prisma ORM** para type-safety en las consultas y migraciones versionadas
- **Docker Volumes** para almacenamiento persistente de archivos generados
- **Variables de entorno** para todos los secretos (nunca en código)

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

**App Router vs Pages Router:** se eligió App Router (introducido en Next.js 13, estabilizado en 14-15) porque es el estándar actual del framework, permite Server Components para reducir JavaScript en cliente y tiene mejor soporte para streaming y layouts anidados.

**`output: standalone`:** configurado para generar una imagen Docker mínima que solo incluye los ficheros necesarios para producción, sin `node_modules` completos.

### 4.2 TypeScript

TypeScript no es opcional en un proyecto profesional. Sus beneficios en este proyecto:

- **Contratos explícitos:** todos los props de componentes están tipados mediante interfaces (`LandingContent`, `ServiceCard`, `SaasProduct`, etc.)
- **Refactoring seguro:** cambiar el tipo `SaasProduct` rompe la compilación si algún componente o test no está actualizado
- **Autocompletado en IDE:** acelera el desarrollo y reduce errores
- **Documentación viva:** los tipos son documentación que nunca queda desactualizada

### 4.3 TailwindCSS

**Por qué Tailwind y no CSS Modules o Styled Components:**

- **Utility-first:** elimina la fricción de nombrar clases CSS
- **Design system implícito:** escala de espaciado, colores y tipografía consistentes
- **Sin CSS muerto:** solo genera las clases utilizadas (purge automático)
- **Colocación:** estilos junto al markup, sin cambiar de fichero
- **Responsivo:** breakpoints `sm:`, `md:`, `lg:` directamente en el JSX

### 4.4 Vitest + React Testing Library

**Por qué Vitest y no Jest:**

| Criterio | Jest | Vitest |
|---|---|---|
| Velocidad | ~3-5s arranque | <1s arranque |
| Compatibilidad ESM | Requiere config | Nativa |
| Integración Vite/Next | Configuración extra | Plug & play |
| API | Similar | Idéntica a Jest |
| Coverage | v8 o Istanbul | v8 nativo |

**Filosofía de testing aplicada (Testing Library):**
> "Cuanto más se parezcan tus tests a cómo usa el software el usuario real, más confianza te darán."

Los tests no prueban implementación interna (clases CSS, estructura del DOM) sino **comportamiento observable**: textos, roles ARIA, hrefs, interacciones.

### 4.5 Docker + Docker Compose

**Arquitectura de contenedores:**

- **Multi-stage build** en el Dockerfile de Next.js: 3 etapas (deps → builder → runner) para minimizar el tamaño de la imagen final
- **Usuario no root** (`nextjs:nodejs`) en el contenedor de producción — buena práctica de seguridad
- **Red interna Docker** (`serubix` bridge): los servicios no exponen puertos al exterior directamente, todo pasa por Nginx
- **Portainer** para gestión visual del VPS sin necesidad de acceso SSH continuo

### 4.6 GitHub Actions

**Estrategia de pipelines:**

```
ci.yml          → tests en cada PR y push a main
deploy.yml      → build + push GHCR + deploy VPS (manual hasta configurar)
```

**Filtro `paths`:** los workflows solo se disparan cuando hay cambios en ficheros relevantes. Un cambio solo en `memoria/` no ejecuta tests de frontend.

**GHCR (GitHub Container Registry):** se eligió frente a Docker Hub porque:
- Integrado con el repositorio de GitHub
- `GITHUB_TOKEN` automático — sin gestionar credenciales adicionales
- Imágenes privadas incluidas en el plan gratuito
- Tags por SHA de commit para trazabilidad

### 4.7 n8n para automatizaciones IA

**Por qué n8n y no código directo:**

- Las automatizaciones IA son workflows complejos con múltiples pasos, reintentos y condiciones
- n8n permite modificar flujos sin desplegar código
- Separación de responsabilidades: la app gestiona usuarios y acceso, n8n gestiona la lógica de IA
- Reduce el acoplamiento a proveedores de IA (cambiar de OpenAI a Claude requiere cambiar el nodo, no la app)

---

## 5. Frontend — implementación real

### 5.1 Landing page — secciones implementadas

| Sección | Propósito | Elemento clave |
|---|---|---|
| `Navbar` | Navegación sticky | Comportamiento scroll con `useEffect` |
| `HeroSection` | Primer impacto | H1 semántico, dos CTAs diferenciados |
| `ProblemSection` | Empatía con el usuario | 6 problemas reales con iconos |
| `SolutionSection` | Propuesta de valor | Lista de beneficios + diagrama de flujo visual |
| `ServicesSection` | Oferta de servicios | **Dos bloques diferenciados: a medida y SaaS** |
| `ProcessSection` | Generar confianza | 4 pasos con numeración visual |
| `BenefitsSection` | Prueba social con métricas | Métricas visuales (70%, 3x, 90%…) |
| `ProductPreviewSection` | Visión del producto | Mock de dashboard con datos reales |
| `FinalCTASection` | Conversión | CTA principal con email de contacto |
| `Footer` | Cierre + navegación | Links, contacto, copyright |

### 5.2 Diferenciación de servicios

**Decisión de diseño clave:** la sección de servicios tiene dos bloques visualmente distintos:

- **Servicios a medida** (acento azul `#2563EB`): proyectos personalizados de automatización
- **Productos SaaS** (acento violeta `#7C3AED`): herramientas de IA empaquetadas con badges de estado

Los badges de estado (`Disponible` / `Próximamente`) comunican el estado real del producto sin generar expectativas falsas. El campo `badgeVariant` en el tipo `SaasProduct` permite cambiar el estilo de forma tipada.

### 5.3 SEO implementado

```typescript
export const metadata: Metadata = {
  title: 'Automatización e Inteligencia Artificial para Empresas | Serubix',
  description: 'Plataforma especializada en automatización de procesos...',
  openGraph: { siteName: 'Serubix', locale: 'es_ES', type: 'website' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}
```

- Headings semánticos H1 único → múltiples H2 por sección
- `aria-labelledby` en todas las secciones apuntando a su H2
- `lang="es"` en el HTML raíz
- Estructura de URL limpia

### 5.4 Accesibilidad WCAG

- **Roles ARIA implícitos:** se usan elementos semánticos (`<nav>`, `<main>`, `<footer>`, `<section>`) en lugar de `role` explícitos donde no es necesario
- **`aria-label`** en navegaciones, listas y elementos decorativos
- **`aria-hidden="true"`** en emojis e iconos decorativos
- **`aria-labelledby`** vinculando secciones a sus títulos
- **Focus visible** en todos los elementos interactivos (`:focus-ring`)
- **Contraste:** texto principal blanco sobre fondo `zinc-950` — ratio > 7:1

---

## 6. Calidad del código y testing

### 6.1 Métricas de testing

| Métrica | Valor |
|---|---|
| Ficheros de test | 13 |
| Tests totales | 151 |
| Tests pasando | 151 (100%) |
| Cobertura statements | 100% |
| Cobertura branches | 100% |
| Cobertura functions | 100% |
| Cobertura lines | 100% |

### 6.2 Distribución de tests por tipo

| Tipo | Ficheros | Tests | Qué valida |
|---|---|---|---|
| **Unitarios** | 1 | 36 | Integridad de datos del content |
| **Componentes** | 11 | 97 | Render, accesibilidad, comportamiento |
| **Integración** | 1 | 18 | Página completa, marca, navegación |

### 6.3 Estrategia de cobertura de Vitest

```typescript
coverage: {
  provider: 'v8',
  include: ['src/**'],          // solo código de la aplicación
  exclude: [
    'src/test/**',              // los propios tests no se miden
    'src/features/landing/landing.types.ts',  // interfaces = 0 runtime code
  ],
}
```

**Por qué se excluyen los ficheros de tipos:** las interfaces TypeScript (`interface`, `type`) no generan código JavaScript en runtime. El motor V8 no puede medir cobertura sobre código que no existe. Incluirlos siempre aparecerían al 0% sin posibilidad de cubrirlos.

### 6.4 Ejemplo de bug detectado por los tests

Durante la generación de tests se detectó un **bug real** en `FinalCTASection.tsx`: el email de contacto estaba hardcodeado como `hola@automatizaia.com` (dominio anterior). El test:

```typescript
it('el email del CTA pertenece al dominio serubix.com', () => {
  const link = screen.getByRole('link', { name: finalCTA.primaryCTA })
  expect(link).toHaveAttribute('href', expect.stringContaining('serubix.com'))
})
```

...falló, revelando el bug. Se corrigió pasando `contact` como prop desde el content centralizado, eliminando el hardcode.

### 6.5 Principios de testing aplicados

- **No testear implementación** (clases CSS, estructura interna del DOM)
- **Testear comportamiento observable** (texto visible, roles, hrefs, interacciones)
- **Tests descriptivos en español** — legibles como especificación funcional
- **Una aserción por test** siempre que sea posible
- **Fixtures reales** — los tests usan `LANDING_CONTENT` real, no mocks de datos

---

## 7. CI/CD y DevOps

### 7.1 Pipeline de tests (`ci.yml`)

```
Push/PR a main con cambios en FrontEnd/
         │
    ┌────▼────┐
    │ Checkout │
    └────┬────┘
    ┌────▼──────────────┐
    │ Setup Node.js 20  │
    │ (caché npm)       │
    └────┬──────────────┘
    ┌────▼────┐
    │ npm ci  │  instalación limpia y reproducible
    └────┬────┘
    ┌────▼──────────────┐
    │ tsc --noEmit      │  verificación de tipos
    └────┬──────────────┘
    ┌────▼──────────────┐
    │ npm run test      │  151 tests con Vitest
    └────┬──────────────┘
    ┌────▼──────────────┐
    │ npm run build     │  compilación Next.js standalone
    └───────────────────┘
```

**Dos jobs separados:** `test` y `build`. El build solo se ejecuta si los tests pasan (`needs: test`). Así se detectan errores de tipos antes de malgastar tiempo compilando.

### 7.2 Pipeline de despliegue (`deploy.yml`)

Actualmente en modo `workflow_dispatch` (manual) hasta que el VPS esté configurado.

Flujo cuando esté activo:
```
Push a main
    │
Build imagen Frontend → push a GHCR con tag :latest y :SHA
Build imagen Backend  → push a GHCR
    │
SSH al VPS (/opt/serubix/)
    │
docker compose pull
docker compose up -d --remove-orphans
docker image prune -f
```

**Ventaja de GHCR sobre Docker Hub:** el `GITHUB_TOKEN` automático elimina la necesidad de gestionar credenciales adicionales. Las imágenes quedan asociadas al repositorio y son visibles desde el mismo panel de GitHub.

### 7.3 Gestión de secretos

| Secreto | Dónde se usa | Cómo se protege |
|---|---|---|
| `VPS_SSH_KEY` | GitHub Actions → SSH | GitHub Secrets (cifrado) |
| `JWT_SECRET` | Backend | `.env` en VPS (nunca en repo) |
| `DATABASE_URL` | Backend | `.env` en VPS |
| `GITHUB_TOKEN` | GHCR login | Automático, sin exposición |

El fichero `.env` nunca se sube al repositorio. El `.env.example` documenta las variables necesarias sin valores reales.

---

## 8. Infraestructura y despliegue

### 8.1 Arquitectura Docker

```
Host VPS (Ubuntu)
└── Portainer (gestión visual)
    └── Stack: serubix
        ├── nginx:alpine          puerto 80/443 → público
        ├── serubix-frontend:latest  puerto 3000 → interno
        └── serubix-backend:latest   puerto 4000 → interno
        
Red: serubix (bridge) — los servicios se comunican por nombre
```

### 8.2 Multi-stage build del Frontend

```dockerfile
# Etapa 1: dependencias (node_modules)
FROM node:20-alpine AS deps

# Etapa 2: compilación (Next.js build)
FROM node:20-alpine AS builder

# Etapa 3: runner mínimo (solo artefactos de producción)
FROM node:20-alpine AS runner
# → imagen final ~100MB vs ~600MB sin multi-stage
```

**`output: standalone` en next.config.ts:** Next.js genera un servidor Node.js autocontenido con solo las dependencias utilizadas. La imagen final incluye únicamente `server.js` y los ficheros necesarios — sin `node_modules` completos.

### 8.3 Nginx como reverse proxy

```nginx
location /      → frontend:3000   (landing + área cliente)
location /api/  → backend:4000    (API REST)
location /_next/static/  → frontend con cache 1 año
```

**Por qué Nginx:** actúa como única puerta de entrada, permite SSL termination, gestiona el enrutamiento entre servicios y añade headers de seguridad y caché de assets estáticos.

### 8.4 Portainer

Portainer proporciona una interfaz gráfica para gestionar contenedores Docker en el VPS sin requerir acceso SSH continuo. Permite:

- Ver estado de contenedores en tiempo real
- Reiniciar servicios sin SSH
- Consultar logs de aplicación
- Gestionar volúmenes y redes
- Desplegar stacks desde docker-compose

---

## 9. Seguridad

### 9.1 Medidas implementadas

| Medida | Dónde | Cómo |
|---|---|---|
| No root en contenedores | Docker | Usuario `nextjs:nodejs` (UID 1001) |
| Secretos en variables de entorno | Toda la app | `.env` en VPS, GitHub Secrets en CI |
| `.env` excluido del repositorio | `.gitignore` | `/.env*` con excepción de `.env.example` |
| HTTPS | Nginx | Let's Encrypt (configuración pendiente) |
| Red interna Docker | Docker Compose | Los servicios no exponen puertos directamente |
| CORS | Backend | Por implementar — solo origen Serubix |

### 9.2 Medidas previstas para el área privada

- Autenticación JWT con refresh tokens
- Autorización basada en roles (Visitor / User / Admin)
- Rate limiting en endpoints de IA (costosos computacionalmente)
- Firma HMAC en webhooks de n8n (evitar ejecuciones no autorizadas)
- Sanitización de inputs antes de enviar a APIs de IA
- Logs de auditoría de ejecuciones

---

## 10. Accesibilidad y SEO

### 10.1 Implementación WCAG 2.1 nivel AA

**Estructura semántica:**
- Un único `<h1>` por página (título del hero)
- Jerarquía de headings: H1 → H2 por sección → H3 por tarjeta
- `<nav>`, `<main>`, `<footer>`, `<section>` con roles semánticos implícitos

**ARIA:**
- `aria-labelledby` en secciones apuntando a su H2 correspondiente
- `aria-label` en navegaciones secundarias y listas temáticas
- `aria-hidden="true"` en emojis, iconos decorativos y elementos visuales
- `aria-label` en el email de contacto (`"Enviar email a hola@serubix.com"`)

**Teclado:**
- Todos los elementos interactivos (links, botones) tienen `focus-ring` visible
- Orden de tabulación lógico siguiendo el flujo visual

### 10.2 SEO técnico

- **Metadata API de Next.js:** title, description, keywords, OpenGraph, Twitter Card
- **`lang="es"`** en el elemento `<html>` raíz
- **robots:** `index: true, follow: true` para indexación completa
- **Structured data:** pendiente (Schema.org para organización)

---

## 11. Principios aplicados

### 11.1 Clean Architecture

La separación entre capas es explícita:

| Capa | Contenido | Depende de |
|---|---|---|
| Presentación | `components/landing/*.tsx` | Features |
| Features | `features/landing/landing-content.ts` | Types |
| Types | `features/landing/landing.types.ts` | Nada |

Los componentes no conocen el origen de los datos. Si mañana el contenido viene de un CMS (Contentful, Sanity), solo cambia `landing-content.ts` — ningún componente se modifica.

### 11.2 SOLID aplicado al frontend

- **S (Single Responsibility):** cada componente tiene un único propósito. `ServicesSection` renderiza servicios; no sabe nada del contenido.
- **O (Open/Closed):** añadir un nuevo servicio a medida solo requiere añadir un objeto al array en `landing-content.ts`, sin modificar el componente.
- **I (Interface Segregation):** `ServiceCard` y `SaasProduct` son interfaces distintas. No se fuerza a los servicios a medida a tener `badge` y `badgeVariant`.

### 11.3 DRY (Don't Repeat Yourself)

- Todo el texto en `landing-content.ts` — un único lugar para cambios de copia
- Tipos compartidos entre componentes y tests mediante `landing.types.ts`
- Los tests importan `LANDING_CONTENT` real — no duplican datos de prueba

### 11.4 KISS (Keep It Simple, Stupid)

- No se añadieron librerías de animación (Framer Motion) — CSS puro con `transition`
- No se usó Redux ni Zustand — el estado de la landing es mínimo (`scrolled` en Navbar)
- No se implementó un sistema de temas — dark mode único bien ejecutado

---

## 12. Métricas del proyecto

### 12.1 Código

| Métrica | Valor |
|---|---|
| Componentes React | 10 |
| Líneas de código (FrontEnd/src) | ~1.200 |
| Ficheros TypeScript | 17 |
| Cobertura de tests | 100% |
| Tests totales | 151 |
| Tiempo de build | ~4.6s |
| Tamaño First Load JS | 103 kB |

### 12.2 CI/CD

| Métrica | Valor |
|---|---|
| Tiempo de pipeline de tests | ~1.8s |
| Jobs en CI | 2 (test + build) |
| Workflows configurados | 2 (ci + deploy) |

### 12.3 Calidad de código (Next.js Build)

```
Route (app)                Size    First Load JS
┌ ○ /                     820 B        103 kB
└ ○ /_not-found           996 B        103 kB
```

820 B de JavaScript específico de la landing page — extremadamente eficiente para la cantidad de contenido mostrado.

---

## 13. Valor académico y profesional

### 13.1 Competencias demostradas

| Competencia | Cómo se demuestra |
|---|---|
| Arquitectura software | Clean Architecture, separación de capas, tipos explícitos |
| Desarrollo frontend profesional | Next.js 15, App Router, componentes reutilizables |
| Testing avanzado | 151 tests, 100% cobertura, tres niveles de testing |
| DevOps | Docker multi-stage, CI/CD con GitHub Actions, GHCR |
| Seguridad | No root, secretos en env, gitignore, HTTPS previsto |
| Accesibilidad | WCAG 2.1, roles ARIA, estructura semántica |
| SEO | Metadata API, headings, OpenGraph |
| Metodología | SOLID, DRY, KISS, Clean Code |
| Integración IA | n8n, OpenAI API, Claude API (diseño) |
| Infraestructura | VPS, Docker Compose, Nginx, Portainer |

### 13.2 Proyecto real, no académico

El proyecto no es un ejercicio teórico. Es una empresa en construcción con:
- Dominio y marca propios (Serubix)
- Email corporativo (`hola@serubix.com`)
- VPS contratado
- Pipeline de despliegue a producción
- Producto SaaS con roadmap real

Esto lo diferencia de la mayoría de TFMs y demuestra iniciativa emprendedora y capacidad de llevar un proyecto técnico de principio a fin.

---

## 14. Roadmap y evolución futura

### Fase actual (completada)

- [x] Landing page profesional con identidad Serubix
- [x] Suite de tests completa (151 tests, 100% cobertura)
- [x] CI/CD con GitHub Actions
- [x] Infraestructura Docker para desarrollo y producción
- [x] Arquitectura escalable lista para backend

### Próximas fases

**Fase 2 — Backend y autenticación**
- API REST con Node.js
- PostgreSQL + Prisma
- Autenticación JWT (registro, login, refresh)
- Roles: Visitor, User, Admin

**Fase 3 — Área privada de cliente**
- Dashboard del usuario autenticado
- Gestión de perfil y plan
- Historial de ejecuciones

**Fase 4 — Integración IA**
- Text to Speech via n8n + ElevenLabs/OpenAI TTS
- Control de límites de uso por plan
- Almacenamiento de archivos generados

**Fase 5 — Productos SaaS adicionales**
- Generación de YouTube Shorts
- Text to Image

**Fase 6 — Monetización**
- Integración Stripe
- Planes Free / Pro
- Billing y facturas

---

## 15. Posibles preguntas del tribunal

### ¿Por qué Next.js y no una SPA pura?

Next.js proporciona SSR/SSG nativo que mejora el SEO, rendimiento inicial y experiencia de usuario. Para una landing page orientada a captación de leads, el SEO es crítico — una SPA renderizada en cliente no indexa correctamente en Google. Además, Next.js permite construir el backend (API routes) en el mismo proyecto, reduciendo complejidad para un solo desarrollador.

### ¿Por qué no usar un CMS para el contenido?

En la fase actual (landing page MVP) la gestión de contenido desde `landing-content.ts` es suficiente y elimina dependencias externas. La arquitectura está diseñada para que en el futuro se pueda sustituir por un CMS (Contentful, Sanity) sin tocar ningún componente — solo cambia la capa de features.

### ¿Cómo garantizas que el código es mantenible?

Tres mecanismos: tipos TypeScript (los errores se detectan en compilación), 100% de cobertura de tests (cualquier rotura se detecta antes de merge) y separación de contenido/presentación (los cambios de texto nunca rompen componentes).

### ¿Por qué Vitest y no Jest?

Vitest es compatible con la API de Jest (misma sintaxis), pero arranca en <1s frente a los 3-5s de Jest gracias a que no necesita transformar los módulos ESM. En un proyecto Next.js + TypeScript la configuración de Jest requiere varios paquetes adicionales; Vitest funciona de forma nativa.

### ¿Cómo escala la arquitectura si crece el equipo?

El monorepo con carpetas separadas (`FrontEnd/`, `Backend/`) permite que dos desarrolladores trabajen en paralelo sin conflictos. La CI verifica independientemente cada parte mediante filtros `paths`. Si el equipo crece más, el monorepo puede evolucionar a un turborepo sin cambiar la estructura de carpetas.

### ¿Por qué n8n para las automatizaciones IA y no código directo?

Las automatizaciones IA son flujos complejos con múltiples pasos, reintentos, manejo de errores y posibles cambios de proveedor. n8n permite modificar estos flujos sin tocar código de la aplicación, reduciendo el riesgo de deploy. Además, separa responsabilidades: la app Serubix gestiona usuarios y acceso, n8n gestiona la orquestación de IA. Si OpenAI cambia su API, solo se modifica el workflow de n8n.

### ¿Cuál es el modelo de negocio?

Doble modelo:
1. **B2B servicios a medida:** proyectos de automatización para empresas (ticket alto, recurrente)
2. **B2C SaaS:** suscripción mensual Free/Pro para acceso a herramientas IA (escalable)

El modelo B2B financia el desarrollo mientras el B2B SaaS escala de forma autónoma.

---

*Documentación generada para la defensa del Trabajo de Fin de Máster — Junio 2026*
