import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Target, Eye, Lightbulb, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Siren Communication — a 10+ year veteran in advertising, branding, and digital marketing in Bangladesh.",
};

const values = [
  { icon: Target, title: "Purpose-Driven", desc: "Every campaign is tied to measurable business outcomes." },
  { icon: Eye, title: "Brand Vision", desc: "We see your brand's potential before it's realized." },
  { icon: Lightbulb, title: "Creative Excellence", desc: "Bold ideas backed by strategic thinking." },
  { icon: TrendingUp, title: "Growth Mindset", desc: "Data informs every decision we make." },
];

export default async function AboutPage() {
  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 to-brand-950 py-24 lg:py-32">
          <div className="container-wide text-center">
            <ScrollReveal>
              <span className="text-brand-400 font-semibold text-sm uppercase tracking-widest">Our Story</span>
              <h1 className="mt-3 text-5xl lg:text-6xl font-black text-white mb-6">
                About Siren Communication
              </h1>
              <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
                A decade-plus of bridging brands and audiences through creativity, strategy, and measurable results.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding bg-white">
          <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
                  alt="Siren Communication office"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">Our Journey</span>
              <h2 className="mt-2 text-4xl font-black text-gray-900 mb-5">
                Built on Craft, Grown on Results
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Siren Communication was founded on a simple belief: great marketing should tell stories that
                  resonate and strategies that convert. Over 10 years, we&apos;ve grown from a boutique agency
                  into a full-service powerhouse serving brands across Bangladesh and beyond.
                </p>
                <p>
                  Our mission is to bridge the gap between brands and their audiences — creating meaningful
                  connections that translate into sustainable growth. We blend creativity with data to build
                  campaigns that don&apos;t just look good; they perform.
                </p>
                <p>
                  From startups finding their voice to established corporations reinventing their presence,
                  we bring the same passion and precision to every engagement.
                </p>
              </div>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors">
                Work With Us <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-gray-50">
          <div className="container-wide">
            <ScrollReveal className="text-center mb-14">
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">Our Values</span>
              <h2 className="mt-2 text-4xl font-black text-gray-900">What Drives Us</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <ScrollReveal key={v.title} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 text-center">
                    <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                      <v.icon size={26} className="text-brand-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section-padding bg-white">
          <div className="container-wide">
            <ScrollReveal className="text-center mb-14">
              <h2 className="text-4xl font-black text-gray-900">By the Numbers</h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <ScrollReveal key={stat.id}>
                  <AnimatedCounter value={stat.value} label={stat.label} className="text-center" />
                </ScrollReveal>
              ))}
              <ScrollReveal><AnimatedCounter value="10+" label="Years Experience" className="text-center" /></ScrollReveal>
              <ScrollReveal><AnimatedCounter value="6" label="Service Areas" className="text-center" /></ScrollReveal>
              <ScrollReveal><AnimatedCounter value="100%" label="Commitment" className="text-center" /></ScrollReveal>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-gray-50">
          <div className="container-wide text-center">
            <ScrollReveal>
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">The Team</span>
              <h2 className="mt-2 text-4xl font-black text-gray-900 mb-4">Meet the Strategists</h2>
              <p className="text-gray-500 max-w-2xl mx-auto mb-12">
                Our diverse team of marketers, creatives, and technologists work in lockstep to deliver excellence.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {["Creative Director", "Strategy Lead", "Digital Lead"].map((role, i) => (
                <ScrollReveal key={role} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                      <span className="text-brand-600 font-bold text-2xl">S</span>
                    </div>
                    <p className="font-bold text-gray-900">Siren Team</p>
                    <p className="text-brand-600 text-sm mt-1">{role}</p>
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
