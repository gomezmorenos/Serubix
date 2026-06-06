import { LANDING_CONTENT } from '@/features/landing/landing-content'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { SolutionSection } from '@/components/landing/SolutionSection'
import { ServicesSection } from '@/components/landing/ServicesSection'
import { ProcessSection } from '@/components/landing/ProcessSection'
import { BenefitsSection } from '@/components/landing/BenefitsSection'
import { ProductPreviewSection } from '@/components/landing/ProductPreviewSection'
import { FinalCTASection } from '@/components/landing/FinalCTASection'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main>
      <Navbar {...LANDING_CONTENT.nav} />
      <HeroSection {...LANDING_CONTENT.hero} />
      <ProblemSection {...LANDING_CONTENT.problem} />
      <SolutionSection {...LANDING_CONTENT.solution} />
      <ServicesSection {...LANDING_CONTENT.services} />
      <ProcessSection {...LANDING_CONTENT.process} />
      <BenefitsSection {...LANDING_CONTENT.benefits} />
      <ProductPreviewSection {...LANDING_CONTENT.productPreview} />
      <FinalCTASection {...LANDING_CONTENT.finalCTA} />
      <Footer {...LANDING_CONTENT.footer} />
    </main>
  )
}
