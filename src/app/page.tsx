import { AboutSection } from "@/components/home/AboutSection";
import { DailyTemplates } from "@/components/home/DailyTemplates";
import { FeaturedCreators } from "@/components/home/FeaturedCreators";
import { FeaturePromos } from "@/components/home/FeaturePromos";
import { FinalCta } from "@/components/home/FinalCta";
import { HomeHero } from "@/components/home/HomeHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsSection } from "@/components/home/StatsSection";
import { TrendingGames } from "@/components/home/TrendingGames";

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
      <TrendingGames />
      <FeaturedCreators />
      <FinalCta />
    </>
  );
}
