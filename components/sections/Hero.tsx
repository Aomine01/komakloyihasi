'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function Hero() {
  return (
    <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 relative overflow-hidden bg-surface">
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-primary-fixed rounded-full mix-blend-multiply filter blur-[120px] opacity-30" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-secondary-fixed rounded-full mix-blend-multiply filter blur-[120px] opacity-20" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8">
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container text-sm font-medium">
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              Ijtimoiy Davlat Loyihasi
            </div>
          </motion.div>

          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="font-headline text-5xl lg:text-7xl font-black leading-tight text-on-surface tracking-tight">
            <span className="text-gradient">Ko‘mak</span> - orzularga <br /> qanot beramiz!
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-xl text-on-surface-variant leading-relaxed font-body max-w-xl">
            Chekka va olis hududlarda o&apos;quv markazlarini tashkil etish yoki rivojlantirishga qaratilgan imtiyozli ssuda (foizsiz qarz) ajratish loyihasi.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="https://yoshlarfondi.uz/services/6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 bg-gradient-primary text-on-primary px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all text-lg shadow-lg hover:shadow-xl"
            >
              Loyihaga qo&apos;shilish
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
            <a
              href="#about"
              className="inline-flex justify-center items-center gap-2 bg-surface-container-high text-primary px-8 py-4 rounded-xl font-semibold hover:bg-surface-container-highest transition-all text-lg"
            >
              Batafsil ma&apos;lumot
            </a>
          </motion.div>
        </div>

        <motion.div custom={4} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-ambient relative">
            <img
              alt="Abstract illustration representing education, growth, and connection"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSVD7dKs09FJPXXQ-gslCy_bxlKOOjfVFbep020SFwjhSCOoqV8ZSTVpOTOj225bYmbbMvq6jKLhMynyCWuEUCZHPOJsiMSxD9DfPUpiPJ2DpG1m-T3EtTvc3kW0XQm1J9R6rplf4Fg7axosnxaUUBAGgSPeVppBTT_BAFnfZVTsk6KzM7LzM9mj335H1JTf683WoWLes4Qc9cjfICHoRIoFcdGXZH81SHPJW35t7g68W-D-84fF3b7oeHX6jfd5m06Ttjnxs4pKc"
            />
            {/* Floating stats card */}
            <div className="absolute bottom-6 left-6 glassmorphism p-6 rounded-xl shadow-ambient max-w-xs border border-outline-variant/15 md:left-[-1.5rem] md:bottom-[-1.5rem]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant font-medium">Qamrov</p>
                  <p className="text-2xl font-headline font-bold text-on-surface">Olis hududlar</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
