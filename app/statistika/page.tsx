import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import StatisticsPage from '@/components/sections/StatisticsPage';

export const metadata: Metadata = {
  title: "Natijalar | Ko'mak",
  description: "Ko'mak loyihasining ochiq raqamlari va natijalari.",
};

export default function StatistikaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 min-h-screen bg-[#f4f7f6]">
        <StatisticsPage stats={[]} hideMoneyInfo={true} />
      </main>
      <Footer />
    </>
  );
}
