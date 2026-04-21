import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  projects,
  viloyatlar,
  tumanlar,
  faqs,
  callbacks,
  stats,
} from '@/lib/schema';
import { eq, like, desc, sql, and, inArray } from 'drizzle-orm';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const entity = searchParams.get('entity');

  // ── Dashboard ──
  if (entity === 'dashboard') {
    const [projCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
    const [cbCount] = await db.select({ count: sql<number>`count(*)` }).from(callbacks);
    const [newCbCount] = await db.select({ count: sql<number>`count(*)` }).from(callbacks).where(eq(callbacks.status, 'new'));
    const recentCb = await db.select().from(callbacks).orderBy(desc(callbacks.createdAt)).limit(5);

    return NextResponse.json({
      projectCount: Number(projCount.count),
      callbackCount: Number(cbCount.count),
      newCallbackCount: Number(newCbCount.count),
      recentCallbacks: recentCb,
    });
  }

  // ── Projects list ──
  if (entity === 'projects') {
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page') || '0');
    const pageSize = 20;

    if (search) {
      const data = await db.select().from(projects).where(like(projects.title, `%${search}%`)).orderBy(desc(projects.createdAt)).limit(pageSize).offset(page * pageSize);
      return NextResponse.json({ projects: data });
    }
    const data = await db.select().from(projects).orderBy(desc(projects.createdAt)).limit(pageSize).offset(page * pageSize);
    return NextResponse.json({ projects: data });
  }

  // ── Single project (for edit page) ──
  if (entity === 'project') {
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Get viloyat_id from tuman
    let viloyatId = '';
    if (project.tumanId) {
      const [tuman] = await db.select().from(tumanlar).where(eq(tumanlar.id, project.tumanId));
      if (tuman) viloyatId = tuman.viloyatId;
    }
    return NextResponse.json({ project, viloyatId });
  }

  // ── Viloyatlar ──
  if (entity === 'viloyatlar') {
    const data = await db.select().from(viloyatlar).orderBy(viloyatlar.name);
    return NextResponse.json({ viloyatlar: data });
  }

  // ── Tumanlar for viloyat ──
  if (entity === 'tumanlar') {
    const viloyatId = searchParams.get('viloyat_id');
    if (!viloyatId) return NextResponse.json({ tumanlar: [] });
    const data = await db.select().from(tumanlar).where(eq(tumanlar.viloyatId, viloyatId)).orderBy(tumanlar.name);
    return NextResponse.json({ tumanlar: data });
  }

  // ── FAQs ──
  if (entity === 'faqs') {
    const data = await db.select().from(faqs).orderBy(faqs.sortOrder);
    return NextResponse.json({ faqs: data });
  }

  // ── Callbacks ──
  if (entity === 'callbacks') {
    const filterStatus = searchParams.get('status') || '';
    let data;
    if (filterStatus) {
      data = await db.select().from(callbacks).where(eq(callbacks.status, filterStatus)).orderBy(desc(callbacks.createdAt));
    } else {
      data = await db.select().from(callbacks).orderBy(desc(callbacks.createdAt));
    }
    return NextResponse.json({ callbacks: data });
  }

  // ── Stats ──
  if (entity === 'stats') {
    const data = await db.select().from(stats).orderBy(stats.key);
    return NextResponse.json({ stats: data });
  }

  return NextResponse.json({ error: 'Invalid entity' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { action } = body;

  // ── Create project ──
  if (action === 'create_project') {
    const { title, ownerName, description, loanAmount, studentsCount, tumanId, languages, photoUrl, isPublished, fundedAt } = body;
    await db.insert(projects).values({
      title,
      ownerName,
      description: description || null,
      loanAmount: loanAmount || null,
      studentsCount: studentsCount || null,
      tumanId: tumanId || null,
      languages: languages?.length > 0 ? languages : null,
      photoUrl: photoUrl || null,
      isPublished: isPublished ?? false,
      fundedAt: fundedAt || null,
    });
    return NextResponse.json({ ok: true });
  }

  // ── Update project ──
  if (action === 'update_project') {
    const { id, title, ownerName, description, loanAmount, studentsCount, tumanId, languages, photoUrl, isPublished, fundedAt } = body;
    await db.update(projects).set({
      title,
      ownerName,
      description: description || null,
      loanAmount: loanAmount || null,
      studentsCount: studentsCount || null,
      tumanId: tumanId || null,
      languages: languages?.length > 0 ? languages : null,
      photoUrl: photoUrl || null,
      isPublished: isPublished ?? false,
      fundedAt: fundedAt || null,
    }).where(eq(projects.id, id));
    return NextResponse.json({ ok: true });
  }

  // ── Toggle publish ──
  if (action === 'toggle_publish') {
    const { id, isPublished } = body;
    await db.update(projects).set({ isPublished: !isPublished }).where(eq(projects.id, id));
    return NextResponse.json({ ok: true });
  }

  // ── Delete project ──
  if (action === 'delete_project') {
    const { id } = body;
    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ ok: true });
  }

  // ── FAQ operations ──
  if (action === 'add_faq') {
    const { question, answer, sortOrder } = body;
    await db.insert(faqs).values({ question, answer, sortOrder: sortOrder || 0 });
    return NextResponse.json({ ok: true });
  }

  if (action === 'update_faq') {
    const { id, question, answer } = body;
    await db.update(faqs).set({ question, answer }).where(eq(faqs.id, id));
    return NextResponse.json({ ok: true });
  }

  if (action === 'delete_faq') {
    const { id } = body;
    await db.delete(faqs).where(eq(faqs.id, id));
    return NextResponse.json({ ok: true });
  }

  if (action === 'toggle_faq_publish') {
    const { id, isPublished } = body;
    await db.update(faqs).set({ isPublished: !isPublished }).where(eq(faqs.id, id));
    return NextResponse.json({ ok: true });
  }

  if (action === 'save_faq_order') {
    const { items } = body as { items: { id: string; sortOrder: number }[] };
    for (const item of items) {
      await db.update(faqs).set({ sortOrder: item.sortOrder }).where(eq(faqs.id, item.id));
    }
    return NextResponse.json({ ok: true });
  }

  // ── Callback status ──
  if (action === 'update_callback_status') {
    const { id, status } = body;
    await db.update(callbacks).set({ status }).where(eq(callbacks.id, id));
    return NextResponse.json({ ok: true });
  }

  // ── Stats update ──
  if (action === 'update_stats') {
    const { items } = body as { items: { id: string; value: string; labelUz: string }[] };
    for (const item of items) {
      await db.update(stats).set({ value: item.value, labelUz: item.labelUz }).where(eq(stats.id, item.id));
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
