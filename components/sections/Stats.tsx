'use client';

import type { Stat } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <>
      <section id="statistika" className="py-16 px-6 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="md:w-1/2 space-y-6">
          <h2 className="font-headline text-5xl md:text-6xl font-extrabold text-on-surface leading-tight tracking-tight">
            Loyihaning <br />
            <span className="gradient-text">Ochiq Raqamlari</span>
          </h2>
          <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
            Bizning asosiy maqsadimiz ta&apos;lim va moliyaviy yordamni shaffof taqdim etish. Quyida Ko&apos;mak loyihasi orqali erishilgan natijalar bilan tanishing.
          </p>
        </motion.div>
        <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="md:w-1/2 relative">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10 transform scale-110 translate-x-10 translate-y-10" />
          <Image
            alt="Data visualization"
            className="rounded-xl shadow-ambient w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmZM0oNlRrd7xnekpddyrh70MSZpK4R1sUbxSeGsZ5DpphPd21o86YVtjdzJYUIsjHLoDwqNQyP-WM33lLhWVAvNPGlUxY1D3Yb4ZGdQXaXQ4tMXp5JaVnQl2O9-cctyAK-kcVQ8_xMWENFGQ0L8hqeuwrC5FrGBAu8u5qkaaB1cWTsiW0FnsrObCbUT9iAu7VfepUMRNJ1GRzDzqkl34-1JYvAUt7ysbSTbFYs4MWUoBUfu1_7CkYmSsfM6UOz1lyQsGwtO5ytRU"
            width={600}
            height={300}
          />
        </motion.div>
      </section>

      {/* Big Numbers (Bento Grid) */}
      <section className="bg-surface-container-low py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient flex flex-col justify-between relative overflow-hidden group border border-outline-variant/15">
              <div className="absolute -right-6 -top-6 bg-surface-container w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-primary-container/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                </div>
                <h3 className="font-body text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Moliyalashtirilgan loyihalar</h3>
              </div>
              <div className="relative z-10">
                <p className="font-headline text-5xl font-extrabold text-primary mb-2">385 ta</p>
                <p className="text-on-surface-variant text-sm">Jami moliyalashtirilgan loyihalar</p>
              </div>
            </motion.div>

            <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient flex flex-col justify-between relative overflow-hidden group border border-outline-variant/15">
              <div className="absolute -right-6 -top-6 bg-surface-container w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-secondary-container text-on-secondary-container rounded-lg">
                  <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>man</span>
                </div>
                <h3 className="font-body text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Erkaklar</h3>
              </div>
              <div className="relative z-10">
                <p className="font-headline text-5xl font-extrabold text-on-surface mb-2">223 nafar</p>
                <p className="text-on-surface-variant text-sm">Erkak tadbirkorlar</p>
              </div>
            </motion.div>

            <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient flex flex-col justify-between relative overflow-hidden group border border-outline-variant/15">
              <div className="absolute -right-6 -top-6 bg-surface-container w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-tertiary-container/10 text-tertiary rounded-lg">
                  <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>woman</span>
                </div>
                <h3 className="font-body text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Ayollar</h3>
              </div>
              <div className="relative z-10">
                <p className="font-headline text-5xl font-extrabold text-on-surface mb-2">162 nafar</p>
                <p className="text-on-surface-variant text-sm">Ayol tadbirkorlar</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Regional Map Section */}
      <section className="bg-surface-container-low py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="flex flex-col md:flex-row items-center justify-between mb-10">
            <h2 className="font-headline text-3xl font-bold text-on-surface">Hududiy Qamrov</h2>
            <div className="mt-4 md:mt-0 px-4 py-2 bg-surface rounded-full shadow-sm text-sm text-on-surface-variant flex items-center gap-2 border border-outline-variant/15">
              <span className="w-2 h-2 rounded-full bg-secondary block" />
              Faol loyihalar mavjud hududlar
            </div>
          </motion.div>
          
          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest rounded-xl shadow-ambient p-2 sm:p-4 h-[300px] md:h-[500px] overflow-hidden relative border border-outline-variant/15">
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-surface/80 backdrop-blur-sm px-6 py-4 rounded-xl text-center shadow-lg pointer-events-auto border border-outline-variant/15">
                <span className="material-symbols-outlined text-primary text-4xl mb-2">map</span>
                <h3 className="font-headline font-bold text-on-surface">Interaktiv Xarita</h3>
                <p className="text-sm text-on-surface-variant mt-1">Hududlar bo&apos;yicha batafsil ma&apos;lumot</p>
              </div>
            </div>
            <Image
              alt="Map of Uzbekistan"
              className="w-full h-full object-contain opacity-80 rounded-lg"
              src="/uz.svg"
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
