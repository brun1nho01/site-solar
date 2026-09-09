"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowSquareOut,
  Pause,
  Play,
  SpeakerHigh as Volume2,
  SpeakerX as VolumeX,
  X,
} from "@phosphor-icons/react";
import Image from "next/image";

interface InstagramPost {
  id: number;
  image: string;
  alt: string;
  isVideo: boolean;
  link: string;
  poster?: string;
}

const GALLERY_ITEMS: InstagramPost[] = [
  {
    id: 1,
    image: "/images/video_bateria.mp4",
    poster: "/images/video-bateria-poster.webp",
    alt: "Vídeo mostrando a bateria instalada",
    isVideo: true,
    link: "https://www.instagram.com/p/DUWLdXkEShG/",
  },
  {
    id: 2,
    image: "/images/post_2.jpg",
    alt: "Painel solar instalado com vista do telhado",
    isVideo: false,
    link: "https://www.instagram.com/p/DWplIfXDCFc/?img_index=1",
  },
  {
    id: 3,
    image: "/images/video_instalacao.mp4",
    poster: "/images/video-instalacao-poster.webp",
    alt: "Instalação da estrutura de painéis solares",
    isVideo: true,
    link: "https://www.instagram.com/p/DUsvUCEkWfE/",
  },
  {
    id: 4,
    image: "/images/post_1.jpg",
    alt: "Cliente feliz com seu novo sistema solar",
    isVideo: false,
    link: "https://www.instagram.com/p/DSBjov0jOzs/?img_index=1",
  },
];

const VideoPlayer = ({ src, poster }: { src: string; poster?: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (isInView && !shouldReduceMotion) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isInView, shouldReduceMotion]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const VideoModal = ({ post, onClose }: { post: InstagramPost; onClose: () => void }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstElement || !dialog.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (activeElement === lastElement || !dialog.contains(activeElement))) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (shouldReduceMotion) {
      videoRef.current?.pause();
    }
  }, [shouldReduceMotion]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
      className="media-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Visualizar: ${post.alt}`}
        tabIndex={-1}
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: shouldReduceMotion ? 0 : 20 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.24 }}
        onClick={(event) => event.stopPropagation()}
        className="media-dialog group relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-navy-950 shadow-2xl outline-none sm:rounded-3xl"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar mídia"
          className="absolute left-4 top-4 z-30 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/45 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20 hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        {post.isVideo ? (
          <video
            ref={videoRef}
            src={post.image}
            poster={post.poster}
            autoPlay={!shouldReduceMotion}
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image src={post.image} alt={post.alt} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
        )}

        {post.isVideo && (
          <div className="absolute right-4 top-4 z-30 flex gap-2">
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/45 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              {isPlaying ? (
                <Pause aria-hidden="true" className="h-5 w-5" weight="fill" />
              ) : (
                <Play aria-hidden="true" className="h-5 w-5" weight="fill" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsMuted((currentValue) => !currentValue)}
              aria-label={isMuted ? "Ativar som" : "Desativar som"}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/45 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              {isMuted ? (
                <VolumeX aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Volume2 aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-24">
          <div className="pointer-events-auto flex items-end justify-between gap-4">
            <div className="pr-4 text-white">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gold-400 bg-navy-800">
                  <div className="h-full w-full bg-gradient-to-br from-gold-400 to-gold-600" />
                </div>
                <span className="text-sm font-bold tracking-wide">@wlimasolucoes</span>
              </div>
            </div>

            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              Ver publicação <ArrowSquareOut aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function InstagramSection() {
  const [activePost, setActivePost] = useState<InstagramPost | null>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handleOpenPost = (post: InstagramPost, trigger: HTMLButtonElement) => {
    activeTriggerRef.current = trigger;
    setActivePost(post);
  };

  const handleClosePost = useCallback(() => {
    setActivePost(null);
  }, []);

  const handleModalExitComplete = () => {
    const trigger = activeTriggerRef.current;
    activeTriggerRef.current = null;

    window.requestAnimationFrame(() => trigger?.focus());
  };

  return (
    <section className="relative py-24 overflow-hidden border-t border-border-subtle">
      <div className="safe-inline max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Central de Telemetria Híbrida Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-950 dark:text-white mb-4">
              Projetos e bastidores da <span className="text-accent-copy">W. Lima.</span>
            </h2>
            <p className="text-navy-600 dark:text-text-secondary mt-3 max-w-xl text-lg">
              Acompanhe conteúdos sobre energia solar, equipamentos, etapas de instalação e o dia a dia da equipe.
            </p>
          </div>

          <a
            href="https://www.instagram.com/wlimasolucoes/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/60 dark:bg-[#0a0f1c]/60 backdrop-blur-md hover:bg-white dark:hover:bg-[#0a0f1c] border border-navy-900/10 dark:border-white/10 transition-all font-bold text-navy-950 dark:text-white whitespace-nowrap shadow-sm hover:shadow-[0_0_20px_rgba(242,205,66,0.15)] hover:border-gold-500/30"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#insta-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 transition-transform group-hover:scale-110"
            >
              <defs>
                <linearGradient id="insta-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#833ab4" />
                  <stop offset="50%" stopColor="#fd1d1d" />
                  <stop offset="100%" stopColor="#fcb045" />
                </linearGradient>
              </defs>
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span className="relative z-10 font-mono text-sm tracking-wide">@wlimasolucoes</span>
          </a>
        </div>

        {/* Grid de Posts */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {GALLERY_ITEMS.map((post) => (
            <button
              key={post.id}
              type="button"
              aria-haspopup="dialog"
              aria-label={`Abrir mídia: ${post.alt}`}
              onClick={(event) => handleOpenPost(post, event.currentTarget)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleOpenPost(post, event.currentTarget);
                }
              }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl text-left shadow-sm outline-none ring-offset-4 ring-offset-white transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-focus-ring dark:ring-offset-navy-950"
            >
              {/* Imagem ou Vídeo de Fundo */}
              {post.isVideo ? (
                <VideoPlayer src={post.image} poster={post.poster} />
              ) : (
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}

              {/* Ícone de Vídeo persistente no canto (estilo Reels) */}
              {post.isVideo && (
                <div aria-hidden="true" className="absolute right-4 top-4 z-10 drop-shadow-md">
                  <Play className="h-6 w-6 fill-white text-white" />
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-navy-950/70 p-6 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">Abrir mídia</span>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Modal Reels-Style */}
      <AnimatePresence onExitComplete={handleModalExitComplete}>
        {activePost && (
          <VideoModal post={activePost} onClose={handleClosePost} />
        )}
      </AnimatePresence>

    </section>
  );
}
