'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function Asoschilar() {
  const [activeTab, setActiveTab] = useState<'agentlik' | 'jamgarma'>('jamgarma');

  return (
    <section id="asoschilar" className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      {/* Hero Section */}
      <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="material-symbols-outlined text-sm">handshake</span>
          <span>Asoschilar</span>
        </div>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6 leading-tight">
          Loyiha <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-container">asoschilari</span>
        </h2>
        <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Mazkur tashabbus yoshlar bandligini ta&apos;minlash va tadbirkorlikni rivojlantirish maqsadida Yoshlar ishlari agentligi hamda Yoshlar tadbirkorligini rivojlantirish jamg&apos;armasi qoshida tashkil etilgan.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-surface-container-low p-2 rounded-2xl flex flex-col sm:flex-row gap-2 border border-outline-variant/15">
          <button
            onClick={() => setActiveTab('agentlik')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm md:text-base ${
              activeTab === 'agentlik'
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }`}
          >
            Yoshlar Ishlari Agentligi
          </button>
          <button
            onClick={() => setActiveTab('jamgarma')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm md:text-base ${
              activeTab === 'jamgarma'
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }`}
          >
            Yoshlar tadbirkorligini rivojlantirish jamg‘armasi
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'jamgarma' && (
            <motion.div
              key="jamgarma"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {/* Introduction */}
              <div className="text-center max-w-4xl mx-auto space-y-6">
                <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
                  Yoshlar tadbirkorligini rivojlantirish davlat maqsadli jamg‘armasi (YTRJ)
                </h3>
                <p className="font-headline text-xl text-primary font-medium italic">
                  “Sizda g‘oya bor, bizda imkoniyat!”
                </p>
                <div className="font-body text-on-surface-variant space-y-4 text-justify md:text-center leading-relaxed">
                  <p>
                    Yoshlar tadbirkorligini rivojlantirish davlat maqsadli jamg‘armasi – O‘zbekiston Respublikasi Prezidentining PQ-60-sonli qarori asosida tashkil etilgan, yoshlarni tadbirkorlikka jalb qilish va bandligini ta’minlash bo‘yicha mamlakatimizdagi yirik davlat institutidir. Jamg‘arma shunchaki moliyaviy yordam ko‘rsatuvchi tashkilot emas, balki g‘oyadan to yirik brendgacha bo‘lgan masofada yosh tadbirkor uchun ishonchli ko‘prik va strategik hamkor hisoblanadi.
                  </p>
                  <p>
                    Jamg‘armaning bosh maqsadi yoshlarni tadbirkorlikka keng jalb etish, ularning startap va biznes loyihalari, g‘oya va tashabbuslarini ro‘yobga chiqarish uchun qulay sharoitlar yaratish, ichki va tashqi bozorda raqobatbardosh mahsulotlar va xizmatlarni rag‘batlantirishdan iborat.
                  </p>
                </div>
              </div>

              {/* Priorities Grid */}
              <div>
                <h4 className="font-headline text-2xl font-bold text-on-surface mb-8 text-center">Ustuvor vazifalar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: 'trending_up', title: 'Tadbirkorlikni rivojlantirish', desc: 'Yoshlarning biznes g‘oyalarini amaliy loyihalarga aylantirishga ko‘maklashish.' },
                    { icon: 'lightbulb', title: 'Innovatsiyalarni qo‘llab-quvvatlash', desc: 'Startap va texnologik loyihalarga grant hamda moliyaviy yordam berish.' },
                    { icon: 'work', title: 'Bandlikni ta’minlash', desc: 'Qo‘shimcha ish o‘rinlari yaratishga yo‘naltirilgan loyihalarni moliyalashtirish.' },
                    { icon: 'school', title: 'Ta’lim uchun sharoit', desc: 'Biznes ko‘nikmalarni rivojlantirish uchun treninglar va akselerasiya dasturlari xarajatlarini qoplash.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/15 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-primary">{item.icon}</span>
                      </div>
                      <h5 className="font-headline font-bold text-on-surface mb-2">{item.title}</h5>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audience and Finances */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Audience */}
                <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/15 hover:border-primary/30 transition-colors">
                  <h4 className="font-headline text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">groups</span>
                    Kimlar foydalanishi mumkin?
                  </h4>
                  <ul className="space-y-4">
                    {[
                      '18 yoshdan 30 yoshgacha boʻlgan fuqarolar',
                      'Yakka tartibdagi tadbirkorlar (YTT)',
                      'Dehqonchilik va hunarmandchilik bilan shugʻullanuvchilar',
                      'Ustav fondining 50+ foizi yoshlarga tegishli yuridik shaxslar',
                      'Qishloq xoʻjaligi yerlari ajratilgan yoshlarga xizmat qiluvchi kooperativlar',
                      'Startap loyiha egalariga (inkubatsiya/akseleratsiya oʻtganlar)',
                      'Yoshlar texnoparkida R&D loyiha amalga oshirayotganlar'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary mt-0.5 text-[20px]">check_circle</span>
                        <span className="font-body text-on-surface-variant leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Financing */}
                <div className="space-y-6">
                  <h4 className="font-headline text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">account_balance</span>
                    Moliyaviy qo‘llab-quvvatlash
                  </h4>
                  {[
                    { title: 'Imtiyozli kreditlash', desc: 'Tijorat banklari orqali 100 mln so‘mdan 5 mlrd so‘mgacha 7 yil muddatga (2 yillik imtiyozli davr bilan) taqdim etiladi.' },
                    { title: 'To‘g‘ridan-to‘g‘ri qarz', desc: 'Jamg‘armaning o‘zidan ajratiladigan foizsiz va imtiyozli mablag‘lar (bino qurish, ta’mirlash, inkubatorlar va til markazlari uchun).' },
                    { title: 'Subsidiya va venchur', desc: 'Qaytarib berilmaydigan mablag‘lar va investitsiyalar: startaplarni qo‘llab-quvvatlash, R&D ishlari, ta’lim xarajatlari hamda venchur investitsiya.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border-l-4 border-l-primary border border-outline-variant/15 shadow-sm hover:shadow-md transition-shadow">
                      <h5 className="font-headline font-bold text-on-surface mb-2">{item.title}</h5>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="font-headline text-2xl font-bold text-on-surface mb-8 text-center">Tashkil etilgan loyihalar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Ko‘mak', desc: 'Chekka hududlarda zamonaviy ta’lim ekotizimini yaratish va o‘quv markazlari uchun ssuda ajratish loyihasi.' },
                    { name: 'Yoshlar Ventures', desc: 'Istiqbolli startaplarni aniqlab, kapital va mentorlik orqali global bozorga olib chiquvchi venchur fondi.' },
                    { name: 'Yoshlar Biznes Maktabi', desc: 'Yoshlarga amaliy bilim berish va zamonaviy biznes modellarini o‘rgatishga qaratilgan kompleks ta‘lim tizimi.' },
                    { name: 'Yosh Tadbirkorlar Chempionati', desc: 'Eng kuchli, innovatsion biznes va startap loyihalarni aniqlash bo‘yicha respublika bellashuvi.' }
                  ].map((item, i) => (
                    <div key={i} className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/15 relative overflow-hidden group hover:shadow-md transition-all">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                      <h5 className="font-headline font-bold text-on-surface mb-3 text-lg">{item.name}</h5>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conclusion */}
              <div className="bg-gradient-to-br from-primary to-primary-container p-8 md:p-12 rounded-[2.5rem] text-center text-on-primary shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                  <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
                    Jamg‘arma bilan bog‘liq barcha jarayonlar, arizalar qabuli va ishtirokchilarni saralash bosqichlari <strong>yoshlarfondi.uz</strong> elektron platformasi orqali to‘liq onlayn, ochiq hamda shaffof tarzda amalga oshiriladi.
                  </p>
                  <h4 className="font-headline text-3xl md:text-4xl font-extrabold pt-4 tracking-tight">
                    Sizning g‘oyangiz – bizning kelajagimiz!
                  </h4>
                  <p className="font-body text-lg text-white/90">
                    Davlatimiz tomonidan yaratilgan ushbu imkoniyatlardan foydalaning va O‘zbekistonning yangi avlod tadbirkorlari qatoridan joy oling!
                  </p>
                  <div className="pt-6">
                    <a href="https://yoshlarfondi.uz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold shadow-[0_8px_16px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1">
                      Platformaga o&apos;tish
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'agentlik' && (
            <motion.div
              key="agentlik"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-8"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-primary">info</span>
              </div>
              <h3 className="font-headline text-3xl font-bold text-on-surface">Yoshlar Ishlari Agentligi</h3>
              <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Ushbu bo&apos;limga tez orada Yoshlar Ishlari Agentligi faoliyati, maqsad va vazifalari haqida batafsil ma&apos;lumotlar joylanadi. Biz ushbu sahifa ustida ishlayapmiz.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
