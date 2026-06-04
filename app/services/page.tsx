import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Megaphone, BarChart2, Video, Users, ShoppingCart, Building2, CheckCircle2 } from "lucide-react";
import { DiscoveryCallForm } from "@/components/home/DiscoveryCallForm";

export const metadata: Metadata = {
  title: "Services",
  description: "Full-service marketing solutions from Siren Communication — branding, social media, video production, influencer marketing, e-commerce, and B2B strategies.",
};

const iconMap: Record<string, React.ElementType> = {
  Megaphone, BarChart2, Video, Users, ShoppingCart, Building2,
};

const serviceDetails: Record<string, { id: string; bullets: string[] }> = {
  "360° Marketing & Branding": {
    id: "360-marketing",
    bullets: [
      "Brand identity design & guidelines",
      "Market research & competitor analysis",
      "Integrated multi-channel strategies",
      "Brand positioning & messaging frameworks",
    ],
  },
  "Social Media & Ads": {
    id: "social-media",
    bullets: [
      "Organic content strategy & creation",
      "Community management",
      "Meta, Google & TikTok ad campaigns",
      "Performance analytics & reporting",
    ],
  },
  "Video Production & Photography": {
    id: "video-production",
    bullets: [
      "TVC & OVC production",
      "Corporate & product photography",
      "Social media video content",
      "Motion graphics & post-production",
    ],
  },
  "Influencer Marketing & PR": {
    id: "influencer",
    bullets: [
      "Influencer identification & vetting",
      "Campaign planning & execution",
      "Media relations & press coverage",
      "Brand ambassador programs",
    ],
  },
  "E-commerce & Startup Solutions": {
    id: "ecommerce",
    bullets: [
      "MVP consulting & roadmapping",
      "E-commerce platform setup",
      "Product listing optimization",
      "Digital launch campaigns",
    ],
  },
  "B2B & Corporate Branding": {
    id: "b2b",
    bullets: [
      "LinkedIn lead generation",
      "Corporate identity refresh",
      "Thought leadership content",
      "B2B email campaigns",
    ],
  },
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 to-brand-950 py-24">
          <div className="container-wide text-center">
            <ScrollReveal>
              <span className="text-brand-400 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
              <h1 className="mt-3 text-5xl lg:text-6xl font-black text-white mb-6">Our Services</h1>
              <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
                End-to-end solutions designed to grow your brand, acquire customers, and dominate your market.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Services */}
        <section className="section-padding bg-white">
          <div className="container-wide">
            <div className="flex flex-col gap-20">
              {services.map((service, i) => {
                const Icon = iconMap[service.icon] || Megaphone;
                const details = serviceDetails[service.title];
                const isEven = i % 2 === 0;

                return (
                  <ScrollReveal key={service.id} id={details?.id}>
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                      <div className={isEven ? "" : "lg:order-2"}>
                        <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
                          <Icon size={28} className="text-brand-600" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">{service.title}</h2>
                        <p className="text-gray-600 leading-relaxed text-lg mb-6">{service.description}</p>
                        {details && (
                          <ul className="flex flex-col gap-2 mb-8">
                            {details.bullets.map((b) => (
                              <li key={b} className="flex items-center gap-2 text-gray-700">
                                <CheckCircle2 size={16} className="text-brand-500 shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                        <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors">
                          Get Started <ArrowRight size={16} />
                        </Link>
                      </div>
                      <div className={isEven ? "" : "lg:order-1"}>
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center shadow-lg">
                          <Icon size={80} className="text-brand-300" />
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-gray-50">
          <div className="container-wide max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-500 mb-10">Book a free discovery call and let&apos;s discuss your goals.</p>
              <DiscoveryCallForm />
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
