import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { stats as statsTable } from '@/lib/schema';
import type { Stat } from '@/lib/types';
import Navbar from '@/components/ui/Navbar';
import StatisticsPage from '@/components/sections/StatisticsPage';
import Footer from '@/components/sections/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Statistika | Ko'mak",
  description:
    "Ko'mak loyihasi bo'yicha ochiq statistik ma'lumotlar: ajratilgan qarzlar, o'quv markazlari soni, qamrab olingan talabalar va hududiy ko'rsatkichlar.",
  openGraph: {
    title: "Statistika | Ko'mak",
    description:
      "Ko'mak loyihasi bo'yicha ochiq statistik ma'lumotlar: ajratilgan qarzlar, o'quv markazlari soni, qamrab olingan talabalar va hududiy ko'rsatkichlar.",
    url: "https://komakloyihasi.uz/statistika",
  },
};

async function getStats(): Promise<Stat[]> {
  try {
    return await db.select().from(statsTable).orderBy(statsTable.key);
  } catch {
    return [];
  }
}

export default async function StatistikaPage() {
  const statsData = await getStats();

  return (
    <>
      <Navbar />
      <main>
        <StatisticsPage stats={statsData} />
      </main>
      <Footer />
    </>
  );
}
