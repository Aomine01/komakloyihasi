import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { stats as statsTable } from '@/lib/schema';
import type { Stat } from '@/lib/types';
import StatisticsPage from '@/components/sections/StatisticsPage';

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
    <main className="min-h-screen bg-[#f0f4f8]" style={{ backgroundImage: 'radial-gradient(rgba(0, 104, 95, 0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <StatisticsPage stats={statsData} />
    </main>
  );
}
