import { ContactSection } from '../components/sections/ContactSection'
import { EventsSection } from '../components/sections/EventsSection'
import { GallerySection } from '../components/sections/GallerySection'
import { HeroSection } from '../components/sections/HeroSection'
import {
  HomeAcademicsFeature,
  HomeCommunityCare,
  HomeGivingCallout,
  HomeMinistryPathways,
  HomePrayerSupport,
  HomeWelcomeStory,
  HomeWorshipSchedule,
} from '../components/sections/HomeLandingSections'
import { SermonsSection } from '../components/sections/SermonsSection'

export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HeroSection />
      <HomeWelcomeStory />
      <HomeMinistryPathways />
      <HomeWorshipSchedule />
      <HomePrayerSupport />
      <HomeAcademicsFeature />
      <HomeCommunityCare />
      <EventsSection />
      <SermonsSection />
      <GallerySection />
      <HomeGivingCallout />
      <ContactSection />
    </main>
  )
}

