'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: reduceMotion ? 0 : i * 0.1, duration: reduceMotion ? 0.2 : 0.6, ease: 'easeOut' },
    }),
  };

  return (
    <>
      {/* About Section */}
      <section className="py-14 sm:py-20 md:py-28 px-4 md:px-6 bg-surface-container-low" id="about">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: reduceMotion ? 0.2 : 0.5 }}

            className="text-center mb-10 sm:mb-14"
          >
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="w-6 h-[3px] rounded-full bg-primary flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary/80">Loyiha haqida</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface mb-3 sm:mb-4">
              Ko&apos;mak — ta&apos;lim orqali kelajak sari
            </h2>
            <p className="text-on-surface-variant text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              &quot;Ko&apos;mak&quot; – chekka hududlarda zamonaviy ta&apos;lim ekotizimini yaratishga qaratilgan ijtimoiy tashabbusdir. Mazkur tashabbus jadid bobolarimiz boshlab bergan ma&apos;rifatparvarlik an&apos;analarini bugungi zamonaviy dunyo bilan birlashtirishni maqsad qilgan.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
              className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] border border-outline-variant/15 text-left hover:shadow-[0_16px_36px_-4px_rgba(19,27,46,0.1)] transition-shadow duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-5">
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">cast_for_education</span>
              </div>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface mb-2">Sifatli ta&apos;lim</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Zamonaviy metodikalar asosida qishloq yoshlari uchun sifatli bilim olish muhitini yarating.</p>
            </motion.div>
            <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
              className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] border border-outline-variant/15 text-left hover:shadow-[0_16px_36px_-4px_rgba(19,27,46,0.1)] transition-shadow duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-5">
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">groups</span>
              </div>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface mb-2">Ijtimoiy ko&apos;mak</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Ijtimoiy himoyaga muhtoj yoshlarni qo&apos;llab-quvvatlang va ularning bandligini ta&apos;minlang.</p>
            </motion.div>
            <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
              className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] border border-outline-variant/15 text-left hover:shadow-[0_16px_36px_-4px_rgba(19,27,46,0.1)] transition-shadow duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-5">
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">public</span>
              </div>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface mb-2">Hududlar rivoji</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Infratuzilmasi rivojlanmagan olis joylarda yangi o&apos;quv markazlari tashkil eting.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Goals Section (Bento Grid) */}
      <section className="py-14 sm:py-20 md:py-28 px-4 md:px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="w-6 h-[3px] rounded-full bg-primary flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary/80">Maqsadlar</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface mb-3">Loyihaning asosiy maqsadlari</h2>
            <p className="text-on-surface-variant text-sm sm:text-base md:text-lg">To&apos;rt muhim yo&apos;nalish bo&apos;yicha barqaror rivojlanishni ta&apos;minlash</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1 (Large) */}
            <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
              className="lg:col-span-2 bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden flex flex-col justify-between min-h-[220px] sm:min-h-[280px] shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] border border-outline-variant/15">
              <div className="relative z-10 w-full lg:w-2/3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-5">
                  <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">balance</span>
                </div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold text-on-surface mb-3 sm:mb-4">Hududiy tenglik</h3>
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">Eng chekka qishloqdagi o&apos;quvchi ham poytaxt darajasidagi sifatli ta&apos;lim olishiga sharoit yaratish.</p>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 bg-primary pointer-events-none transform translate-x-1/4 translate-y-1/4 rounded-tl-full" />
            </motion.div>

            {/* Card 2 */}
            <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
              className="bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] border border-outline-variant/15 hover:shadow-[0_16px_36px_-4px_rgba(19,27,46,0.1)] transition-shadow duration-300">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 sm:mb-5">
                  <span className="material-symbols-outlined text-amber-600 text-xl sm:text-2xl">lightbulb</span>
                </div>
                <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface mb-2 sm:mb-3">Intellektual tadbirkorlik</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Ta&apos;lim sohasiga sarmoya kiritayotgan yosh tadbirkorlarni imtiyozli moliyalashtirish orqali ularni qo&apos;llab-quvvatlash.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
              className="bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] border border-outline-variant/15 hover:shadow-[0_16px_36px_-4px_rgba(19,27,46,0.1)] transition-shadow duration-300">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-5">
                  <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">work</span>
                </div>
                <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface mb-2 sm:mb-3">Sifatli bandlik</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">O&apos;qituvchilikka ishtiyoqi baland yoshlarni o&apos;z hududida munosib ish o&apos;rni va daromad bilan ta&apos;minlash.</p>
              </div>
            </motion.div>

            {/* Card 4 (Wide) */}
            <motion.div custom={4} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
              className="lg:col-span-2 bg-gradient-to-br from-surface-container to-surface-variant rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] border border-outline-variant/15">
              <div className="flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center mb-4 sm:mb-5">
                  <span className="material-symbols-outlined text-on-primary text-xl sm:text-2xl">handshake</span>
                </div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold text-on-surface mb-3 sm:mb-4">Imtiyozli ssuda olish shartlari</h3>
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">Loyiha doirasida xorijiy tillarga ixtisoslashgan o&apos;quv markazlarini tashkil etish va kengaytirish uchun ssuda ajratiladi.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Loan (Ssuda) Section */}
      <section className="py-14 sm:py-20 md:py-28 px-4 md:px-6 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="w-6 h-[3px] rounded-full bg-primary flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary/80">Ssuda shartlari</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface mb-3">Imtiyozli ssuda shartlari</h2>
            <p className="text-on-surface-variant text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
              Loyiha doirasida ajratiladigan ssuda mablag&apos;lari aynan xorijiy tillarni o&apos;qitishga ixtisoslashgan o&apos;quv markazlarini noldan tashkil etish yoki faoliyat ko&apos;rsatayotganlarini kengaytirish uchun taqdim etiladi.
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            <div className="space-y-4 sm:space-y-5">
              {[
                { icon: 'person_check', title: 'Yosh chegarasi', desc: 'Ariza topshiruvchilar 18 yoshdan 30 yoshgacha bo\'lishi lozim.' },
                { icon: 'verified', title: 'Malaka talabi', desc: 'Xorijiy tillar bo\'yicha kamida C1 darajasidagi milliy yoki xalqaro sertifikat talab etiladi.' },
                { icon: 'apartment', title: 'Yuridik maqom', desc: 'Tadbirkorlik faoliyatini YTT yoki MCHJ shaklida davlat ro\'yxatidan o\'tkazish kerak.' },
                { icon: 'location_on', title: 'Hududiy ustuvorlik', desc: 'O\'quv markazlarini asosan olis va chekka hududlarda tashkil etilishi lozim.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i + 1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp}
                  className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 flex gap-4 shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] border border-outline-variant/15 hover:shadow-[0_16px_36px_-4px_rgba(19,27,46,0.1)] transition-shadow duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-semibold text-on-surface text-sm sm:text-base">{item.title}</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="bg-surface-container-lowest p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_-8px_rgba(19,27,46,0.08)] border border-primary/15 relative overflow-hidden"
            >
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-secondary-fixed rounded-full opacity-20 blur-3xl" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-5 sm:mb-6">
                  <span className="material-symbols-outlined text-sm">support_agent</span>
                  Sizga tayanchmiz
                </div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold text-on-surface mb-3 sm:mb-4 leading-tight">Ko&apos;mak – Davlat va yosh tadbirkor o&apos;rtasidagi ishonchli ko&apos;prik</h3>
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mb-6">
                  Yoshlarning orzularini haqiqatga aylantirish va ularga har qadamda tayanch bo&apos;lish – bizning oliy maqsadimiz!
                </p>
                <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-base">payments</span>
                    <span className="font-bold text-primary text-xs sm:text-sm">Moliyalashtirish</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-0.5">Ssuda miqdori</p>
                  <p className="font-headline font-extrabold text-xl sm:text-2xl text-on-surface">130 000 000 so&apos;m</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
