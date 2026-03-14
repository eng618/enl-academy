import { SiteFooter } from '@/components/site/footer';
import { SiteHeader } from '@/components/site/header';
import {
  FaithStatement,
  HeroSection,
  LearningAreasSection,
  ResourcesSection,
  RhythmSection,
  ValueGrid,
} from '@/components/site/home-sections';
export default function Home() {
  return (
    <div className="text-foreground min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-10 sm:gap-16 sm:px-6 sm:py-12 lg:px-8">
        <HeroSection />
        <ValueGrid />
        <FaithStatement />
        <LearningAreasSection />
        <RhythmSection />
        <ResourcesSection />
      </main>
      <SiteFooter />
    </div>
  );
}
