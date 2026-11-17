import { AboutSection } from "@/components/home/AboutSection";
import { DailyTemplates } from "@/components/home/DailyTemplates";
import { FeaturePromos } from "@/components/home/FeaturePromos";
import { HomeHero } from "@/components/home/HomeHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsSection } from "@/components/home/StatsSection";

/** Home page sections in the template's order, with PlayerMode content. */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HowItWorks />
      <AboutSection />
      <StatsSection />
      <DailyTemplates />
      <FeaturePromos />
    </>
  );
}
