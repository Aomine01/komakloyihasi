import { db } from '@/lib/db';
import { projects as projectsTable, tumanlar, viloyatlar } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import { notFound } from 'next/navigation';
import komakchilarData from '@/komakchilar-data.json';
import ProjectDetailClient from '@/components/sections/ProjectDetailClient';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getProject(params.id);
  if (!data || !data.project.isPublished) {
    return { title: 'Topilmadi' };
  }
  
  const title = `${data.project.ownerName} | Ko'mak Loyihasi`;
  const description = data.project.title || "Ko'mak loyihasi ishtirokchisi";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://komakloyihasi.uz/loyihalar/${params.id}`,
    }
  };
}
interface Props {
  params: { id: string };
}

async function getProject(id: string) {
  try {
    const result = await db
      .select({
        project: projectsTable,
        tuman: tumanlar,
        viloyat: viloyatlar,
      })
      .from(projectsTable)
      .leftJoin(tumanlar, eq(projectsTable.tumanId, tumanlar.id))
      .leftJoin(viloyatlar, eq(tumanlar.viloyatId, viloyatlar.id))
      .where(eq(projectsTable.id, id))
      .limit(1);

    if (result[0]) {
      return result[0];
    }
  } catch (dbError) {
    console.error('Error fetching project from DB, trying static JSON fallback:', dbError);
  }

  // Fallback to static JSON
  for (const vil of komakchilarData.viloyatlar) {
    const person = vil.people.find((p) => p.slug === id);
    if (person) {
      let loanAmount: number | null = null;
      let studentsCount: number | null = null;
      let title = "Ko'mak loyihasi ishtirokchisi";
      let tumanName = '';

      if (person.description) {
        const ssudaMatch = person.description.match(/SSUDA_MIQDORI:\s*([\d\s]+)/i);
        if (ssudaMatch) {
          const cleanNum = ssudaMatch[1].replace(/\s/g, '');
          loanAmount = Math.round(parseInt(cleanNum, 10) / 1000000);
        }

        const studentsMatch = person.description.match(/(\d+)\+?\s*o['`ʼ]quvchi/i);
        if (studentsMatch) {
          studentsCount = parseInt(studentsMatch[1], 10);
        }

        const lavozimMatch = person.description.match(/LAVOZIM:\s*([^\n]+)/i);
        if (lavozimMatch) {
          title = lavozimMatch[1].trim().replace(/^"|"$/g, '');
        }

        const tumanMatch = person.description.match(/([\w'‘ʼ]+)\s+tumani/i);
        if (tumanMatch) {
          tumanName = tumanMatch[1] + ' tumani';
        }
      }

      const gallery = (person.images || []).map((img) => `${person.imagePath}${img}`);

      return {
        project: {
          id: person.slug,
          ownerName: person.name,
          title: title,
          description: person.description,
          photoUrl: gallery[0] || null,
          galleryUrls: gallery,
          documentUrls: person.pdfUrl ? [person.pdfUrl] : [],
          studentsCount: studentsCount,
          loanAmount: loanAmount,
          isPublished: true,
          tumanId: tumanName ? 'fallback-tuman' : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        tuman: tumanName
          ? {
              id: 'fallback-tuman',
              name: tumanName,
              viloyatId: vil.slug,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          : null,
        viloyat: {
          id: vil.slug,
          name: vil.name,
          slug: vil.slug,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    }
  }

  return null;
}

export default async function KomakchiDetailPage({ params }: Props) {
  const data = await getProject(params.id);

  if (!data || !data.project.isPublished) return notFound();

  const { project, tuman, viloyat } = data;

  return (
    <>
      <Navbar />
      <ProjectDetailClient project={project} tuman={tuman} viloyat={viloyat} />
      <Footer />
    </>
  );
}
