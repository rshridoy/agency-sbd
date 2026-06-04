"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/influencer", label: "Influencer" },
  { href: "/blog", label: "Siren Buzz" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:bg-brand-700 transition-colors">
            S
          </div>
          <span className={cn("font-bold text-xl transition-colors", scrolled ? "text-gray-900" : "text-white")}>
            Siren
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-500",
                scrolled ? "text-gray-700" : "text-white/90"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${siteConfig.phone}`}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-500",
              scrolled ? "text-gray-700" : "text-white/90"
            )}
          >
            <Phone size={16} />
            {siteConfig.phone}
          </a>
          <Link
            href="/contact"
            className="bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
          >
            Get Proposal
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn("lg:hidden p-2 rounded-lg", scrolled ? "text-gray-900" : "text-white")}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container-wide py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-2 flex flex-col gap-3">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-2 px-4 py-2 text-gray-700"
              >
                <Phone size={16} className="text-brand-600" />
                {siteConfig.phone}
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="bg-brand-600 text-white text-center font-semibold px-5 py-3 rounded-lg hover:bg-brand-700 transition-colors"
              >
                Get Proposal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
