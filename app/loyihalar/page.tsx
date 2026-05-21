import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import KomakchilarClient from '@/components/sections/KomakchilarClient';
import komakchilarData from '@/komakchilar-data.json';
import { db } from '@/lib/db';
import { projects as projectsTable, tumanlar, viloyatlar } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

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

async function getKomakchilarData() {
  try {
    const rows = await db
      .select({
        project: projectsTable,
        tuman: tumanlar,
        viloyat: viloyatlar,
      })
      .from(projectsTable)
      .leftJoin(tumanlar, eq(projectsTable.tumanId, tumanlar.id))
      .leftJoin(viloyatlar, eq(tumanlar.viloyatId, viloyatlar.id))
      .where(eq(projectsTable.isPublished, true));

    if (!rows || rows.length === 0) {
      return komakchilarData;
    }

    // Group rows by viloyat
    const viloyatMap = new Map<string, { name: string; slug: string; people: any[] }>();

    for (const row of rows) {
      const { project, tuman, viloyat } = row;
      if (!viloyat) continue;

      if (!viloyatMap.has(viloyat.id)) {
        viloyatMap.set(viloyat.id, {
          name: viloyat.name,
          slug: viloyat.slug,
          people: [],
        });
      }

      const vObj = viloyatMap.get(viloyat.id)!;
      const gallery = (project.galleryUrls as string[]) ?? [];
      const images = gallery.length > 0 ? gallery : (project.photoUrl ? [project.photoUrl] : []);

      vObj.people.push({
        name: project.ownerName,
        slug: project.id, // using project.id as slug so details page works
        featured: true,
        description: project.description,
        images: images,
        imagePath: '', // absolute paths in images
        pdfUrl: (project.documentUrls as string[])?.[0] || null,
      });
    }

    return {
      viloyatlar: Array.from(viloyatMap.values()),
    };
  } catch (error) {
    console.error('Error fetching projects from DB, falling back to static JSON:', error);
    return komakchilarData;
  }
}

export default async function LoyihalarPage() {
  const data = await getKomakchilarData();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">
        <KomakchilarClient data={data} />
      </main>
      <Footer />
    </>
  );
}
