import { StatsSection } from "@/components/sections/StatsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { MemberSection } from "@/components/sections/MemberSection";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import HeroServer from "@/components/sections/HeroServer";
import AboutServer from "@/components/sections/AboutServer";
import StatsServer from "@/components/sections/StatsServer";

export default function HomePage() {
  return (
    <>
      <HeroServer />
      <AboutServer />
      <StatsServer />
      <ServicesSection />
      <TestimonialsSection />
      <MemberSection />
      <GalleryPreview />
    </>
  );
}
