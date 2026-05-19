'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';


const priorities = [
  { icon: 'trending_up', title: 'Tadbirkorlikni rivojlantirish', desc: 'Yoshlarning biznes g\'oyalarini amaliy loyihalarga aylantirishga ko\'maklashish.' },
  { icon: 'lightbulb', title: 'Innovatsiyalarni qo\'llab-quvvatlash', desc: 'Startap va texnologik loyihalarga grant hamda moliyaviy yordam berish.' },
  { icon: 'work', title: 'Bandlikni ta\'minlash', desc: 'Qo\'shimcha ish o\'rinlari yaratishga yo\'naltirilgan loyihalarni moliyalashtirish.' },
  { icon: 'school', title: 'Ta\'lim uchun sharoit', desc: 'Biznes ko\'nikmalarni rivojlantirish uchun treninglar va akselerasiya dasturlari xarajatlarini qoplash.' },
];

const audience = [
  '18 yoshdan 30 yoshgacha bo\'lgan fuqarolar',
  'Yakka tartibdagi tadbirkorlar (YTT)',
  'Dehqonchilik va hunarmandchilik bilan shug\'ullanuvchilar',
  'Ustav fondining 50+ foizi yoshlarga tegishli yuridik shaxslar',
  'Qishloq xo\'jaligi yerlari ajratilgan yoshlarga xizmat qiluvchi kooperativlar',
  'Startap loyiha egalariga (inkubatsiya/akseleratsiya o\'tganlar)',
  'Yoshlar texnoparkida R&D loyiha amalga oshirayotganlar',
];

const financing = [
  { title: 'Imtiyozli kreditlash', desc: 'Tijorat banklari orqali 100 mln so\'mdan 5 mlrd so\'mgacha 7 yil muddatga (2 yillik imtiyozli davr bilan) taqdim etiladi.' },
  { title: 'To\'g\'ridan-to\'g\'ri qarz', desc: 'Jamg\'armaning o\'zidan ajratiladigan foizsiz va imtiyozli mablag\'lar (bino qurish, ta\'mirlash, inkubatorlar va til markazlari uchun).' },
  { title: 'Subsidiya va venchur', desc: 'Qaytarib berilmaydigan mablag\'lar va investitsiyalar: startaplarni qo\'llab-quvvatlash, R&D ishlari, ta\'lim xarajatlari hamda venchur investitsiya.' },
];

const projects = [
  { name: 'Ko\'mak', desc: 'Chekka hududlarda zamonaviy ta\'lim ekotizimini yaratish va o\'quv markazlari uchun ssuda ajratish loyihasi.' },
  { name: 'Yoshlar Ventures', desc: 'Istiqbolli startaplarni aniqlab, kapital va mentorlik orqali global bozorga olib chiquvchi venchur fondi.' },
  { name: 'Yoshlar Biznes Maktabi', desc: 'Yoshlarga amaliy bilim berish va zamonaviy biznes modellarini o\'rgatishga qaratilgan kompleks ta\'lim tizimi.' },
  { name: 'Yosh Tadbirkorlar Chempionati', desc: 'Eng kuchli, innovatsion biznes va startap loyihalarni aniqlash bo\'yicha respublika bellashuvi.' },
];

export default function Asoschilar() {
  const [activeTab, setActiveTab] = useState<'agentlik' | 'jamgarma'>('jamgarma');
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
    <section id="asoschilar" className="py-14 sm:py-20 md:py-28 px-4 md:px-6 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: reduceMotion ? 0.2 : 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >

          <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
            <span className="w-6 h-[3px] rounded-full bg-primary flex-shrink-0" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary/80">Asoschilar</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface mb-3 sm:mb-4">
            Loyiha <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-container">asoschilari</span>
          </h2>
          <p className="text-on-surface-variant text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Mazkur tashabbus yoshlar bandligini ta&apos;minlash va tadbirkorlikni rivojlantirish maqsadida Yoshlar ishlari agentligi hamda Yoshlar tadbirkorligini rivojlantirish jamg&apos;armasi qoshida tashkil etilgan.
          </p>
        </motion.div>

        {/* Tabs — pill style matching viloyat filter */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="flex gap-1.5 sm:gap-2 p-1.5 bg-surface-container-high rounded-2xl border border-outline-variant/15 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('jamgarma')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === 'jamgarma'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest'
              }`}
            >
              Yoshlar tadbirkorligini rivojlantirish jamg&apos;armasi
            </button>
            <button
              onClick={() => setActiveTab('agentlik')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === 'agentlik'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest'
              }`}
            >
              Yoshlar Ishlari Agentligi
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'jamgarma' && (
              <motion.div
                key="jamgarma"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-10 sm:space-y-16"
              >
                {/* Introduction */}
                <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
                  className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
                  <h3 className="font-headline text-xl sm:text-2xl md:text-3xl font-bold text-on-surface">
                    Yoshlar tadbirkorligini rivojlantirish davlat maqsadli jamg&apos;armasi (YTRJ)
                  </h3>
                  <p className="font-headline text-lg sm:text-xl text-primary font-medium italic">
                    &ldquo;Sizda g&apos;oya bor, bizda imkoniyat!&rdquo;
                  </p>
                  <div className="text-on-surface-variant text-sm sm:text-base leading-relaxed space-y-3 sm:space-y-4 text-left sm:text-center">
                    <p>
                      Yoshlar tadbirkorligini rivojlantirish davlat maqsadli jamg&apos;armasi – O&apos;zbekiston Respublikasi Prezidentining PQ-60-sonli qarori asosida tashkil etilgan, yoshlarni tadbirkorlikka jalb qilish va bandligini ta&apos;minlash bo&apos;yicha mamlakatimizdagi yirik davlat institutidir. Jamg&apos;arma shunchaki moliyaviy yordam ko&apos;rsatuvchi tashkilot emas, balki g&apos;oyadan to yirik brendgacha bo&apos;lgan masofada yosh tadbirkor uchun ishonchli ko&apos;prik va strategik hamkor hisoblanadi.
                    </p>
                    <p>
                      Jamg&apos;armaning bosh maqsadi yoshlarni tadbirkorlikka keng jalb etish, ularning startap va biznes loyihalari, g&apos;oya va tashabbuslarini ro&apos;yobga chiqarish uchun qulay sharoitlar yaratish, ichki va tashqi bozorda raqobatbardosh mahsulotlar va xizmatlarni rag&apos;batlantirishdan iborat.
                    </p>
                  </div>
                </motion.div>

                {/* Priorities Grid */}
                <div>
                  <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
                    className="text-center mb-6 sm:mb-8">
                    <h4 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">Ustuvor vazifalar</h4>
                  </motion.div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {priorities.map((item, i) => (
                      <motion.div key={i} custom={i + 2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
                        className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/15 shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] hover:shadow-[0_16px_36px_-4px_rgba(19,27,46,0.1)] transition-shadow duration-300">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                          <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">{item.icon}</span>
                        </div>
                        <h5 className="font-headline font-bold text-on-surface text-sm sm:text-base mb-1.5 sm:mb-2">{item.title}</h5>
                        <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Audience and Finances */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Audience */}
                  <motion.div custom={6} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
                    className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline-variant/15 shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)]">
                    <h4 className="font-headline text-lg sm:text-xl font-bold text-on-surface mb-5 sm:mb-6 flex items-center gap-2.5 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-base sm:text-xl">groups</span>
                      </div>
                      Kimlar foydalanishi mumkin?
                    </h4>
                    <ul className="space-y-3 sm:space-y-4">
                      {audience.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 sm:gap-3">
                          <span className="material-symbols-outlined text-primary mt-0.5 text-[18px] sm:text-[20px] shrink-0">check_circle</span>
                          <span className="text-on-surface-variant text-sm sm:text-base leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Financing */}
                  <div className="space-y-3 sm:space-y-4">
                    <motion.div custom={7} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}>
                      <h4 className="font-headline text-lg sm:text-xl font-bold text-on-surface mb-5 sm:mb-6 flex items-center gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-base sm:text-xl">account_balance</span>
                        </div>
                        Moliyaviy qo&apos;llab-quvvatlash
                      </h4>
                    </motion.div>
                    {financing.map((item, i) => (
                      <motion.div key={i} custom={i + 8} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
                        className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border-l-4 border-l-primary border border-outline-variant/15 shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] hover:shadow-[0_16px_36px_-4px_rgba(19,27,46,0.1)] transition-shadow duration-300">
                        <h5 className="font-headline font-bold text-on-surface text-sm sm:text-base mb-1.5 sm:mb-2">{item.title}</h5>
                        <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <motion.div custom={11} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
                    className="text-center mb-6 sm:mb-8">
                    <h4 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">Tashkil etilgan loyihalar</h4>
                  </motion.div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {projects.map((item, i) => (
                      <motion.div key={i} custom={i + 12} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
                        className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/15 shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)] hover:shadow-[0_16px_36px_-4px_rgba(19,27,46,0.1)] transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <h5 className="font-headline font-bold text-on-surface text-sm sm:text-base mb-2 sm:mb-3">{item.name}</h5>
                        <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Conclusion — CTA Banner */}
                <motion.div custom={16} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
                  className="bg-gradient-to-br from-[#004f45] via-primary to-primary-container p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl text-center text-on-primary shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay" />
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                  <div className="relative z-10 max-w-4xl mx-auto space-y-5 sm:space-y-6">
                    <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
                      Jamg&apos;arma bilan bog&apos;liq barcha jarayonlar, arizalar qabuli va ishtirokchilarni saralash bosqichlari <strong>yoshlarfondi.uz</strong> elektron platformasi orqali to&apos;liq onlayn, ochiq hamda shaffof tarzda amalga oshiriladi.
                    </p>
                    <h4 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold pt-3 sm:pt-4 tracking-tight">
                      Sizning g&apos;oyangiz – bizning kelajagimiz!
                    </h4>
                    <p className="text-sm sm:text-base md:text-lg text-white/90">
                      Davlatimiz tomonidan yaratilgan ushbu imkoniyatlardan foydalaning va O&apos;zbekistonning yangi avlod tadbirkorlari qatoridan joy oling!
                    </p>
                    <div className="pt-4 sm:pt-6">
                      <a href="https://yoshlarfondi.uz" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold shadow-[0_8px_16px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 text-sm sm:text-base">
                        Platformaga o&apos;tish
                        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">arrow_forward</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'agentlik' && (
              <motion.div
                key="agentlik"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center space-y-5 sm:space-y-6 bg-surface-container-lowest rounded-2xl sm:rounded-3xl border border-outline-variant/15 p-6 sm:p-8"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary">info</span>
                </div>
                <h3 className="font-headline text-xl sm:text-2xl md:text-3xl font-bold text-on-surface">Yoshlar Ishlari Agentligi</h3>
                <p className="text-on-surface-variant text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
                  Ushbu bo&apos;limga tez orada Yoshlar Ishlari Agentligi faoliyati, maqsad va vazifalari haqida batafsil ma&apos;lumotlar joylanadi. Biz ushbu sahifa ustida ishlayapmiz.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
