import { AboutSection } from "@/components/home/AboutSection";
import { DailyTemplates } from "@/components/home/DailyTemplates";
import { FeaturedCreators } from "@/components/home/FeaturedCreators";
import { FeaturePromos } from "@/components/home/FeaturePromos";
import { FinalCta } from "@/components/home/FinalCta";
import { HomeHero } from "@/components/home/HomeHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsSection } from "@/components/home/StatsSection";
import { TrendingGames } from "@/components/home/TrendingGames";

/**
 * Home page sections. The template's section styles, in a games-first order: today's challenge,
 * the templates and community games come straight after the hero, then how it works and why.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <DailyTemplates />
      <TrendingGames />
      <HowItWorks />
      <AboutSection />
      <StatsSection />
      <FeaturePromos />
      <FeaturedCreators />
      <FinalCta />
    </>
  );
}
