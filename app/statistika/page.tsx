import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { stats as statsTable } from '@/lib/schema';
import type { Stat } from '@/lib/types';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import nextDynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Natijalar | Ko'mak",
  description: "Ko'mak loyihasining ochiq raqamlari va natijalari.",
};

const StatisticsPage = nextDynamic(
  () => import('@/components/sections/StatisticsPage'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex flex-col gap-6 px-6 py-10 max-w-7xl mx-auto animate-pulse">
        {/* Hero skeleton */}
        <div className="h-10 w-1/3 bg-surface-container-high rounded-xl" />
        <div className="h-6 w-1/2 bg-surface-container-high rounded-xl" />
        {/* KPI cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-surface-container-high rounded-2xl" />
          ))}
        </div>
        {/* Map + panel skeleton */}
        <div className="h-96 bg-surface-container-high rounded-2xl mt-2" />
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-surface-container-high rounded-2xl" />
          ))}
        </div>
      </div>
    ),
  }
);

async function getStats(): Promise<Stat[]> {
  try {
    return await db.select().from(statsTable).orderBy(statsTable.key);
  } catch (error) {
    console.error('Error fetching stats from DB, using empty fallback array:', error);
    return [];
  }
}

export default async function StatistikaPage() {
  const statsData = await getStats();

  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 min-h-screen bg-[#f4f7f6]">
        <StatisticsPage stats={statsData} hideMoneyInfo={true} />
      </main>
      <Footer />
    </>
  );
}
