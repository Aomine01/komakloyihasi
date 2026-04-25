import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import KomakchilarClient from '@/components/sections/KomakchilarClient';
import komakchilarData from '@/komakchilar-data.json';

export const metadata: Metadata = {
  title: "Loyihalar | Ko'mak",
  description:
    "Ko'mak loyihasi doirasida moliyalashtirilgan o'quv markazlari va ularning asoschilari. Viloyatlar bo'yicha saralang.",
  openGraph: {
    title: "Loyihalar | Ko'mak",
    description:
      "Ko'mak loyihasi doirasida moliyalashtirilgan o'quv markazlari va ularning asoschilari. Viloyatlar bo'yicha saralang.",
    url: "https://komakloyihasi.uz/loyihalar",
  },
};

export default function LoyihalarPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">
        <KomakchilarClient data={komakchilarData} />
      </main>
      <Footer />
    </>
  );
}
