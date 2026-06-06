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

# 18. Roadmap Inicial

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
