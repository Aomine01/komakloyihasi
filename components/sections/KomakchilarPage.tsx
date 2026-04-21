'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [loadingTumanlar, setLoadingTumanlar] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [totalRegions] = useState(14);

  // Load all published projects on mount for search
  useEffect(() => {
    setLoadingProjects(true);
    fetch('/api/data?action=projects')
      .then((r) => r.json())
      .then((data) => {
        setAllProjects(data.projects || []);
        setProjects(data.projects || []);
        setLoadingProjects(false);
      })
      .catch(() => setLoadingProjects(false));
  }, []);

  // Fetch tumanlar when viloyat selected
  useEffect(() => {
    if (!selectedViloyat) {
      setTumanlar([]);
      setSelectedTuman(null);
      return;
    }
    setLoadingTumanlar(true);
    setSelectedTuman(null);
    setProjects([]);

    fetch(`/api/data?action=tumanlar&viloyat_id=${selectedViloyat}`)
      .then((r) => r.json())
      .then((data) => {
        setTumanlar(data.tumanlar || []);
        setLoadingTumanlar(false);
      })
      .catch(() => setLoadingTumanlar(false));

    setLoadingProjects(true);
    fetch(`/api/data?action=projects&viloyat_id=${selectedViloyat}`)
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.projects || []);
        setLoadingProjects(false);
      })
      .catch(() => setLoadingProjects(false));
  }, [selectedViloyat]);

  const handleTumanSelect = useCallback((tumanId: string | null) => {
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
  }, [selectedViloyat]);

  // Search filter (client-side on allProjects when no region selected)
  const displayedProjects = selectedViloyat
    ? projects.filter((p) =>
        searchQuery
          ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      )
    : allProjects.filter((p) =>
        searchQuery
          ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );

  const selectedViloyatName = viloyatlar.find((v) => v.id === selectedViloyat)?.name;

  return (
    <div className="min-h-screen bg-surface">
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 px-6">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00685f] to-[#008378] pointer-events-none" />
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #84d5c5 0, transparent 50%), radial-gradient(circle at 80% 20%, #6bd8cb 0, transparent 40%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                school
              </span>
              Moliyalashtirilgan o'quv markazlari
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-headline text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6"
            >
              Ko'makchilar
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/75 text-lg leading-relaxed max-w-xl mb-10"
            >
              Ko&apos;mak loyihasi doirasida moliyalashtirilgan o&apos;quv markazlari katalogi.
              Hududlar bo&apos;yicha saralang va muvaffaqiyatli loyihalar bilan tanishing.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-lg"
            >
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Markaz nomi yoki tadbirkor ismi..."
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 outline-none focus:bg-white/25 focus:border-white/40 transition-all text-sm font-body"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              )}
            </motion.div>
          </div>

          {/* Stats badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap gap-4"
          >
            {[
              { icon: 'storefront', value: totalProjects || '—', label: "O'quv markaz" },
              { icon: 'group', value: totalStudents ? `${totalStudents.toLocaleString()}+` : '—', label: "O'quvchi" },
              { icon: 'location_on', value: totalRegions, label: 'Hudud' },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3"
              >
                <span className="material-symbols-outlined text-white/80 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {stat.icon}
                </span>
                <div>
                  <p className="text-white font-headline font-bold text-xl leading-none">{stat.value}</p>
                  <p className="text-white/65 text-xs mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Region Filter */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">
            Hududlar bo&apos;yicha filterlang
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setSelectedViloyat(null); setTumanlar([]); setSelectedTuman(null); }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                selectedViloyat === null
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                apps
              </span>
              Barcha hududlar
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selectedViloyat === null ? 'bg-white/25' : 'bg-primary/10 text-primary'}`}>
                {totalProjects || '—'}
              </span>
            </button>

            {viloyatlar.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedViloyat(selectedViloyat === v.id ? null : v.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                  selectedViloyat === v.id
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                {v.name}
                {(v.count ?? 0) > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selectedViloyat === v.id ? 'bg-white/25' : 'bg-primary/10 text-primary'}`}>
                    {v.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* District Sub-Filter */}
        <AnimatePresence>
          {selectedViloyat && !loadingTumanlar && tumanlar.length > 0 && (
            <motion.div
              key="tumanlar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-surface-container-low rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">my_location</span>
                  {selectedViloyatName} — tumanlar
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTumanSelect(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTuman === null
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    Barchasi
                  </button>
                  {tumanlar.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTumanSelect(t.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedTuman === t.id
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'
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

        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${selectedViloyat}-${selectedTuman}-${searchQuery}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="text-on-surface-variant text-sm"
              >
                {loadingProjects ? (
                  'Yuklanmoqda...'
                ) : (
                  <>
                    <span className="font-semibold text-on-surface">
                      {displayedProjects.length}
                    </span>{' '}
                    ta o&apos;quv markaz topildi
                    {selectedViloyatName && (
                      <> — <span className="text-primary font-medium">{selectedViloyatName}</span></>
                    )}
                  </>
                )}
              </motion.p>
            </AnimatePresence>
          </div>
          {(selectedViloyat || searchQuery) && (
            <button
              onClick={() => {
                setSelectedViloyat(null);
                setSelectedTuman(null);
                setTumanlar([]);
                setSearchQuery('');
              }}
              className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">filter_alt_off</span>
              Filterni tozalash
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] animate-pulse rounded-2xl bg-surface-container-high"
              />
            ))}
          </div>
        ) : displayedProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl bg-surface-container-low py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-outline text-4xl">
                {searchQuery ? 'search_off' : 'school'}
              </span>
            </div>
            <h3 className="font-headline text-xl font-semibold text-on-surface mb-2">
              {searchQuery ? 'Natija topilmadi' : 'Loyihalar mavjud emas'}
            </h3>
            <p className="text-on-surface-variant text-sm max-w-sm">
              {searchQuery
                ? `"${searchQuery}" bo'yicha hech narsa topilmadi. Boshqa kalit so'z kiriting.`
                : "Bu hududda hozircha moliyalashtirilgan loyihalar yo'q."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
          >
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── BOTTOM STATS BAR ──────────────────────────────────────── */}
      <section className="bg-surface-dim mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'storefront',
                value: totalProjects || '—',
                label: "Jami o'quv markazlar",
                desc: 'Moliyalashtirilgan va faol loyihalar',
              },
              {
                icon: 'school',
                value: totalStudents ? `${totalStudents.toLocaleString()}+` : '—',
                label: "Jami o'quvchilar",
                desc: "2024\u20132026 yillar oralig'ida",
              },
              {
                icon: 'location_on',
                value: totalRegions,
                label: "Qamrab olingan hududlar",
                desc: "O'zbekistonning barcha viloyatlari",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-primary text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="font-headline text-3xl font-extrabold text-on-surface leading-none mb-1">
                    {item.value}
                  </p>
                  <p className="font-semibold text-on-surface text-sm mb-0.5">{item.label}</p>
                  <p className="text-on-surface-variant text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
