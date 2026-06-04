"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";
import { siteConfig } from "@/lib/siteConfig";
import { Phone, Mail, MapPin, MessageCircle, CheckCircle } from "lucide-react";
import { FacebookIcon, YoutubeIcon, LinkedinIcon } from "@/components/shared/SocialIcons";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  _gotcha: z.string().max(0),
});
type ContactForm = z.infer<typeof contactSchema>;

const communitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().max(20).optional(),
  message: z.string().optional(),
  _gotcha: z.string().max(0),
});
type CommunityForm = z.infer<typeof communitySchema>;

function ContactFormSection() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { setSuccess(true); reset(); }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle size={56} className="text-brand-500" />
        <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
        <p className="text-gray-500">We&apos;ll get back to you within 24 hours.</p>
        <button onClick={() => setSuccess(false)} className="text-brand-600 text-sm underline">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input {...register("_gotcha")} type="text" className="hidden" tabIndex={-1} aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField {...register("name")} label="Full Name" placeholder="Your name" error={errors.name?.message} />
        <FormField {...register("email")} type="email" label="Email" placeholder="you@email.com" error={errors.email?.message} />
      </div>
      <FormField {...register("phone")} type="tel" label="Phone" placeholder="Your phone number" error={errors.phone?.message} />
      <FormField {...register("message")} multiline label="Message" placeholder="Tell us about your project..." error={errors.message?.message} />
      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">Send Message</Button>
    </form>
  );
}

function CommunityFormSection() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CommunityForm>({
    resolver: zodResolver(communitySchema),
  });

  const onSubmit = async (data: CommunityForm) => {
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { setSuccess(true); reset(); }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle size={48} className="text-brand-500" />
        <h3 className="text-xl font-bold text-gray-900">Application Received!</h3>
        <p className="text-gray-500">We&apos;ll be in touch about joining the community.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input {...register("_gotcha")} type="text" className="hidden" tabIndex={-1} aria-hidden="true" />
      <FormField {...register("name")} label="Full Name" placeholder="Your name" error={errors.name?.message} />
      <FormField {...register("email")} type="email" label="Email" placeholder="you@email.com" error={errors.email?.message} />
      <FormField {...register("phone")} type="tel" label="Phone (optional)" placeholder="Your phone number" />
      <FormField {...register("message")} multiline rows={3} label="Why do you want to join?" placeholder="Tell us a bit about yourself..." />
      <Button type="submit" loading={isSubmitting} variant="outline" size="md" className="w-full">Apply Now</Button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 to-brand-950 py-24">
          <div className="container-wide text-center">
            <ScrollReveal>
              <span className="text-brand-400 font-semibold text-sm uppercase tracking-widest">Get in Touch</span>
              <h1 className="mt-3 text-5xl font-black text-white mb-4">Contact Us</h1>
              <p className="text-gray-300 text-xl max-w-2xl mx-auto">
                Ready to grow your brand? Drop us a line and we&apos;ll respond within 24 hours.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact section */}
        <section className="section-padding bg-white">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Info column */}
              <div className="lg:col-span-2">
                <ScrollReveal>
                  <h2 className="text-3xl font-black text-gray-900 mb-6">Let&apos;s Start a Conversation</h2>
                  <div className="flex flex-col gap-5 mb-8">
                    <a href={`tel:${siteConfig.phone}`} className="flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                        <Phone size={18} className="text-brand-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone</p>
                        <p className="text-gray-900 font-semibold">{siteConfig.phone}</p>
                      </div>
                    </a>
                    <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                        <Mail size={18} className="text-brand-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email</p>
                        <p className="text-gray-900 font-semibold">{siteConfig.email}</p>
                      </div>
                    </a>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-brand-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Location</p>
                        <p className="text-gray-900 font-semibold">Dhaka, Bangladesh</p>
                      </div>
                    </div>
                    <a href={siteConfig.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                        <MessageCircle size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">WhatsApp</p>
                        <p className="text-green-600 font-semibold">Chat with us</p>
                      </div>
                    </a>
                  </div>

                  {/* Socials */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Follow Us</p>
                    <div className="flex gap-3">
                      <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-brand-100 hover:text-brand-600 transition-colors text-gray-600">
                        <FacebookIcon size={18} />
                      </a>
                      <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-brand-100 hover:text-brand-600 transition-colors text-gray-600">
                        <YoutubeIcon size={18} />
                      </a>
                      <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-brand-100 hover:text-brand-600 transition-colors text-gray-600">
                        <LinkedinIcon size={18} />
                      </a>
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="mt-8 rounded-2xl overflow-hidden border border-gray-100 aspect-video bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Dhaka, Bangladesh</p>
                      {/* TODO: Replace with Google Maps embed */}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Form column */}
              <div className="lg:col-span-3">
                <ScrollReveal delay={0.15}>
                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                    <ContactFormSection />
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Community signup */}
        <section className="section-padding bg-brand-50">
          <div className="container-wide max-w-2xl mx-auto">
            <ScrollReveal className="text-center mb-8">
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">Community</span>
              <h2 className="mt-2 text-4xl font-black text-gray-900">Join Our Community of Marketers</h2>
              <p className="mt-3 text-gray-500">Apply now to join our exclusive network of marketing professionals, entrepreneurs, and brand builders.</p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-brand-100">
                <CommunityFormSection />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
