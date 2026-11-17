import { HomeHero } from "@/components/home/HomeHero";
import { HowItWorks } from "@/components/home/HowItWorks";

/** Home page sections in the template's order, with PlayerMode content. */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HowItWorks />
    </>
  );
}
