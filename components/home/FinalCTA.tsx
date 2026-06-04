import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { DiscoveryCallForm } from "./DiscoveryCallForm";

export function FinalCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative container-wide">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                Ready To Transform Your Business Marketing?
              </h2>
              <p className="text-brand-100 text-lg leading-relaxed">
                Join 20+ companies that trust Siren Communication to grow their brand, acquire customers,
                and dominate their market.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <DiscoveryCallForm
                  source="HOME_CALLBACK"
                  title="Leave Your Number, We Will Call You"
                  subtitle="Our team responds within 24 hours."
                  dark
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
