import Link from "next/link";
import { ArrowRight, Megaphone, BarChart2, Video, Users, ShoppingCart, Building2 } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { prisma } from "@/lib/db";

const iconMap: Record<string, React.ElementType> = {
  Megaphone,
  BarChart2,
  Video,
  Users,
  ShoppingCart,
  Building2,
};

export async function ServicesGrid() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <section className="section-padding bg-white" id="services">
      <div className="container-wide">
        <ScrollReveal className="text-center mb-14">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">What We Do</span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-black text-gray-900">Our Services</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            End-to-end marketing solutions tailored to grow your brand, acquire customers, and dominate your market.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Megaphone;
            return (
              <ScrollReveal key={service.id} delay={i * 0.08}>
                <div className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:border-brand-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
                    <Icon size={26} className="text-brand-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{service.description}</p>
                  <Link
                    href="/services"
                    className="mt-5 inline-flex items-center gap-1.5 text-brand-600 font-semibold text-sm group-hover:gap-2.5 transition-all"
                  >
                    Learn More <ArrowRight size={15} />
                  </Link>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-brand-700 transition-colors shadow-md"
          >
            View All Services <ArrowRight size={18} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
