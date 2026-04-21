'use client';

import { useState, useRef, useEffect } from 'react';
import type { FAQ } from '@/lib/types';
import { motion } from 'framer-motion';

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  const renderAnswer = () => {
    if (faq.answer.startsWith('LIST:')) {
      const parts = faq.answer.slice(5).split('||');
      const header = parts.length > 1 ? parts[0] : null;
      const itemsString = parts.length > 1 ? parts[1] : parts[0];
      const items = itemsString.split('|');

      return (
        <div className="space-y-4">
          {header && <p className="font-medium text-on-surface mb-2">{header}</p>}
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary mt-1 text-sm shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-on-surface-variant">{item.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return <p className="whitespace-pre-line">{faq.answer}</p>;
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden mb-4 border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow duration-300">
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-between cursor-pointer p-6 transition-all duration-300 hover:bg-surface-container-low ${
          isOpen ? 'bg-surface-container-low' : ''
        }`}
      >
        <h3 className="font-headline text-lg font-bold text-on-surface text-left pr-8">
          {faq.question}
        </h3>
        <span
          className={`material-symbols-outlined text-primary transition-transform duration-300 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? `${height}px` : '0px' }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div className="px-6 pb-6 pt-2 text-on-surface-variant font-body leading-relaxed border-t border-outline-variant/5">
          {renderAnswer()}
        </div>
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const fallbackFaqs: FAQ[] = [
    { id: '1', question: '"Ko‘mak" loyihasida kimlar ishtirok etishi mumkin?', answer: 'Loyihada chet tilini bilish darajasi kamida C1 (yoki unga tenglashtirilgan xalqaro sertifikat) bo‘lgan, 18 dan 30 yoshgacha bo‘lgan yoshlar ssuda olish uchun ariza topshirishlari mumkin.', isPublished: true, sortOrder: 1, createdAt: new Date() },
    { id: '2', question: 'Ssuda miqdori qancha va u qancha muddatga beriladi?', answer: 'Ssuda miqdori BHMning 320 baravarigacha (130 mln so‘mgacha) etib belgilangan. Mablag‘ 3 yil (36 oy) muddatga, foizsiz (0%) taqdim etiladi.', isPublished: true, sortOrder: 2, createdAt: new Date() },
    { id: '3', question: 'Ssuda qanday tartibda qaytariladi?', answer: 'Loyiha doirasida 6 oylik imtiyozli davr beriladi. Qolgan 30 oy davomida asosiy qarz teng qismlarga bo‘lingan holda qaytariladi.', isPublished: true, sortOrder: 3, createdAt: new Date() },
    { id: '4', question: 'O‘quv markazini istalgan hududda ochish mumkinmi?', answer: 'O‘quv markazlari respublikaning shahar va tuman markazlaridan uzoqda joyhazlangan, ta’lim xizmatlariga ehtiyoj yuqori bo‘lgan olis hududlarda tashkil etilishi lozim.', isPublished: true, sortOrder: 4, createdAt: new Date() },
    { id: '5', question: 'Ariza topshirish uchun qanday hujjatlar talab etiladi?', answer: 'LIST:Asosiy hujjatlar ro‘yxati:||Shaxsni tasdiqlovchi hujjat (Pasport/ID karta)|Til bilish darajasini tasdiqlovchi sertifikat (C1)|YaTT yoki MChJ guvohnomasi|KATM kredit tarixi|Kafil yoki sug‘urta shartnomasi', isPublished: true, sortOrder: 5, createdAt: new Date() },
    { id: '6', question: 'Mablag‘ ajratilishi necha kun vaqt oladi?', answer: 'Barcha hujjatlar to‘liq taqdim etilib, maxsus kengash tasdig‘idan o‘tgandan so‘ng, mablag‘ 3 ish kuni ichida arizachining hisob raqamiga o‘tkazib beriladi.', isPublished: true, sortOrder: 6, createdAt: new Date() },
    { id: '7', question: 'Loyiha qaysi qonuniy asosga ko‘ra amalga oshiriladi?', answer: 'Mazkur loyiha va unga qo‘yilgan talablar O‘zbekiston Respublikasi Vazirlar Mahkamasining 426-sonli qarori bilan tartibga solinadi.', isPublished: true, sortOrder: 7, createdAt: new Date() },
    { id: '8', question: 'Loyiha doirasida ajratilgan mablag‘lardan qanday foydalanish kerak?', answer: 'Mablag‘lar faqat naqd pulsiz shaklda, hisob raqamidan o‘tkazish orqali maqsadli ishlatilishi shart. Naqdlashtirish imkoniyati mavjud emas.', isPublished: true, sortOrder: 8, createdAt: new Date() },
    { id: '9', question: 'Loyiha ishtirokchilariga qanday qo‘shimcha imkoniyatlar bor?', answer: 'Ssuda olgan yoshlar "Ko‘makchilar" hamjamiyatiga va "Ko‘mak+" yopiq guruhiga a’zo bo‘lishadi. Bu yerda tajriba almashish, har oy o‘tkaziladigan onlayn va oflayn tadbirlarda ishtirok etish imkoniyati yaratiladi.', isPublished: true, sortOrder: 9, createdAt: new Date() },
    { id: '10', question: 'Arizani qayerda va qanday qoldirish mumkin?', answer: 'Hujjatlar va arizalar masofaviy tarzda yoshlarfondi.uz sayti orqali qabul qilinadi.', isPublished: true, sortOrder: 10, createdAt: new Date() },
  ];

  const displayFaqs = faqs && faqs.length > 0 ? faqs : fallbackFaqs;

  return (
    <section id="faq" className="max-w-4xl mx-auto px-6 pt-32 pb-24">
      {/* Hero Section */}
      <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="material-symbols-outlined text-sm">help</span>
          <span>Ko‘p beriladigan savollar</span>
        </div>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6 leading-tight">
          Sizning savollaringizga <br className="hidden md:block" />{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-container">aniq javoblar</span>
        </h2>
        <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Ta&apos;lim markazlari uchun foizsiz ssuda olish tartibi, shartlari va talablari haqida barcha kerakli ma&apos;lumotlarni shu yerdan topishingiz mumkin.
        </p>
      </motion.div>

      {/* FAQ Accordion List */}
      <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="max-w-3xl mx-auto">
        <div className="flex flex-col">
          {displayFaqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="mt-20">
        <div className="bg-surface-container-low rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden border border-outline-variant/15">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-4">
            Javob topaolmadingizmi?
          </h2>
          <p className="font-body text-on-surface-variant mb-8 max-w-lg mx-auto">
            Bizning mutaxassislarimiz sizga yordam berishga doim tayyor. O&apos;z savollaringizni to&apos;g&apos;ridan-to&apos;g&apos;ri bizga yo&apos;llang.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <a
              href="https://yoshlarfondi.uz/services/6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-lg font-medium shadow-[0_12px_32px_-4px_rgba(0,104,95,0.2)] hover:shadow-[0_12px_32px_-4px_rgba(0,104,95,0.4)] transition-all flex items-center justify-center"
            >
              Mutaxassis bilan bog&apos;lanish
            </a>
            <a href="#" className="bg-surface-container-high text-primary px-8 py-3 rounded-lg font-medium hover:bg-surface-container-highest transition-colors flex items-center justify-center">
              Qo&apos;llanmani yuklab olish
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
