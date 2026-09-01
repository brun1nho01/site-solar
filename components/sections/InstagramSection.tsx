"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowSquareOut, Play, X, SpeakerHigh as Volume2, SpeakerX as VolumeX } from "@phosphor-icons/react";
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
    poster: "/images/video_bateria.mp4#t=0.001",
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
    poster: "/images/video_instalacao.mp4#t=0.001",
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

const VideoPlayer = ({ src, poster }: { src: string, poster?: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      ref.current?.play().catch(() => { });
    } else {
      ref.current?.pause();
    }
  }, [isInView]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
};

// === MODAL ESTILO REELS/TIKTOK ===
const VideoModal = ({ post, onClose }: { post: InstagramPost, onClose: () => void }) => {
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Autofocus no botão de fechar para leitores de tela
    closeBtnRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Visualizar post do Instagram"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-0"
      onClick={onClose}
    >
      <button
        ref={closeBtnRef}
        onClick={onClose}
        aria-label="Fechar modal"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gold-400 z-50 bg-white/10 p-3 rounded-full backdrop-blur-md transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[400px] aspect-[9/16] bg-navy-950 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
      >
        {/* Media Element */}
        {post.isVideo ? (
          <video
            ref={videoRef}
            src={post.image}
            poster={post.poster}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => {
              if (videoRef.current?.paused) videoRef.current.play();
              else videoRef.current?.pause();
            }}
          />
        ) : (
          <Image src={post.image} alt={post.alt} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
        )}

        {/* Mute Toggle */}
        {post.isVideo && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Ativar som" : "Desativar som"}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white/20 transition-colors z-20"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}

        {/* Overlay UI Bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-24 pointer-events-none z-10">
          <div className="flex items-end justify-between gap-4 pointer-events-auto">
            {/* Left Info */}
            <div className="text-white pr-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-full bg-navy-800 border border-gold-400 overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-gold-400 to-gold-600" />
                </div>
                <span className="font-bold text-sm tracking-wide">@wlimasolucoes</span>
              </div>
            </div>

            <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-white/25">
              Ver publicação <ArrowSquareOut className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function InstagramSection() {
  const [activePost, setActivePost] = useState<InstagramPost | null>(null);

  return (
    <section className="relative py-24 overflow-hidden border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Central de Telemetria Híbrida Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-950 dark:text-white mb-4">
              Projetos e bastidores da <span className="text-gold-500 dark:text-gold-400">W. Lima.</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group relative rounded-2xl overflow-hidden aspect-square glass cursor-pointer"
            >
              {/* Imagem ou Vídeo de Fundo */}
              {post.isVideo ? (
                <VideoPlayer src={post.image} />
              ) : (
                <Image
                  src={post.image}
                  alt="Instagram post"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}

              {/* Ícone de Vídeo persistente no canto (estilo Reels) */}
              {post.isVideo && (
                <div className="absolute top-4 right-4 z-10 drop-shadow-md">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              )}

              <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center z-10 pointer-events-none">
                <span className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">Abrir mídia</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal Reels-Style */}
      <AnimatePresence>
        {activePost && (
          <VideoModal post={activePost} onClose={() => setActivePost(null)} />
        )}
      </AnimatePresence>

    </section>
  );
}
