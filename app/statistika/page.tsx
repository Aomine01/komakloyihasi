import { db } from '@/lib/db';
import { stats as statsTable } from '@/lib/schema';
import type { Stat } from '@/lib/types';
import Navbar from '@/components/ui/Navbar';
import StatisticsPage from '@/components/sections/StatisticsPage';
import Footer from '@/components/sections/Footer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Statistika | Ko'mak",
  description:
    "Ko'mak loyihasi bo'yicha ochiq statistik ma'lumotlar: ajratilgan qarzlar, o'quv markazlari soni, qamrab olingan talabalar va hududiy ko'rsatkichlar.",
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
      <main className="relative z-10 bg-surface rounded-b-[2.5rem] shadow-xl pb-10 min-h-screen">
        <StatisticsPage stats={statsData} />
      </main>
      <Footer />
    </>
  );
}
