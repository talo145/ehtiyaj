import { Hero } from "@/components/home/Hero";
import { AboutFlow } from "@/components/home/AboutFlow";
import { NeedsMapSection } from "@/components/home/NeedsMapSection";
import { AssociationsSection } from "@/components/home/AssociationsSection";
import { InitiativesSection } from "@/components/home/InitiativesSection";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutFlow />
      <NeedsMapSection />
      <AssociationsSection />
      <InitiativesSection />
      <FinalCta />
    </>
  );
}
