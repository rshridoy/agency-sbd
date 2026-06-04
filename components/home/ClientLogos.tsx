import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { prisma } from "@/lib/db";

export async function ClientLogos() {
  const logos = await prisma.clientLogo.findMany({ orderBy: { order: "asc" } });

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="container-wide">
        <ScrollReveal className="text-center mb-10">
          <p className="text-gray-500 font-medium text-sm uppercase tracking-widest">
            A Few of the Companies We&apos;ve Helped Grow
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {logos.map((logo) => (
              <a
                key={logo.id}
                href={logo.websiteUrl || "#"}
                target={logo.websiteUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group"
              >
                <div className="h-12 w-28 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <img
                    src={logo.imageUrl}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
