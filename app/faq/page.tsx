import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { faqs as faqsTable } from '@/lib/schema';
import type { FAQ } from '@/lib/types';
import Navbar from '@/components/ui/Navbar';
import FAQSection from '@/components/sections/FAQ';
import Footer from '@/components/sections/Footer';
import { eq, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Ko'p so'raladigan savollar | Ko'mak",
  description: "Ko'mak loyihasi haqida eng ko'p beriladigan savollar va ularga javoblar.",
  openGraph: {
    title: "Ko'p so'raladigan savollar | Ko'mak",
    description: "Ko'mak loyihasi haqida eng ko'p beriladigan savollar va ularga javoblar.",
    url: "https://komakloyihasi.uz/faq",
  },
};
const DEFAULT_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: '"Ko\'mak" loyihasida kimlar ishtirok etishi mumkin?',
    answer: 'Loyihada chet tilini bilish darajasi kamida C1 (yoki unga tenglashtirilgan xalqaro sertifikat) bo\'lgan, 18 dan 30 yoshgacha bo\'lgan yoshlar ssuda olish uchun ariza topshirishlari mumkin.',
    sortOrder: 1,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'faq-2',
    question: 'Ssuda miqdori qancha va u qancha muddatga beriladi?',
    answer: 'Ssuda miqdori BHMning 320 baravarigacha (130 mln so\'mgacha) etib belgilangan. Mablag\' 3 yil (36 oy) muddatga, foizsiz (0%) taqdim etiladi.',
    sortOrder: 2,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'faq-3',
    question: 'Ssuda qanday tartibda qaytariladi?',
    answer: 'Loyiha doirasida 6 oylik imtiyozli davr beriladi. Qolgan 30 oy davomida asosiy qarz teng qismlarga bo\'lingan holda qaytariladi.',
    sortOrder: 3,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'faq-4',
    question: 'O\'quv markazini istalgan hududda ochish mumkinmi?',
    answer: 'O\'quv markazlari respublikaning shahar va tuman markazlaridan uzoqda joylashgan, ta\'lim xizmatlariga ehtiyoj yuqori bo\'lgan olis hududlarda tashkil etilishi lozim.',
    sortOrder: 4,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'faq-5',
    question: 'Ariza topshirish uchun qanday hujjatlar talab etiladi?',
    answer: 'LIST:Shaxsni tasdiqlovchi hujjat (Pasport/ID karta)|Til bilish darajasini tasdiqlovchi sertifikat (C1)|YaTT yoki MChJ guvohnomasi|KATM kredit tarixi|Kafil yoki sug\'urta shartnomasi',
    sortOrder: 5,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'faq-6',
    question: 'Mablag\' ajratilishi necha kun vaqt oladi?',
    answer: 'Barcha hujjatlar to\'liq taqdim etilib, maxsus kengash tasdig\'idan o\'tgandan so\'ng, mablag\' 3 ish kuni ichida arizachining hisob raqamiga o\'tkazib beriladi.',
    sortOrder: 6,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'faq-7',
    question: 'Loyiha qaysi qonuniy asosga ko\'ra amalga oshiriladi?',
    answer: 'Mazkur loyiha va unga qo\'yilgan talablar O\'zbekiston Respublikasi Vazirlar Mahkamasining 426-sonli qarori bilan tartibga solinadi.',
    sortOrder: 7,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'faq-8',
    question: 'Loyiha doirasida ajratilgan mablag\'lardan qanday foydalanish kerak?',
    answer: 'Mablag\'lar faqat naqd pulsiz shaklda, hisob raqamidan o\'tkazish orqali maqsadli ishlatilishi shart. Naqdlashtirish imkoniyati mavjud emas.',
    sortOrder: 8,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'faq-9',
    question: 'Loyiha ishtirokchilariga qanday qo\'shimcha imkoniyatlar bor?',
    answer: 'Ssuda olgan yoshlar "Ko\'makchilar" hamjamiyatiga va "Ko\'mak+" yopiq guruhiga a\'zo bo\'lishadi. Bu yerda tajriba almashish, har oy o\'tkaziladigan onlayn va oflayn tadbirlarda ishtirok etish imkoniyati yaratiladi.',
    sortOrder: 9,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'faq-10',
    question: 'Arizani qayerda va qanday qoldirish mumkin?',
    answer: 'Hujjatlar va arizalar masofaviy tarzda yoshlarfondi.uz sayti orqali qabul qilinadi.',
    sortOrder: 10,
    isPublished: true,
    createdAt: new Date(),
  },
];

async function getFaqs(): Promise<FAQ[]> {
  try {
    const data = await db
      .select()
      .from(faqsTable)
      .where(eq(faqsTable.isPublished, true))
      .orderBy(asc(faqsTable.sortOrder));
    return data.length > 0 ? data : DEFAULT_FAQS;
  } catch (error) {
    console.error('Error fetching FAQs, returning fallback:', error);
    return DEFAULT_FAQS;
  }
}

export default async function FAQPage() {
  const faqsData = await getFaqs();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">
        <FAQSection faqs={faqsData} />
      </main>
      <Footer />
    </>
  );
}
