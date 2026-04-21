import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { viloyatlar, tumanlar, projects } from '@/lib/schema';
import { eq, and, inArray, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  // Get all viloyatlar with project counts
  if (action === 'viloyatlar') {
    const vils = await db.select().from(viloyatlar).orderBy(viloyatlar.name);
    const counts = await db
      .select({
        viloyatId: tumanlar.viloyatId,
        count: sql<number>`count(*)`.as('count'),
      })
      .from(projects)
      .innerJoin(tumanlar, eq(projects.tumanId, tumanlar.id))
      .where(eq(projects.isPublished, true))
      .groupBy(tumanlar.viloyatId);

    const countMap: Record<string, number> = {};
    counts.forEach((c) => {
      countMap[c.viloyatId] = Number(c.count);
    });

    return NextResponse.json({
      viloyatlar: vils,
      counts: countMap,
    });
  }

  // Get tumanlar for a viloyat
  if (action === 'tumanlar') {
    const viloyatId = searchParams.get('viloyat_id');
    if (!viloyatId) return NextResponse.json({ tumanlar: [] });

    const tums = await db
      .select()
      .from(tumanlar)
      .where(eq(tumanlar.viloyatId, viloyatId))
      .orderBy(tumanlar.name);
    return NextResponse.json({ tumanlar: tums });
  }

  // Get projects for a viloyat or tuman
  if (action === 'projects') {
    const tumanId = searchParams.get('tuman_id');
    const viloyatId = searchParams.get('viloyat_id');

    if (tumanId) {
      const projs = await db
        .select()
        .from(projects)
        .where(and(eq(projects.tumanId, tumanId), eq(projects.isPublished, true)))
        .orderBy(projects.createdAt);
      return NextResponse.json({ projects: projs });
    }

    if (viloyatId) {
      const tums = await db
        .select({ id: tumanlar.id })
        .from(tumanlar)
        .where(eq(tumanlar.viloyatId, viloyatId));
      const tumIds = tums.map((t) => t.id);
      if (tumIds.length === 0) return NextResponse.json({ projects: [] });

      const projs = await db
        .select()
        .from(projects)
        .where(and(inArray(projects.tumanId, tumIds), eq(projects.isPublished, true)))
        .orderBy(projects.createdAt);
      return NextResponse.json({ projects: projs });
    }

    return NextResponse.json({ projects: [] });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
