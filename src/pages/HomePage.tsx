import { ActivitiesSection } from '../components/sections/ActivitiesSection'
import { ContactSection } from '../components/sections/ContactSection'
import { EventsSection } from '../components/sections/EventsSection'
import { GallerySection } from '../components/sections/GallerySection'
import { HeroSection } from '../components/sections/HeroSection'
import { SermonsSection } from '../components/sections/SermonsSection'
import { WelcomeSection } from '../components/sections/WelcomeSection'
import { WorshipSection } from '../components/sections/WorshipSection'

export function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />
      <WelcomeSection />
      <WorshipSection />
      <EventsSection />
      <SermonsSection />
      <GallerySection />
      <ActivitiesSection />
      <ContactSection />
    </main>
  )
}

