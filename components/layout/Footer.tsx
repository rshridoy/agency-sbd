import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { FacebookIcon, YoutubeIcon, LinkedinIcon, WhatsappIcon } from "@/components/shared/SocialIcons";
import { siteConfig } from "@/lib/siteConfig";

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/blog", label: "Siren Buzz" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services#360-marketing", label: "360° Marketing & Branding" },
  { href: "/services#social-media", label: "Social Media & Ads" },
  { href: "/services#video-production", label: "Video Production" },
  { href: "/influencer", label: "Influencer Marketing" },
  { href: "/services#ecommerce", label: "E-commerce Solutions" },
  { href: "/services#b2b", label: "B2B & Corporate" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="font-bold text-xl text-white">Siren Communication</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Empowering brands and elevating growth through creativity, strategy, and data-driven marketing.
            </p>
            <div className="flex gap-3">
              <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-brand-600 transition-colors">
                <FacebookIcon size={16} />
              </a>
              <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-brand-600 transition-colors">
                <YoutubeIcon size={16} />
              </a>
              <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-brand-600 transition-colors">
                <LinkedinIcon size={16} />
              </a>
              <a href={siteConfig.socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-brand-600 transition-colors">
                <WhatsappIcon size={16} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="flex flex-col gap-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href={`tel:${siteConfig.phone}`} className="flex items-start gap-2 text-sm hover:text-brand-400 transition-colors">
                  <Phone size={15} className="mt-0.5 shrink-0 text-brand-500" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-2 text-sm hover:text-brand-400 transition-colors">
                  <Mail size={15} className="mt-0.5 shrink-0 text-brand-500" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2 text-sm">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-brand-500" />
                  Dhaka, Bangladesh
                </span>
              </li>
              <li>
                <a href={siteConfig.socials.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                  <MessageCircle size={15} />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>Siren Communication © {new Date().getFullYear()}. All rights reserved.</p>
          <Link href="/admin" className="hover:text-gray-400 transition-colors text-xs">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
