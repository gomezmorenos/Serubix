export interface NavItem {
  label: string
  href: string
}

export interface ServiceCard {
  id: string
  icon: string
  title: string
  description: string
}

export interface SaasProduct {
  id: string
  icon: string
  title: string
  description: string
  badge: string
  badgeVariant: 'available' | 'beta' | 'soon'
}

export interface ProblemCard {
  id: string
  icon: string
  title: string
  description: string
}

export interface ProcessStep {
  step: number
  title: string
  description: string
}

export interface Benefit {
  id: string
  metric: string
  unit: string
  label: string
  description: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface LandingContent {
  nav: {
    brand: string
    items: NavItem[]
    cta: string
  }
  hero: {
    badge: string
    title: string
    subtitle: string
    primaryCTA: string
    secondaryCTA: string
    trustNote: string
  }
  problem: {
    label: string
    title: string
    subtitle: string
    cards: ProblemCard[]
  }
  solution: {
    label: string
    title: string
    subtitle: string
    points: string[]
  }
  services: {
    label: string
    title: string
    subtitle: string
    custom: {
      label: string
      subtitle: string
      cards: ServiceCard[]
    }
    saas: {
      label: string
      subtitle: string
      products: SaasProduct[]
    }
  }
  process: {
    label: string
    title: string
    subtitle: string
    steps: ProcessStep[]
  }
  benefits: {
    label: string
    title: string
    subtitle: string
    items: Benefit[]
  }
  productPreview: {
    label: string
    title: string
    subtitle: string
  }
  finalCTA: {
    title: string
    subtitle: string
    primaryCTA: string
    note: string
    contact: string
  }
  footer: {
    brand: string
    tagline: string
    links: FooterLink[]
    contact: string
    copyright: string
  }
}
