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

export default function HowItWorks() {
  return (
    <>
      {/* About Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-surface-container-low" id="about">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <motion.h2 custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface">
            Loyiha haqida
          </motion.h2>
          <motion.p custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-lg text-on-surface-variant leading-relaxed font-body">
            &quot;Ko&apos;mak&quot; - chekka va olis hududlarda zamonaviy ta&apos;lim ekotizimini yaratish, o&apos;quv markazlarini tashkil etish va mavjudlarini rivojlantirishga yo&apos;naltirilgan ijtimoiy davlat loyihasidir. Mazkur tashabbus jadid bobolarimiz boshlab bergan ma&apos;rifatparvarlik an&apos;analarini bugungi zamonaviy dunyo bilan birlashtirishni maqsad qilgan.
          </motion.p>
          <div className="grid sm:grid-cols-3 gap-6 md:gap-8 pt-8 md:pt-12">
            <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-ambient text-left border border-outline-variant/15">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">cast_for_education</span>
              <h3 className="font-headline text-xl font-semibold text-on-surface mb-2">Ta&apos;lim ekotizimi</h3>
              <p className="text-on-surface-variant text-sm">Zamonaviy o&apos;quv dasturlari va metodikalari asosida sifatli ta&apos;lim muhitini shakllantirish.</p>
            </motion.div>
            <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-ambient text-left border border-outline-variant/15">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">groups</span>
              <h3 className="font-headline text-xl font-semibold text-on-surface mb-2">Ijtimoiy yordam</h3>
              <p className="text-on-surface-variant text-sm">Ijtimoiy himoyaga muhtoj yoshlarni qo&apos;llab-quvvatlash va ularning bandligini ta&apos;minlash.</p>
            </motion.div>
            <motion.div custom={4} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-ambient text-left border border-outline-variant/15">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">public</span>
              <h3 className="font-headline text-xl font-semibold text-on-surface mb-2">Masofaviy hududlar</h3>
              <p className="text-on-surface-variant text-sm">Infratuzilmasi rivojlanmagan joylarda yoshlar uchun markazlar tashkil etish ustuvorligi.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Goals Section (Bento Grid) */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10 md:mb-16">
            <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface">Loyihaning asosiy maqsadlari</h2>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-on-surface-variant">To&apos;rt muhim yo&apos;nalish bo&apos;yicha barqaror rivojlanishni ta&apos;minlash</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 (Large) */}
            <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="lg:col-span-2 bg-surface-container-low rounded-2xl p-6 md:p-8 lg:p-12 relative overflow-hidden flex flex-col justify-between min-h-[250px] md:min-h-[300px]">
              <div className="relative z-10 w-full lg:w-2/3">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-container text-on-primary-container mb-6">
                  <span className="material-symbols-outlined">balance</span>
                </span>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">Hududiy tenglik</h3>
                <p className="text-on-surface-variant text-lg">Eng chekka qishloqdagi o&apos;quvchi ham poytaxt darajasidagi sifatli ta&apos;lim olishiga sharoit yaratish.</p>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 bg-primary pointer-events-none transform translate-x-1/4 translate-y-1/4 rounded-tl-full" />
            </motion.div>
            
            {/* Card 2 */}
            <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-highest rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-outline-variant/15">
              <div>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-variant text-on-surface mb-6">
                  <span className="material-symbols-outlined">lightbulb</span>
                </span>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Intellektual tadbirkorlik</h3>
                <p className="text-on-surface-variant">Ta&apos;lim sohasiga sarmoya kiritayotgan yosh tadbirkorlarni imtiyozli moliyalashtirish orqali ularning faoliyatini barqarorlashtirish.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-low rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-outline-variant/15">
              <div>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container mb-6">
                  <span className="material-symbols-outlined">work</span>
                </span>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Sifatli bandlik</h3>
                <p className="text-on-surface-variant">O&apos;qituvchilikka ishtiyoqi baland yoshlarni o&apos;z hududida munosib ish o&apos;rni va daromad bilan ta&apos;minlash.</p>
              </div>
            </motion.div>

            {/* Card 4 (Wide) */}
            <motion.div custom={4} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="lg:col-span-2 bg-gradient-to-br from-surface-container to-surface-variant rounded-2xl p-6 md:p-8 lg:p-12 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-1">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-on-primary mb-6">
                  <span className="material-symbols-outlined">handshake</span>
                </span>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">Ijtimoiy adolat</h3>
                <p className="text-on-surface-variant text-lg">Bilim olish hamma uchun ochiq bo&apos;lishi kerak. Biz ijtimoiy himoyaga muhtoj qatlamni sifatli ta&apos;lim bilan qamrab olishga ko&apos;maklashamiz.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Loan (Ssuda) Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}>
              <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface mb-4 md:mb-6">Imtiyozli Ssuda shartlari</h2>
              <p className="text-lg text-on-surface-variant mb-8">
                Loyiha doirasida ajratiladigan ssuda mablag&apos;lari aynan xorijiy tillarni o&apos;qitishga ixtisoslashgan o&apos;quv markazlarini noldan tashkil etish yoki faoliyat ko&apos;rsatayotganlarini kengaytirish uchun taqdim etiladi.
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                    <span className="material-symbols-outlined">person_check</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-semibold text-on-surface text-lg">Yosh chegarasi</h4>
                    <p className="text-on-surface-variant">Ariza topshiruvchi yoshlar 18 yoshdan 30 yoshgacha bo&apos;lishi lozim.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-semibold text-on-surface text-lg">Malaka talabi</h4>
                    <p className="text-on-surface-variant">Loyiha xorijiy tillar bo&apos;yicha C1 darajadagi milliy yoki unga tenglashtirilgan xalqaro sertifikatga ega yoshlarga mo&apos;ljallangan.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                    <span className="material-symbols-outlined">apartment</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-semibold text-on-surface text-lg">Yuridik maqom</h4>
                    <p className="text-on-surface-variant">O&apos;quv markazi faoliyatini qonuniy yo&apos;lga qo&apos;yish uchun ariza topshiruvchi YaTT yoki MCHJ sifatida ro&apos;yxatdan o&apos;tgan bo&apos;lishi kerak.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-semibold text-on-surface text-lg">Hududiy ustuvorlik</h4>
                    <p className="text-on-surface-variant">&quot;Ko&apos;mak&quot; loyihasining eng muhim jihati - chekka va olis hududlarda xorijiy tillarga ixtisoslashgan o&apos;quv markazlari ochishga rag&apos;batlantirishdir.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-ambient border border-outline-variant/15 relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-secondary-fixed rounded-full opacity-20 blur-2xl" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant text-on-surface text-sm font-medium mb-6">
                  <span className="material-symbols-outlined text-sm">support_agent</span>
                  Sizga tayanchmiz
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">Davlat va yosh tadbirkor o&apos;rtasidagi ko&apos;prik</h3>
                <p className="text-on-surface-variant mb-6">
                  Ushbu loyiha shunchaki moliyaviy yordam emas. Bu mablag&apos;lar hisobiga siz o&apos;quv markaz tashkil etishingiz, o&apos;quv darsliklari xarid qilishingiz, zamonaviy xonalarni jihozlashingiz hamda o&apos;quv jarayoniga innovatsion ta&apos;lim texnologiyalarini joriy etishingiz mumkin.
                </p>
                <div className="bg-surface-container p-4 rounded-xl">
                  <p className="text-sm text-on-surface-variant">Biz yoshlarning orzularini haqiqatga aylantirish, ularning orqasida mustahkam tayanch borligini his qilishlari uchun xizmat qilamiz.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
