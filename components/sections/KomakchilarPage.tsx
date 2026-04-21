'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Viloyat, Tuman, Project } from '@/lib/types';
import ProjectCard from '@/components/ui/ProjectCard';

interface ViloyatWithCount extends Viloyat {
  count: number;
}

interface Props {
  viloyatlar: ViloyatWithCount[];
  totalProjects: number;
  totalStudents: number;
}

export default function KomakchilarPage({ viloyatlar, totalProjects, totalStudents }: Props) {
  const [selectedViloyat, setSelectedViloyat] = useState<string | null>(null);
  const [tumanlar, setTumanlar] = useState<Tuman[]>([]);
  const [selectedTuman, setSelectedTuman] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loadingTumanlar, setLoadingTumanlar] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const totalRegions = 14;

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Load all published projects on mount
  useEffect(() => {
    setLoadingProjects(true);
    fetch('/api/data?action=projects')
      .then((r) => r.json())
      .then((data) => {
        const list = data.projects || [];
        setAllProjects(list);
        setProjects(list);
        setLoadingProjects(false);
      })
      .catch(() => setLoadingProjects(false));
  }, []);

  // Fetch tumanlar + viloyat projects when region selected
  useEffect(() => {
    if (!selectedViloyat) {
      setTumanlar([]);
      setSelectedTuman(null);
      setProjects(allProjects);
      return;
    }
    setLoadingTumanlar(true);
    setSelectedTuman(null);
    setProjects([]);

    Promise.all([
      fetch(`/api/data?action=tumanlar&viloyat_id=${selectedViloyat}`).then((r) => r.json()),
      fetch(`/api/data?action=projects&viloyat_id=${selectedViloyat}`).then((r) => r.json()),
    ])
      .then(([tumanData, projectData]) => {
        setTumanlar(tumanData.tumanlar || []);
        setProjects(projectData.projects || []);
        setLoadingTumanlar(false);
      })
      .catch(() => setLoadingTumanlar(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedViloyat]);

  const handleTumanSelect = useCallback(
    (tumanId: string | null) => {
      setSelectedTuman(tumanId);
      setLoadingProjects(true);
      const url = tumanId
        ? `/api/data?action=projects&tuman_id=${tumanId}`
        : `/api/data?action=projects&viloyat_id=${selectedViloyat}`;
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          setProjects(data.projects || []);
          setLoadingProjects(false);
        })
        .catch(() => setLoadingProjects(false));
    },
    [selectedViloyat]
  );

  const clearAll = useCallback(() => {
    setSelectedViloyat(null);
    setSelectedTuman(null);
    setTumanlar([]);
    setSearchQuery('');
    setProjects(allProjects);
  }, [allProjects]);

  // Apply search filter on top of current project list
  const displayedProjects = (selectedViloyat ? projects : allProjects).filter((p) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.ownerName.toLowerCase().includes(q)
    );
  });

  const selectedViloyatObj = viloyatlar.find((v) => v.id === selectedViloyat);
  const hasFilters = selectedViloyat || debouncedSearch;

  return (
    <div className="min-h-screen bg-surface">

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-20 px-6">
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004f45] via-[#00685f] to-[#008378]" />
        {/* Ambient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #84d5c5 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6bd8cb 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm
                         text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                school
              </span>
              Moliyalashtirilgan o&apos;quv markazlari
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-headline text-5xl md:text-6xl lg:text-7xl font-extrabold text-white
                         leading-[1.05] tracking-tight mb-5"
            >
              Ko&apos;makchilar
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-white/70 text-lg leading-relaxed max-w-xl mb-10"
            >
              Ko&apos;mak loyihasi doirasida moliyalashtirilgan o&apos;quv markazlari katalogi.
              Hudud va tuman bo&apos;yicha saralang.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="relative max-w-xl"
            >
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl pointer-events-none select-none">
                search
              </span>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Markaz nomi yoki tadbirkor ismi..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/10 border border-white/20
                           text-white placeholder:text-white/40 outline-none
                           focus:bg-white/20 focus:border-white/40 transition-all duration-200
                           text-sm font-body backdrop-blur-sm"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white
                               transition-colors w-6 h-6 flex items-center justify-center rounded-full
                               bg-white/10 hover:bg-white/20"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Stats badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-12 flex flex-wrap gap-3"
          >
            {[
              { icon: 'storefront', value: totalProjects || '—', label: "O'quv markaz" },
              { icon: 'group', value: totalStudents ? `${totalStudents.toLocaleString()}+` : '—', label: "O'quvchi" },
              { icon: 'location_on', value: totalRegions, label: 'Hudud' },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 border border-white/15
                           backdrop-blur-sm rounded-2xl px-5 py-3"
              >
                <span
                  className="material-symbols-outlined text-white/80 text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {stat.icon}
                </span>
                <div>
                  <p className="text-white font-headline font-bold text-xl leading-none">{stat.value}</p>
                  <p className="text-white/55 text-xs mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER PANEL ──────────────────────────────────────────── */}
      <div className="sticky top-20 z-30 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/15 shadow-[0_4px_20px_rgba(19,27,46,0.04)]">

        {/* Region chips — scrollable row */}
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-3">
            Viloyat tanlang
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {/* All */}
            <button
              onClick={clearAll}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                         font-medium text-sm transition-all duration-200 ${
                selectedViloyat === null
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                apps
              </span>
              Barchasi
              {totalProjects > 0 && (
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                  selectedViloyat === null ? 'bg-white/25 text-white' : 'bg-primary/10 text-primary'
                }`}>
                  {totalProjects}
                </span>
              )}
            </button>

            {viloyatlar.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedViloyat(selectedViloyat === v.id ? null : v.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                           font-medium text-sm transition-all duration-200 ${
                  selectedViloyat === v.id
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                {v.name}
                {(v.count ?? 0) > 0 && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                    selectedViloyat === v.id ? 'bg-white/25 text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    {v.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* District sub-filter */}
        <AnimatePresence>
          {selectedViloyat && !loadingTumanlar && tumanlar.length > 0 && (
            <motion.div
              key="tumanlar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-outline-variant/10"
            >
              <div className="max-w-7xl mx-auto px-6 pt-3 pb-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[13px] text-primary">my_location</span>
                  {selectedViloyatObj?.name} — tuman
                </p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  <button
                    onClick={() => handleTumanSelect(null)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      selectedTuman === null
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-highest text-on-surface hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    Barchasi
                  </button>
                  {tumanlar.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTumanSelect(t.id)}
                      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        selectedTuman === t.id
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-highest text-on-surface hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── RESULTS ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* Results bar */}
        <div className="flex items-center justify-between mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${selectedViloyat}-${selectedTuman}-${debouncedSearch}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.2 }}
              className="text-on-surface-variant text-sm flex items-center gap-2"
            >
              {loadingProjects ? (
                <>
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  Yuklanmoqda...
                </>
              ) : (
                <>
                  <span className="font-bold text-on-surface text-base">{displayedProjects.length}</span>
                  ta o&apos;quv markaz
                  {selectedViloyatObj && (
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {selectedViloyatObj.name}
                    </span>
                  )}
                  {selectedTuman && tumanlar.find(t => t.id === selectedTuman) && (
                    <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      {tumanlar.find(t => t.id === selectedTuman)?.name}
                    </span>
                  )}
                  {debouncedSearch && (
                    <span className="text-on-surface-variant">
                      — &quot;{debouncedSearch}&quot; bo&apos;yicha
                    </span>
                  )}
                </>
              )}
            </motion.p>
          </AnimatePresence>

          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant
                         hover:text-primary transition-colors bg-surface-container-high
                         hover:bg-primary/10 px-3 py-1.5 rounded-full"
            >
              <span className="material-symbols-outlined text-sm">filter_alt_off</span>
              Tozalash
            </motion.button>
          )}
        </div>

        {/* Grid / empty / skeleton */}
        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[420px] animate-pulse rounded-2xl bg-surface-container-high" />
            ))}
          </div>
        ) : displayedProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl bg-surface-container-low py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-outline text-4xl">
                {debouncedSearch ? 'search_off' : 'school'}
              </span>
            </div>
            <h3 className="font-headline text-xl font-semibold text-on-surface mb-2">
              {debouncedSearch ? 'Natija topilmadi' : 'Loyihalar mavjud emas'}
            </h3>
            <p className="text-on-surface-variant text-sm max-w-sm">
              {debouncedSearch
                ? `"${debouncedSearch}" so\u2018zi bo\u2018yicha hech narsa topilmadi. Boshqa so\u2018z kiriting.`
                : "Bu hududda hozircha moliyalashtirilgan loyihalar yo\u2018q."}
            </p>
            <button
              onClick={clearAll}
              className="mt-6 inline-flex items-center gap-2 bg-primary text-on-primary
                         px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Barcha loyihalarga qaytish
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
          >
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.35) }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ─── BOTTOM STATS ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#004f45] to-[#00685f] mt-16">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-10">
            Loyiha natijalari · 2025–2026
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: 'storefront',
                value: totalProjects || '—',
                label: "Jami o'quv markazlar",
                desc: "Moliyalashtirilgan va faol loyihalar",
              },
              {
                icon: 'school',
                value: totalStudents ? `${totalStudents.toLocaleString()}+` : '—',
                label: "Jami o'quvchilar",
                desc: "2025–2026 yillar oraligida",
              },
              {
                icon: 'location_on',
                value: totalRegions,
                label: "Qamrab olingan hududlar",
                desc: "O'zbekistonning barcha viloyatlari",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-white text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="font-headline text-4xl font-extrabold text-white leading-none mb-1">
                    {item.value}
                  </p>
                  <p className="font-semibold text-white/90 text-sm mb-0.5">{item.label}</p>
                  <p className="text-white/55 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
