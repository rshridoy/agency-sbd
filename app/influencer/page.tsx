import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { DiscoveryCallForm } from "@/components/home/DiscoveryCallForm";
import { CheckCircle2, Star, TrendingUp, Users, Mic2, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Influencer Marketing & PR",
  description: "Connect with key influencers and execute strategic PR campaigns to strengthen your brand's credibility.",
};

const offerings = [
  {
    icon: Users,
    title: "Influencer Discovery & Vetting",
    desc: "We identify influencers whose audience matches your target market — verified for authenticity and engagement quality.",
  },
  {
    icon: Star,
    title: "Campaign Strategy & Execution",
    desc: "End-to-end campaign management from brief to live, ensuring brand message consistency across every touchpoint.",
  },
  {
    icon: Mic2,
    title: "Media Relations & PR",
    desc: "Strategic press outreach, media kits, and brand spokesperson management to shape public perception.",
  },
  {
    icon: TrendingUp,
    title: "Performance Reporting",
    desc: "Detailed analytics on reach, impressions, engagement, and conversions — so you see the real ROI.",
  },
  {
    icon: Globe,
    title: "Brand Ambassador Programs",
    desc: "Build long-term relationships with creators who become genuine advocates for your brand.",
  },
];

const benefits = [
  "Access to curated network of 500+ local & international influencers",
  "Nano, micro, and macro influencer options for every budget",
  "Full campaign brief, contract, and content review",
  "Crisis PR support & reputation management",
  "Live reporting dashboard during campaigns",
];

export default function InfluencerPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-brand-950 to-gray-900 py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
          />
          <div className="relative container-wide grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <span className="text-brand-400 font-semibold text-sm uppercase tracking-widest">Influencer Marketing & PR</span>
              <h1 className="mt-3 text-5xl lg:text-6xl font-black text-white mb-6 text-balance">
                Amplify Your Brand Through Authentic Voices
              </h1>
              <p className="text-gray-300 text-xl leading-relaxed mb-8">
                We connect your brand with the right influencers and execute strategic PR campaigns that build
                credibility, drive awareness, and convert audiences into customers.
              </p>
              <ul className="flex flex-col gap-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 size={18} className="text-brand-400 mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <DiscoveryCallForm
                  source="INFLUENCER"
                  title="Start Your Influencer Campaign"
                  subtitle="Tell us your goal and we'll match you with the perfect creators."
                  dark
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Offerings */}
        <section className="section-padding bg-white">
          <div className="container-wide">
            <ScrollReveal className="text-center mb-14">
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
              <h2 className="mt-2 text-4xl font-black text-gray-900">Full-Spectrum Influencer Services</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerings.map((o, i) => (
                <ScrollReveal key={o.title} delay={i * 0.08}>
                  <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                      <o.icon size={22} className="text-brand-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{o.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{o.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-gray-50">
          <div className="container-wide">
            <ScrollReveal className="text-center mb-14">
              <h2 className="text-4xl font-black text-gray-900">How It Works</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {["Define Goals", "Match Creators", "Execute Campaign", "Measure & Report"].map((step, i) => (
                <ScrollReveal key={step} delay={i * 0.1}>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-brand-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-200">
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-gray-900">{step}</h3>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
