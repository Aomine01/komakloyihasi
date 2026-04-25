import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import KomakchilarClient from '@/components/sections/KomakchilarClient';
import komakchilarData from '@/komakchilar-data.json';

export const metadata = {
  title: "Ko'makchilar | Ko'mak",
  description:
    "Ko'mak loyihasi doirasida moliyalashtirilgan o'quv markazlari va ularning asoschilari. Viloyatlar bo'yicha saralang.",
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
