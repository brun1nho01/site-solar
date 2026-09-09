"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MouseGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function MouseGlowCard({ 
  children, 
  className = "", 
  glowColor = "rgba(255, 255, 255, 0.1)", // Glow mais sutil (estilo Apple)
  ...props 
}: MouseGlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const handlePointerEnter = () => {
    boundsRef.current = cardRef.current?.getBoundingClientRect() ?? null;
    if (glowRef.current) glowRef.current.style.opacity = "1";
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const glow = glowRef.current;
    const bounds = boundsRef.current;
    if (!glow || !bounds || event.pointerType !== "mouse") return;

    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      glow.style.setProperty("--glow-x", `${x}px`);
      glow.style.setProperty("--glow-y", `${y}px`);
      frameRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    boundsRef.current = null;
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative rounded-3xl overflow-hidden bg-white/50 dark:bg-navy-900/20 backdrop-blur-md border border-navy-900/10 dark:border-white/5",
        "transition-colors duration-300",
        className
      )}
      {...props}
    >
      {/* Camada de Glow Dinâmico mais sutil */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out z-0"
        style={{
          background: `radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 40%)`,
        }}
      />
      
      {/* O conteúdo original com z-index para ficar acima do glow */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}
