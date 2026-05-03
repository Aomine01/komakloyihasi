'use client';

import type { Stat } from '@/lib/types';
import { motion } from 'framer-motion';

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
          <img
            alt="Data visualization"
            className="rounded-xl shadow-ambient w-full object-cover h-[300px]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmZM0oNlRrd7xnekpddyrh70MSZpK4R1sUbxSeGsZ5DpphPd21o86YVtjdzJYUIsjHLoDwqNQyP-WM33lLhWVAvNPGlUxY1D3Yb4ZGdQXaXQ4tMXp5JaVnQl2O9-cctyAK-kcVQ8_xMWENFGQ0L8hqeuwrC5FrGBAu8u5qkaaB1cWTsiW0FnsrObCbUT9iAu7VfepUMRNJ1GRzDzqkl34-1JYvAUt7ysbSTbFYs4MWUoBUfu1_7CkYmSsfM6UOz1lyQsGwtO5ytRU"
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
                <div className="p-3 bg-secondary-container text-on-secondary-container rounded-lg">
                  <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                </div>
                <h3 className="font-body text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Ajratilgan Qarzlar</h3>
              </div>
              <div className="relative z-10">
                <p className="font-headline text-5xl font-extrabold text-primary mb-2">1.2 Trln</p>
                <p className="text-on-surface-variant text-sm">So&apos;m miqdorida moliyaviy ko&apos;mak</p>
              </div>
            </motion.div>

            <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient flex flex-col justify-between relative overflow-hidden group border border-outline-variant/15">
              <div className="absolute -right-6 -top-6 bg-surface-container w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-primary-container/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                </div>
                <h3 className="font-body text-sm font-semibold text-on-surface-variant uppercase tracking-wider">O&apos;quv Markazlari</h3>
              </div>
              <div className="relative z-10">
                <p className="font-headline text-5xl font-extrabold text-on-surface mb-2">45 ta</p>
                <p className="text-on-surface-variant text-sm">Yangi tashkil etilgan markazlar</p>
              </div>
            </motion.div>

            <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient flex flex-col justify-between relative overflow-hidden group border border-outline-variant/15">
              <div className="absolute -right-6 -top-6 bg-surface-container w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-tertiary-container/10 text-tertiary rounded-lg">
                  <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                </div>
                <h3 className="font-body text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Qamrab olinganlar</h3>
              </div>
              <div className="relative z-10">
                <p className="font-headline text-5xl font-extrabold text-on-surface mb-2">12,500+</p>
                <p className="text-on-surface-variant text-sm">Ta&apos;lim oluvchi talabalar</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.h2 custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="font-headline text-3xl font-bold text-on-surface mb-10">
          Tahliliy Ma&apos;lumotlar
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart (Simulated) */}
          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest rounded-xl shadow-ambient p-8 border border-outline-variant/15">
            <h3 className="font-body text-lg font-semibold text-on-surface mb-6 flex items-center justify-between">
              Moliyalashtirish o&apos;sishi
              <span className="text-sm font-normal text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/15">2025 Yil</span>
            </h3>
            <div className="h-64 flex items-end justify-between gap-2 pt-4">
              <div className="w-full bg-primary/20 rounded-t-sm h-[30%] relative group cursor-pointer hover:bg-primary/30 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded">Yan</div>
              </div>
              <div className="w-full bg-primary/40 rounded-t-sm h-[45%] relative group cursor-pointer hover:bg-primary/50 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded">Fev</div>
              </div>
              <div className="w-full bg-primary/60 rounded-t-sm h-[60%] relative group cursor-pointer hover:bg-primary/70 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded">Mar</div>
              </div>
              <div className="w-full bg-primary rounded-t-sm h-[85%] relative group cursor-pointer hover:bg-primary-container transition-colors shadow-[0_0_15px_rgba(0,104,95,0.3)]">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded">Apr</div>
              </div>
              <div className="w-full bg-primary/80 rounded-t-sm h-[70%] relative group cursor-pointer hover:bg-primary/90 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded">May</div>
              </div>
              <div className="w-full bg-secondary/80 rounded-t-sm h-[95%] relative group cursor-pointer hover:bg-secondary transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded">Iyun</div>
              </div>
            </div>
            <div className="flex justify-between mt-4 border-t border-outline-variant/15 pt-2 text-xs text-on-surface-variant">
              <span>Yan</span><span>Fev</span><span>Mar</span><span>Apr</span><span>May</span><span>Iyun</span>
            </div>
          </motion.div>

          {/* Doughnut Chart (Simulated) */}
          <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest rounded-xl shadow-ambient p-8 flex flex-col border border-outline-variant/15">
            <h3 className="font-body text-lg font-semibold text-on-surface mb-6">Mablag&apos;larni maqsadli sarflash</h3>
            <div className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-10">
              <div className="relative w-48 h-48 shrink-0">
                <div className="absolute inset-0 pie-chart" />
                <div className="absolute inset-4 bg-surface-container-lowest rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="block font-headline font-bold text-2xl text-on-surface">100%</span>
                    <span className="text-xs text-on-surface-variant">Jami qarz</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-on-surface-variant">Xonalarni jihozlash (40%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-container" />
                  <span className="text-sm text-on-surface-variant">O&apos;quv darsliklari (35%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-sm text-on-surface-variant">Innovatsion texnologiyalar (25%)</span>
                </div>
              </div>
            </div>
          </motion.div>
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
            <img
              alt="Map of Uzbekistan"
              className="w-full h-full object-contain opacity-80 rounded-lg"
              src="/uz.svg"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
