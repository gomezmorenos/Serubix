import type { LandingContent } from './landing.types'

export const LANDING_CONTENT: LandingContent = {
  nav: {
    brand: 'Serubix',
    items: [
      { label: 'Servicios', href: '#servicios' },
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Beneficios', href: '#beneficios' },
      { label: 'Contacto', href: '#contacto' },
    ],
    cta: 'Solicitar diagnóstico',
  },
  hero: {
    badge: 'Plataforma de Automatización con IA',
    title: 'Automatiza procesos, captura más oportunidades y trabaja con inteligencia artificial.',
    subtitle:
      'Conectamos tus sistemas, automatizamos tus flujos y desplegamos asistentes IA que trabajan por ti — para que tú te centres en hacer crecer tu negocio.',
    primaryCTA: 'Solicitar diagnóstico gratuito',
    secondaryCTA: 'Ver servicios',
    trustNote:
      'Soluciones diseñadas para empresas que quieren crecer sin aumentar carga operativa.',
  },
  problem: {
    label: 'El problema',
    title: '¿Cuánto tiempo pierdes en tareas que podrían automatizarse?',
    subtitle:
      'La mayoría de las pequeñas empresas y autónomos dedican más del 40% de su tiempo a procesos manuales que frenan su crecimiento.',
    cards: [
      {
        id: 'repetitive',
        icon: '🔁',
        title: 'Tareas repetitivas sin fin',
        description:
          'Copiar datos, enviar correos manuales, actualizar hojas de cálculo. Tiempo que podrías invertir en lo que realmente importa.',
      },
      {
        id: 'leads',
        icon: '💸',
        title: 'Pérdida de oportunidades comerciales',
        description:
          'Leads que no se responden a tiempo, seguimientos que se olvidan, clientes potenciales que se enfrían.',
      },
      {
        id: 'scattered',
        icon: '🗂️',
        title: 'Datos dispersos entre herramientas',
        description:
          'CRM, email, formularios, hojas de cálculo… sin integración, sin visibilidad y sin control centralizado.',
      },
      {
        id: 'followup',
        icon: '📉',
        title: 'Sin seguimiento comercial sistemático',
        description:
          'El 80% de las ventas requieren más de 5 contactos. Sin automatización, la mayoría de empresas abandona antes del tercer intento.',
      },
      {
        id: 'errors',
        icon: '⚠️',
        title: 'Errores operativos por procesos manuales',
        description:
          'Cada tarea manual es un punto de fallo. Los errores cuestan tiempo, dinero y reputación.',
      },
      {
        id: 'scale',
        icon: '📊',
        title: 'Procesos que no escalan',
        description:
          'Lo que funciona con 10 clientes colapsa con 100. Sin automatización, el crecimiento se convierte en un cuello de botella.',
      },
    ],
  },
  solution: {
    label: 'La solución',
    title:
      'Una plataforma que conecta, automatiza y aprende para que tu negocio opere con menos esfuerzo y más resultados.',
    subtitle:
      'Combinamos automatización de procesos, inteligencia artificial y gestión inteligente de clientes en una solución adaptada a tu realidad.',
    points: [
      'Automatización de flujos de trabajo end-to-end',
      'Asistentes IA especializados en tu negocio',
      'Integración con tus herramientas actuales',
      'Gestión inteligente de leads y clientes',
      'Analítica en tiempo real de tus procesos',
    ],
  },
  services: {
    label: 'Servicios',
    title: 'Todo lo que tu negocio necesita para operar de forma inteligente',
    subtitle:
      'Soluciones modulares que puedes implementar de forma progresiva según tus necesidades.',
    cards: [
      {
        id: 'automation',
        icon: '⚡',
        title: 'Automatización de procesos',
        description:
          'Elimina las tareas repetitivas y construye flujos de trabajo automáticos que operan 24/7 sin intervención humana.',
      },
      {
        id: 'ai-assistants',
        icon: '🤖',
        title: 'Asistentes con IA',
        description:
          'Chatbots y asistentes conversacionales entrenados con el conocimiento de tu negocio para atender clientes, captar leads y resolver consultas.',
      },
      {
        id: 'integrations',
        icon: '🔗',
        title: 'Integración de herramientas',
        description:
          'Conectamos tu CRM, correo, formularios y sistemas internos para que todo fluya sin fricciones ni datos perdidos.',
      },
      {
        id: 'leads',
        icon: '🎯',
        title: 'Gestión de leads',
        description:
          'Captura, clasifica y nutre tus oportunidades comerciales de forma automática. Ningún lead vuelve a caer en el olvido.',
      },
      {
        id: 'commercial',
        icon: '📈',
        title: 'Automatización comercial',
        description:
          'Secuencias de seguimiento, propuestas automáticas y recordatorios inteligentes para que tu proceso de ventas funcione solo.',
      },
    ],
  },
  process: {
    label: 'Cómo funciona',
    title: 'Un proceso claro, de principio a fin',
    subtitle:
      'Sin tecnicismos, sin sorpresas. Así es cómo transformamos tu negocio en pocas semanas.',
    steps: [
      {
        step: 1,
        title: 'Diagnóstico',
        description:
          'Analizamos tus procesos actuales, identificamos los cuellos de botella y las oportunidades de automatización con mayor impacto.',
      },
      {
        step: 2,
        title: 'Diseño de solución',
        description:
          'Diseñamos una arquitectura de automatización adaptada a tu negocio, tus herramientas y tu presupuesto.',
      },
      {
        step: 3,
        title: 'Implementación',
        description:
          'Desarrollamos e integramos las soluciones de forma progresiva, garantizando resultados medibles desde el primer día.',
      },
      {
        step: 4,
        title: 'Optimización continua',
        description:
          'Monitorizamos, ajustamos y mejoramos continuamente para que tu sistema de automatización evolucione con tu negocio.',
      },
    ],
  },
  benefits: {
    label: 'Beneficios',
    title: 'Resultados reales, no promesas vacías',
    subtitle:
      'Las empresas que implementan automatización inteligente experimentan mejoras significativas desde el primer mes.',
    items: [
      {
        id: 'time',
        metric: '70',
        unit: '%',
        label: 'Menos tiempo en tareas manuales',
        description:
          'Recupera horas semanales para dedicarlas a lo que realmente hace crecer tu negocio.',
      },
      {
        id: 'leads',
        metric: '3x',
        unit: '',
        label: 'Más oportunidades gestionadas',
        description:
          'Captura y responde a todos los leads sin aumentar tu equipo comercial.',
      },
      {
        id: 'followup',
        metric: '90',
        unit: '%',
        label: 'Mejor seguimiento comercial',
        description:
          'Ninguna oportunidad se pierde por falta de seguimiento sistemático.',
      },
      {
        id: 'errors',
        metric: '85',
        unit: '%',
        label: 'Reducción de errores operativos',
        description:
          'Los procesos automatizados eliminan el error humano en tareas repetitivas.',
      },
      {
        id: 'scale',
        metric: '∞',
        unit: '',
        label: 'Procesos 100% escalables',
        description:
          'Tu infraestructura de automatización crece contigo sin costes adicionales proporcionales.',
      },
    ],
  },
  productPreview: {
    label: 'La plataforma',
    title: 'Una visión de lo que está por llegar',
    subtitle:
      'Dashboard centralizado con gestión de automatizaciones, asistentes IA y analítica de negocio en tiempo real.',
  },
  finalCTA: {
    title: 'Empieza a automatizar los procesos que frenan el crecimiento de tu negocio.',
    subtitle:
      'Solicita un diagnóstico gratuito y descubre exactamente qué procesos puedes automatizar esta semana.',
    primaryCTA: 'Solicitar diagnóstico gratuito',
    note: 'Sin compromisos. Sin coste. Solo resultados.',
    contact: 'hola@serubix.com',
  },
  footer: {
    brand: 'Serubix',
    tagline: 'Automatización e inteligencia artificial para empresas que quieren crecer.',
    links: [
      { label: 'Servicios', href: '#servicios' },
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Beneficios', href: '#beneficios' },
      { label: 'Contacto', href: '#contacto' },
    ],
    contact: 'hola@serubix.com',
    copyright: `© ${new Date().getFullYear()} Serubix. Todos los derechos reservados.`,
  },
}
