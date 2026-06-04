"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { FormField } from "@/components/shared/FormField";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Enter a valid phone number"),
  _gotcha: z.string().max(0),
});
type FormValues = z.infer<typeof schema>;

interface DiscoveryCallFormProps {
  source?: "HOME_DISCOVERY" | "HOME_CALLBACK" | "INFLUENCER";
  title?: string;
  subtitle?: string;
  dark?: boolean;
}

export function DiscoveryCallForm({
  source = "HOME_DISCOVERY",
  title = "Book a Discovery Call",
  subtitle = "Leave your contact here, we will knock you.",
  dark = false,
}: DiscoveryCallFormProps) {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source }),
    });
    if (res.ok) {
      setSuccess(true);
      reset();
    }
  };

  const labelClass = dark ? "text-white" : "text-gray-900";
  const subClass = dark ? "text-gray-300" : "text-gray-600";

  if (success) {
    return (
      <ScrollReveal className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle size={48} className="text-brand-500" />
        <h3 className={`text-xl font-bold ${labelClass}`}>Thank you!</h3>
        <p className={subClass}>We'll be in touch shortly.</p>
        <button onClick={() => setSuccess(false)} className="text-brand-500 text-sm underline mt-1">
          Submit another
        </button>
      </ScrollReveal>
    );
  }

  return (
    <div>
      <h3 className={`text-2xl font-bold mb-1 ${labelClass}`}>{title}</h3>
      <p className={`text-sm mb-5 ${subClass}`}>{subtitle}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Honeypot */}
        <input {...register("_gotcha")} type="text" className="hidden" tabIndex={-1} aria-hidden="true" />

        <FormField
          {...register("name")}
          placeholder="Your Name"
          error={errors.name?.message}
          className={dark ? "bg-white/10 border-white/20 text-white placeholder-white/40" : ""}
        />
        <div className="relative">
          <FormField
            {...register("phone")}
            type="tel"
            placeholder="Your Phone Number"
            error={errors.phone?.message}
            className={dark ? "bg-white/10 border-white/20 text-white placeholder-white/40 pl-10" : "pl-10"}
          />
          <Phone size={16} className={`absolute left-3 top-3.5 ${dark ? "text-white/40" : "text-gray-400"}`} />
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Let&apos;s Connect
        </Button>
      </form>
    </div>
  );
}
