"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface OdometerValueProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  stiffness?: number;
  damping?: number;
}

export function OdometerValue({ 
  value, 
  prefix = "", 
  suffix = "",
  className = "",
  stiffness = 250,
  damping = 50
}: OdometerValueProps) {
  const ref = useRef<HTMLSpanElement>(null);
  
  // framer-motion values
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: damping,
    stiffness: stiffness,
  });
  
  // Só anima quando entra na tela
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        // Formatação brasileira de números (ex: 1.500)
        const formatted = Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(latest);
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
