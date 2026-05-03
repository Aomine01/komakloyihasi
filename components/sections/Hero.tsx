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
    <section className="pt-28 pb-16 lg:pt-48 lg:pb-32 px-6 relative overflow-hidden bg-surface">
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-primary-fixed rounded-full mix-blend-multiply filter blur-[120px] opacity-30" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-secondary-fixed rounded-full mix-blend-multiply filter blur-[120px] opacity-20" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 pt-8 lg:pt-16">
        <div className="space-y-8 flex flex-col items-center">

          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black leading-[1.1] text-on-surface tracking-tight">
            <span className="text-gradient">Ko‘mak</span> - orzularga <br className="hidden md:block" /> qanot beramiz!
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-lg sm:text-xl md:text-2xl text-on-surface-variant leading-relaxed font-body max-w-3xl text-center">
            Chekka va olis hududlarda o&apos;quv markazlarini tashkil etish yoki rivojlantirishga qaratilgan imtiyozli ssuda (foizsiz qarz) ajratish loyihasi.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-5 pt-6 w-full sm:w-auto justify-center">
            <a
              href="https://yoshlarfondi.uz/services/6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 bg-gradient-primary text-on-primary px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold hover:opacity-90 transition-all text-base sm:text-lg shadow-lg hover:shadow-xl w-full sm:w-auto hover:-translate-y-0.5 duration-200"
            >
              Loyihaga qo&apos;shilish
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
            <a
              href="#about"
              className="inline-flex justify-center items-center gap-2 bg-surface-container-high text-primary px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold hover:bg-surface-container-highest transition-all text-base sm:text-lg w-full sm:w-auto border border-outline-variant/30 hover:-translate-y-0.5 duration-200"
            >
              Batafsil ma&apos;lumot
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
