import { db } from '@/lib/db';
import { faqs as faqsTable } from '@/lib/schema';
import type { FAQ } from '@/lib/types';
import Navbar from '@/components/ui/Navbar';
import FAQSection from '@/components/sections/FAQ';
import Footer from '@/components/sections/Footer';
import { eq, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

async function getFaqs(): Promise<FAQ[]> {
  try {
    return await db
      .select()
      .from(faqsTable)
      .where(eq(faqsTable.isPublished, true))
      .orderBy(asc(faqsTable.sortOrder));
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export default async function FAQPage() {
  const faqsData = await getFaqs();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">
        <FAQSection faqs={faqsData} />
      </main>
      <Footer />
    </>
  );
}
