"use client";

import { type PointerEvent, type ReactNode, useEffect, useRef } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number; // Quão forte o botão é puxado (padrão 20)
}

export default function MagneticButton({ children, className = "", strength = 15 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const handlePointerEnter = () => {
    boundsRef.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    const bounds = boundsRef.current;
    if (!element || !bounds || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const x = (event.clientX - (bounds.left + bounds.width / 2)) * (strength / 100);
    const y = (event.clientY - (bounds.top + bounds.height / 2)) * (strength / 100);

    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frameRef.current = null;
    });
  };

  const reset = () => {
    boundsRef.current = null;
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      className={`inline-block will-change-transform transition-transform duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
