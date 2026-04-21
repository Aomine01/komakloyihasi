'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Viloyat, Tuman, Project } from '@/lib/types';
import ViloyatCard from '@/components/ui/ViloyatCard';
import ProjectCard from '@/components/ui/ProjectCard';

export default function Komakchilar() {
  const [viloyatlar, setViloyatlar] = useState<Viloyat[]>([]);
  const [selectedViloyat, setSelectedViloyat] = useState<string | null>(null);
  const [tumanlar, setTumanlar] = useState<Tuman[]>([]);
  const [selectedTuman, setSelectedTuman] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingTumanlar, setLoadingTumanlar] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectCounts, setProjectCounts] = useState<Record<string, number>>({});

  // Fetch viloyatlar + project counts on mount
  useEffect(() => {
    fetch('/api/data?action=viloyatlar')
      .then((r) => r.json())
      .then((data) => {
        setViloyatlar(data.viloyatlar || []);
        setProjectCounts(data.counts || {});
      });
  }, []);

  // Fetch tumanlar when viloyat selected
  useEffect(() => {
    if (!selectedViloyat) return;
    setLoadingTumanlar(true);
    setSelectedTuman(null);
    setProjects([]);

    fetch(`/api/data?action=tumanlar&viloyat_id=${selectedViloyat}`)
      .then((r) => r.json())
      .then((data) => {
        setTumanlar(data.tumanlar || []);
        setLoadingTumanlar(false);
      });

    // Auto-fetch all projects for this viloyat
    setLoadingProjects(true);
    fetch(`/api/data?action=projects&viloyat_id=${selectedViloyat}`)
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.projects || []);
        setLoadingProjects(false);
      });
  }, [selectedViloyat]);

  // Fetch projects when tuman selected
  const handleTumanSelect = (tumanId: string | null) => {
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
      });
  };

  return (
    <section id="komakchilar" className="bg-surface py-20 px-6 relative">
      <div className="absolute inset-0 bg-surface-container-low rounded-[2.5rem] -z-10 mix-blend-multiply opacity-50 m-6" />
      <div className="max-w-7xl mx-auto py-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-medium text-sm mb-6 tracking-wide">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          Muvaffaqiyatli Loyihalar
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight mb-4">
          Ta&apos;lim kelajagini <br/> yaratayotgan markazlar
        </h2>
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
          Ko&apos;mak orqali moliyalashtirilgan va yuzlab yoshlarga zamonaviy bilim berayotgan ilg&apos;or o&apos;quv markazlari bilan tanishing, tizimli filtirdan foydalaning.
        </p>

        {/* Level 1: Viloyat Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {viloyatlar.map((v) => (
            <ViloyatCard
              key={v.id}
              name={v.name}
              count={projectCounts[v.id] || 0}
              selected={selectedViloyat === v.id}
              onClick={() =>
                setSelectedViloyat(selectedViloyat === v.id ? null : v.id)
              }
            />
          ))}
        </div>

        {/* Level 2: Tuman Tabs */}
        <AnimatePresence>
          {selectedViloyat && !loadingTumanlar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => handleTumanSelect(null)}
                  className={`px-6 py-2.5 rounded-full font-medium text-sm transition-colors shadow-sm ${
                    selectedTuman === null
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  Barchasi
                </button>
                {tumanlar.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTumanSelect(t.id)}
                    className={`px-6 py-2.5 rounded-full font-medium text-sm transition-colors shadow-sm ${
                      selectedTuman === t.id
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              {/* Level 3: Project Cards */}
              <div className="mt-10">
                {loadingProjects ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-[400px] animate-pulse rounded-2xl bg-surface-container-high"
                      />
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-low py-16 shadow-ambient border border-outline-variant/15">
                    <span className="material-symbols-outlined text-outline-variant text-6xl">school</span>
                    <p className="mt-4 font-body text-on-surface-variant">
                      Hozircha moliyalashtirilgan loyihalar mavjud emas
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
                  >
                    {projects.map((p) => (
                      <ProjectCard key={p.id} project={p} />
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
