import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import nextDynamic from 'next/dynamic';
import komakchilarData from '@/komakchilar-data.json';
import { db } from '@/lib/db';
import { projects as projectsTable, tumanlar, viloyatlar as viloyatlarTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// Lazy-load all below-the-fold sections — ssr:false keeps them out of the
// initial JS bundle entirely; the server still sends the skeleton HTML.
const HowItWorks = nextDynamic(() => import('@/components/sections/HowItWorks'), {
  ssr: false,
  loading: () => <div className="min-h-[60vh] bg-surface-container-low animate-pulse" />,
});
const FeaturedKomakchilar = nextDynamic(() => import('@/components/sections/FeaturedKomakchilar'), {
  ssr: false,
  loading: () => <div className="min-h-[60vh] bg-surface-container-low animate-pulse" />,
});
const Asoschilar = nextDynamic(() => import('@/components/sections/Asoschilar'), {
  ssr: false,
  loading: () => <div className="min-h-[40vh] bg-surface animate-pulse" />,
});
const Footer = nextDynamic(() => import('@/components/sections/Footer'), {
  ssr: false,
  loading: () => <div className="min-h-[30vh] bg-surface-container-low animate-pulse" />,
});

export const dynamic = 'force-dynamic';

async function getKomakchilarData() {
  try {
    const rows = await db
      .select({
        project: projectsTable,
        tuman: tumanlar,
        viloyat: viloyatlarTable,
      })
      .from(projectsTable)
      .leftJoin(tumanlar, eq(projectsTable.tumanId, tumanlar.id))
      .leftJoin(viloyatlarTable, eq(tumanlar.viloyatId, viloyatlarTable.id))
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

export default async function HomePage() {
  const projectsData = await getKomakchilarData();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedKomakchilar data={projectsData} />
        <Asoschilar />
      </main>
      <Footer />
    </>
  );
}
