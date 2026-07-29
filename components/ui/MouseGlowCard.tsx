"use client";

import React, { useRef, useState } from "react";
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative rounded-3xl overflow-hidden bg-white/50 dark:bg-navy-900/20 backdrop-blur-md border border-navy-900/10 dark:border-white/5",
        "transition-colors duration-300 will-change-transform",
        className
      )}
      {...props}
    >
      {/* Camada de Glow Dinâmico mais sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      
      {/* O conteúdo original com z-index para ficar acima do glow */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}
