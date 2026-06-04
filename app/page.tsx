import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { ClientLogos } from "@/components/home/ClientLogos";
import { BlogPreview } from "@/components/home/BlogPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { DiscoveryCallForm } from "@/components/home/DiscoveryCallForm";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Marketing & Branding Agency`,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />

        {/* Discovery call strip */}
        <section className="bg-white py-16 border-b border-gray-100">
          <div className="container-wide">
            <div className="max-w-md mx-auto lg:mx-0 lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
              <ScrollReveal>
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                  Let&apos;s Talk About Your Brand
                </h2>
                <p className="text-gray-500 text-lg">
                  Tell us who you are and where you want to go. We&apos;ll map the journey.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <DiscoveryCallForm />
              </ScrollReveal>
            </div>
          </div>
        </section>

        <ServicesGrid />
        <WhoWeAre />
        <ClientLogos />
        <BlogPreview />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
