import Image from "next/image";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { prisma } from "@/lib/db";
import { CheckCircle2 } from "lucide-react";

export async function WhoWeAre() {
  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });

  const features = [
    "Data-driven strategies that deliver measurable ROI",
    "Creative storytelling that captivates your audience",
    "End-to-end campaign management",
    "10+ years of market expertise in Bangladesh",
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                  alt="Siren Communication team at work"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="text-4xl font-black text-brand-600">10+</div>
                <div className="text-sm font-medium text-gray-600 mt-1">Years of Excellence</div>
              </div>
            </div>
          </ScrollReveal>

          {/* Content side */}
          <ScrollReveal direction="right">
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">Who We Are</span>
            <h2 className="mt-2 text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Where Creativity Meets Strategy
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              Siren Communication blends the art of storytelling with the science of data to build brands
              that stand out and campaigns that drive real results. We bridge brands and audiences through
              measurable ROI-focused marketing.
            </p>

            <ul className="flex flex-col gap-3 mb-10">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-brand-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              {stats.map((stat) => (
                <AnimatedCounter key={stat.id} value={stat.value} label={stat.label} />
              ))}
              <AnimatedCounter value="10+" label="Years Experience" />
              <AnimatedCounter value="6" label="Service Areas" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
