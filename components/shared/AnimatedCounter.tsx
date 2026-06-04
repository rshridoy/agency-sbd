"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  label: string;
  className?: string;
}

export function AnimatedCounter({ value, label, className }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const match = value.match(/(\d+)(.*)/);
    if (!match) {
      setDisplayed(value);
      return;
    }

    const target = parseInt(match[1]);
    const suffix = match[2] || "";
    const duration = 1500;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      setDisplayed(current + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <div ref={ref} className={className}>
      <div className="text-5xl font-bold text-brand-600">{displayed}</div>
      <div className="mt-2 text-gray-600 font-medium">{label}</div>
    </div>
  );
}
