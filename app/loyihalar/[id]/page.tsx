import { db } from '@/lib/db';
import { projects as projectsTable, tumanlar, viloyatlar } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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

    return result[0] ?? null;
  } catch {
    return null;
  }
}

export default async function KomakchiDetailPage({ params }: Props) {
  const data = await getProject(params.id);

  if (!data || !data.project.isPublished) return notFound();

  const { project, tuman, viloyat } = data;
  const gallery: string[] = (project.galleryUrls as string[]) ?? (project.photoUrl ? [project.photoUrl] : []);
  const documents: string[] = (project.documentUrls as string[]) ?? [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">

        {/* ─── HERO ───────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-40 pb-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#004f45] via-[#00685f] to-[#008378]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #84d5c5 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

          <div className="relative max-w-5xl mx-auto">
            {/* Back link */}
            <Link
              href="/loyihalar"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 group transition-colors"
            >
              <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Barcha ko&apos;makchilarga qaytish
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Photo */}
              <div className="w-full md:w-64 h-64 md:h-72 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 bg-white/10">
                {gallery[0] ? (
                  <Image
                    src={gallery[0]}
                    alt={project.ownerName}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="material-symbols-outlined text-white/40 text-8xl">person</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  {viloyat?.name ?? tuman?.name ?? 'Ko\'mak loyihasi'}
                </div>

                <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
                  {project.ownerName}
                </h1>
                <p className="text-white/70 text-lg mb-6">{project.title}</p>

                <div className="flex flex-wrap gap-4">
                  {project.studentsCount && (
                    <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5">
                      <span className="material-symbols-outlined text-white/80 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                      <div>
                        <p className="text-white font-bold text-lg leading-none">{project.studentsCount}</p>
                        <p className="text-white/55 text-xs">O&apos;quvchi</p>
                      </div>
                    </div>
                  )}
                  {project.loanAmount && (
                    <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5">
                      <span className="material-symbols-outlined text-white/80 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                      <div>
                        <p className="text-white font-bold text-lg leading-none">{project.loanAmount} mln</p>
                        <p className="text-white/55 text-xs">Ssuda</p>
                      </div>
                    </div>
                  )}
                  {tuman && (
                    <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5">
                      <span className="material-symbols-outlined text-white/80 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                      <div>
                        <p className="text-white font-bold text-base leading-none">{tuman.name}</p>
                        <p className="text-white/55 text-xs">Tuman</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DESCRIPTION ────────────────────────────────────────── */}
        {project.description && (
          <section className="max-w-5xl mx-auto px-6 py-12">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Loyiha haqida</h2>
            <p className="text-on-surface-variant leading-relaxed text-base max-w-3xl">{project.description}</p>
          </section>
        )}

        {/* ─── GALLERY ────────────────────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 py-12">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">
              Fotogalereya
              <span className="ml-2 text-base font-normal text-on-surface-variant">({gallery.length} ta)</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-sm hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={url}
                    alt={`${project.ownerName} — rasm ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-3xl drop-shadow-lg">
                      open_in_full
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ─── DOCUMENTS ──────────────────────────────────────────── */}
        {documents.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 py-12">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Hujjatlar</h2>
            <div className="flex flex-col gap-3">
              {documents.map((url, i) => {
                const fileName = decodeURIComponent(url.split('/').pop() ?? `Hujjat ${i + 1}`);
                return (
                  <a
                    key={i}
                    href={url}
                    download
                    className="flex items-center gap-4 bg-surface-container-lowest rounded-2xl px-6 py-4 shadow-sm hover:shadow-md border border-outline-variant/20 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        description
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{fileName}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Yuklab olish</p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors group-hover:translate-y-0.5 duration-200">
                      download
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── BACK CTA ───────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-br from-[#004f45] to-[#00685f] rounded-3xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-headline text-2xl font-bold text-white mb-1">Boshqa ko&apos;makchilarni ko&apos;ring</h3>
              <p className="text-white/60 text-sm">Barcha viloyatlar bo&apos;yicha loyihalarni filtrlang</p>
            </div>
            <Link
              href="/loyihalar"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-2xl hover:bg-white/90 transition-colors shrink-0 shadow-lg"
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
              Barcha ko&apos;makchilar
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
