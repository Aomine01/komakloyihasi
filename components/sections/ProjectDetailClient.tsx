'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ParsedTavsif {
  ismFamiliya?: string;
  lavozim?: string;
  tugilganSana?: string;
  tugilganJoy?: string;
  yashashJoyi?: string;
  talim?: string[];
  faoliyat?: string[];
  ssudaMiqdori?: string;
  ssudaSanasi?: string;
  ssudaMaqsadi?: string;
  kelajakMaqsadi?: string;
}

function parseTavsif(desc: string | null): ParsedTavsif | null {
  if (!desc || !desc.includes('ISM_FAMILIYA:')) return null;

  const parsed: ParsedTavsif = { talim: [], faoliyat: [] };
  let currentArrayField: 'talim' | 'faoliyat' | null = null;

  const lines = desc.split('\n');
  for (const line of lines) {
    const tline = line.trim();
    if (!tline) continue;

    if (tline.startsWith('ТАЪЛИМ:')) { currentArrayField = 'talim'; continue; }
    if (tline.startsWith('ФАОЛИЯТ:')) { currentArrayField = 'faoliyat'; continue; }
    if (tline.startsWith('РАСМЛАР:')) { currentArrayField = null; continue; }

    if (tline.startsWith('-') && currentArrayField) {
      const content = tline.substring(1).trim();
      if (currentArrayField === 'talim') parsed.talim!.push(content);
      else if (currentArrayField === 'faoliyat') parsed.faoliyat!.push(content);
      continue;
    }

    const parts = tline.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();

      if (key === 'ISM_FAMILIYA') parsed.ismFamiliya = value;
      else if (key === 'LAVOZIM') parsed.lavozim = value;
      else if (key === 'TУГИЛГАН_САНА' || key === 'ТУҒИЛГАН_САНА') parsed.tugilganSana = value;
      else if (key === 'ТУҒИЛГАН_ЖОЙ') parsed.tugilganJoy = value;
      else if (key === 'ЯШАШ_ЖОЙИ') parsed.yashashJoyi = value;
      else if (key === 'SSUDA_MIQDORI') parsed.ssudaMiqdori = value;
      else if (key === 'SSUDA_SANASI') parsed.ssudaSanasi = value;
      else if (key === 'SSUDA_MAQSADI') parsed.ssudaMaqsadi = value;
      else if (key === 'КЕЛАЖАК_МАҚСАДИ') parsed.kelajakMaqsadi = value;
    }
  }

  return parsed;
}

// ── Lightbox Component ──────────────────────────────────────────────────────
interface LightboxOverlayProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
  personName: string;
}

function LightboxOverlay({
  images,
  currentIndex,
  onClose,
  onChangeIndex,
  personName,
}: LightboxOverlayProps) {
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const STEP = 0.5;
  const total = images.length;
  const currentImage = images[currentIndex];

  const zoomIn = () => setZoom((z) => Math.min(z + STEP, MAX_ZOOM));
  const zoomOut = () => setZoom((z) => Math.max(z - STEP, MIN_ZOOM));
  const resetZoom = () => setZoom(1);

  const next = useCallback(() => {
    resetZoom();
    onChangeIndex((currentIndex + 1) % total);
  }, [currentIndex, total, onChangeIndex]);

  const prev = useCallback(() => {
    resetZoom();
    onChangeIndex((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onChangeIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') resetZoom();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, next, prev, zoom]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Bar controls */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10 bg-gradient-to-b from-black/60 to-transparent">
        <span className="text-white/80 text-sm font-medium truncate max-w-[60%]">
          {personName} — rasm {currentIndex + 1}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-white transition-colors"
            title="Kichiklashtirish ( - )"
          >
            <span className="material-symbols-outlined text-[18px]">zoom_out</span>
          </button>
          <button
            onClick={resetZoom}
            className="px-3 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors min-w-[52px]"
            title="Asl o'lcham ( 0 )"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-white transition-colors"
            title="Kattalashtirish ( + )"
          >
            <span className="material-symbols-outlined text-[18px]">zoom_in</span>
          </button>
          <button
            onClick={onClose}
            className="ml-2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Yopish (Esc)"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Main Image container */}
      <div className="relative overflow-auto flex items-center justify-center w-full h-full px-4 pt-16 pb-16">
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{ transformOrigin: 'center center' }}
          className="relative w-[90vw] h-[80vh] flex items-center justify-center"
        >
          <Image
            src={currentImage}
            alt={`${personName} — rasm ${currentIndex + 1}`}
            fill
            sizes="100vw"
            priority
            className="object-contain rounded-xl shadow-2xl"
            draggable={false}
            unoptimized
          />
        </motion.div>
      </div>

      {/* Prev/Next arrows */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-50 shadow-lg"
            aria-label="Oldingi"
          >
            <span className="material-symbols-outlined text-3xl">chevron_left</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-50 shadow-lg"
            aria-label="Keyingi"
          >
            <span className="material-symbols-outlined text-3xl">chevron_right</span>
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
            {currentIndex + 1} / {total}
          </div>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/40 text-[11px] select-none">
        <span>+/- zoom</span>
        <span>·</span>
        <span>0 — asl o&apos;lcham</span>
        <span>·</span>
        <span>Esc — yopish</span>
      </div>
    </motion.div>
  );
}

// ── Main Client Wrapper ─────────────────────────────────────────────────────
interface Project {
  id: string;
  ownerName: string;
  title: string;
  description: string | null;
  photoUrl: string | null;
  galleryUrls: any;
  documentUrls: any;
  studentsCount: number | null;
  loanAmount: number | string | null;
  isPublished: boolean | null;
  [key: string]: any;
}

interface Tuman {
  id: string;
  name: string;
  viloyatId: string;
  [key: string]: any;
}

interface Viloyat {
  id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

interface ProjectDetailClientProps {
  project: Project;
  tuman: Tuman | null;
  viloyat: Viloyat | null;
}

export default function ProjectDetailClient({
  project,
  tuman,
  viloyat,
}: ProjectDetailClientProps) {
  const gallery: string[] = useMemo(() => {
    return (project.galleryUrls as string[]) ?? (project.photoUrl ? [project.photoUrl] : []);
  }, [project.galleryUrls, project.photoUrl]);

  const documents: string[] = useMemo(() => {
    return (project.documentUrls as string[]) ?? [];
  }, [project.documentUrls]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  return (
    <main className="min-h-screen bg-surface">
      {/* ─── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-40 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004f45] via-[#00685f] to-[#008378]" />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #84d5c5 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Back link */}
          <Link
            href="/loyihalar"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 group transition-colors"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Barcha ko&apos;makchilarga qaytish
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Photo */}
            <div
              onClick={() => {
                if (gallery[0]) openLightbox(0);
              }}
              className="w-full md:w-64 h-64 md:h-72 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 bg-white/10 cursor-pointer group"
            >
              {gallery[0] ? (
                <>
                  <Image
                    src={gallery[0]}
                    alt={project.ownerName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-3xl drop-shadow-lg">
                      zoom_in
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="material-symbols-outlined text-white/40 text-8xl">person</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
                {viloyat?.name ?? tuman?.name ?? "Ko'mak loyihasi"}
              </div>

              <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
                {project.ownerName}
              </h1>
              <p className="text-white/70 text-lg mb-6">{project.title}</p>

              <div className="flex flex-wrap gap-4">
                {project.studentsCount && (
                  <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5">
                    <span
                      className="material-symbols-outlined text-white/80 text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      group
                    </span>
                    <div>
                      <p className="text-white font-bold text-lg leading-none">
                        {project.studentsCount}
                      </p>
                      <p className="text-white/55 text-xs">O&apos;quvchi</p>
                    </div>
                  </div>
                )}
                {project.loanAmount && (
                  <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5">
                    <span
                      className="material-symbols-outlined text-white/80 text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      payments
                    </span>
                    <div>
                      <p className="text-white font-bold text-lg leading-none">
                        {project.loanAmount} mln
                      </p>
                      <p className="text-white/55 text-xs">Ssuda</p>
                    </div>
                  </div>
                )}
                {tuman && (
                  <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5">
                    <span
                      className="material-symbols-outlined text-white/80 text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      map
                    </span>
                    <div>
                      <p className="text-white font-bold text-base leading-none">{tuman.name}</p>
                      <p className="text-white/55 text-xs">Tuman</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DESCRIPTION ────────────────────────────────────────── */}
      {project.description && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Loyiha haqida</h2>
          {(() => {
            const parsed = parseTavsif(project.description);
            if (!parsed) {
              return (
                <p className="text-on-surface-variant leading-relaxed text-base max-w-3xl whitespace-pre-line">
                  {project.description}
                </p>
              );
            }

            return (
              <div className="max-w-3xl">
                {parsed.ssudaMaqsadi && (
                  <div className="bg-[#004f45]/5 border border-[#004f45]/10 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
                    <h3 className="font-headline text-base sm:text-lg font-bold text-[#004f45] mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl">track_changes</span>
                      Loyiha maqsadi (Ssuda maqsadi)
                    </h3>
                    <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                      {parsed.ssudaMaqsadi}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parsed.talim && parsed.talim.length > 0 && (
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 sm:p-6 shadow-sm">
                      <h3 className="font-headline text-base sm:text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#004f45]">school</span>
                        Ta&apos;lim
                      </h3>
                      <ul className="space-y-2">
                        {parsed.talim.map((item, i) => (
                          <li
                            key={i}
                            className="text-on-surface-variant text-xs sm:text-sm pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-[#004f45]/60 before:rounded-full leading-relaxed"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {parsed.faoliyat && parsed.faoliyat.length > 0 && (
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 sm:p-6 shadow-sm">
                      <h3 className="font-headline text-base sm:text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#004f45]">work</span>
                        Faoliyat
                      </h3>
                      <ul className="space-y-2">
                        {parsed.faoliyat.map((item, i) => (
                          <li
                            key={i}
                            className="text-on-surface-variant text-xs sm:text-sm pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-[#004f45]/60 before:rounded-full leading-relaxed"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {parsed.kelajakMaqsadi && (
                  <div className="bg-[#008378]/5 border border-[#008378]/10 rounded-2xl p-5 sm:p-6 mt-6 shadow-sm">
                    <h3 className="font-headline text-base sm:text-lg font-bold text-[#008378] mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl">trending_up</span>
                      Kelajak maqsadi
                    </h3>
                    <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed italic">
                      &ldquo;{parsed.kelajakMaqsadi}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </section>
      )}

      {/* ─── GALLERY ────────────────────────────────────────────── */}
      {gallery.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">
            Fotogalereya
            <span className="ml-2 text-base font-normal text-on-surface-variant">
              ({gallery.length} ta)
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map((url, i) => (
              <div
                key={i}
                onClick={() => openLightbox(i)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Image
                  src={url}
                  alt={`${project.ownerName} — rasm ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  unoptimized
                />
                <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-3xl drop-shadow-lg animate-fade-in">
                    open_in_full
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── DOCUMENTS ──────────────────────────────────────────── */}
      {documents.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Hujjatlar</h2>
          <div className="flex flex-col gap-3">
            {documents.map((url, i) => {
              const fileName = decodeURIComponent(url.split('/').pop() ?? `Hujjat ${i + 1}`);
              return (
                <a
                  key={i}
                  href={url}
                  download
                  className="flex items-center gap-4 bg-surface-container-lowest rounded-2xl px-6 py-4 shadow-sm hover:shadow-md border border-outline-variant/20 hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-primary text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      description
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                      {fileName}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Yuklab olish</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors group-hover:translate-y-0.5 duration-200">
                    download
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── BACK CTA ───────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-[#004f45] to-[#00685f] rounded-3xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-headline text-2xl font-bold text-white mb-1">
              Boshqa ko&apos;makchilarni ko&apos;ring
            </h3>
            <p className="text-white/60 text-sm">Barcha viloyatlar bo&apos;yicha loyihalarni filtrlang</p>
          </div>
          <Link
            href="/loyihalar"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-2xl hover:bg-white/90 transition-colors shrink-0 shadow-lg"
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
            Barcha ko&apos;makchilar
          </Link>
        </div>
      </section>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <LightboxOverlay
            images={gallery}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onChangeIndex={setLightboxIndex}
            personName={project.ownerName}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
