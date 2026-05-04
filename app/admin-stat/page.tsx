import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { stats as statsTable } from '@/lib/schema';
import type { Stat } from '@/lib/types';
import Navbar from '@/components/ui/Navbar';
import StatisticsPage from '@/components/sections/StatisticsPage';
import Footer from '@/components/sections/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin Statistika | Ko'mak",
  description: "Ko'mak loyihasi bo'yicha yopiq statistik ma'lumotlar.",
};

async function getStats(): Promise<Stat[]> {
  try {
    return await db.select().from(statsTable).orderBy(statsTable.key);
  } catch {
    return [];
  }
}

export default async function AdminStatistikaPage() {
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
