import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: "Statistika | Ko'mak",
  description: "Statistika sahifasi tez kunda ishga tushadi.",
};

export default function StatistikaComingSoonPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[75vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 bg-[#f4f7f6]" style={{ backgroundImage: 'radial-gradient(rgba(0, 104, 95, 0.1) 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
        <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 p-10 md:p-14 max-w-2xl w-full flex flex-col items-center text-center backdrop-blur-sm bg-white/80">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8 shadow-inner">
            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>hourglass_top</span>
          </div>
          
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface mb-5">Tez kunda</h1>
          
          <p className="text-base md:text-lg text-on-surface-variant max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            Ko'mak loyihasining batafsil statistik ma'lumotlari ustida ishlamoqdamiz. Tez orada ushbu sahifa orqali barcha raqamlarni real vaqt rejimida kuzatishingiz mumkin bo'ladi.
          </p>
          
          <div className="inline-flex items-center gap-3 bg-surface-container-lowest px-5 py-2.5 rounded-full border border-outline-variant/20 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-bold text-on-surface uppercase tracking-wide">Jarayonda...</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
