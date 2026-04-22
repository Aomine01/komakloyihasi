import { db } from '@/lib/db';
import { viloyatlar as viloyatlarTable, projects as projectsTable } from '@/lib/schema';
import { sql, eq } from 'drizzle-orm';
import Navbar from '@/components/ui/Navbar';
import KomakchilarPage from '@/components/sections/KomakchilarPage';
import Footer from '@/components/sections/Footer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Ko'makchilar | Ko'mak",
  description:
    "Ko'mak loyihasi doirasida moliyalashtirilgan o'quv markazlari katalogi. Hududlar bo'yicha saralang va muvaffaqiyatli loyihalar bilan tanishing.",
};

async function getViloyatlarWithCounts() {
  try {
    const result = await db
      .select({
        ...viloyatlarTable,
        count: sql<number>`COUNT(DISTINCT ${projectsTable.id})`.as('count'),
      })
      .from(viloyatlarTable)
      .leftJoin(
        projectsTable,
        sql`${projectsTable.tumanId} IN (
          SELECT id FROM tumanlar WHERE viloyat_id = ${viloyatlarTable.id}
        ) AND ${projectsTable.isPublished} = true`
      )
      .groupBy(viloyatlarTable.id, viloyatlarTable.name, viloyatlarTable.slug)
      .orderBy(viloyatlarTable.name);
    return result;
  } catch {
    return [];
  }
}

async function getTotalStats() {
  try {
    const result = await db
      .select({
        totalProjects: sql<number>`COUNT(*)`,
        totalStudents: sql<number>`COALESCE(SUM(${projectsTable.studentsCount}), 0)`,
      })
      .from(projectsTable)
      .where(eq(projectsTable.isPublished, true));
    return result[0] ?? { totalProjects: 0, totalStudents: 0 };
  } catch {
    return { totalProjects: 0, totalStudents: 0 };
  }
}

export default async function LoyihalarPage() {
  const [viloyatlarData, stats] = await Promise.all([
    getViloyatlarWithCounts(),
    getTotalStats(),
  ]);

  return (
    <>
      <Navbar />
      <main className="relative z-10 bg-surface rounded-b-[2.5rem] shadow-xl pb-10 min-h-screen">
        <KomakchilarPage
          viloyatlar={viloyatlarData}
          totalProjects={Number(stats.totalProjects)}
          totalStudents={Number(stats.totalStudents)}
        />
      </main>
      <Footer />
    </>
  );
}
