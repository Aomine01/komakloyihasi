'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Viloyat, Tuman } from '@/lib/types';
import ImageUpload from '@/components/ui/ImageUpload';
import { Loader2 } from 'lucide-react';

const LANGUAGE_OPTIONS = [
  'Ingliz tili', 'Rus tili', 'Nemis tili', 'Fransuz tili', 'Koreys tili',
  'Xitoy tili', 'Arab tili', 'Turk tili', 'Yapon tili', 'Ispan tili',
];

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [viloyatlar, setViloyatlar] = useState<Viloyat[]>([]);
  const [tumanlar, setTumanlar] = useState<Tuman[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: '', ownerName: '', description: '', loanAmount: '', studentsCount: '',
    tumanId: '', viloyatId: '', languages: [] as string[], photoUrl: null as string | null,
    isPublished: false, fundedAt: '',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/data?entity=viloyatlar').then((r) => r.json()),
      fetch(`/api/admin/data?entity=project&id=${projectId}`).then((r) => r.json()),
    ]).then(([vilRes, projRes]) => {
      setViloyatlar(vilRes.viloyatlar || []);

      if (projRes.project) {
        const p = projRes.project;
        const viloyatId = projRes.viloyatId || '';
        setForm({
          title: p.title || '', ownerName: p.ownerName || '', description: p.description || '',
          loanAmount: p.loanAmount?.toString() || '', studentsCount: p.studentsCount?.toString() || '',
          tumanId: p.tumanId || '', viloyatId,
          languages: p.languages || [], photoUrl: p.photoUrl,
          isPublished: p.isPublished, fundedAt: p.fundedAt || '',
        });
        if (viloyatId) {
          fetch(`/api/admin/data?entity=tumanlar&viloyat_id=${viloyatId}`).then((r) => r.json()).then((d) => setTumanlar(d.tumanlar || []));
        }
      }
      setLoading(false);
    });
  }, [projectId]);

  useEffect(() => {
    if (form.viloyatId && !loading) {
      fetch(`/api/admin/data?entity=tumanlar&viloyat_id=${form.viloyatId}`).then((r) => r.json()).then((d) => setTumanlar(d.tumanlar || []));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.viloyatId]);

  const toggleLang = (lang: string) => {
    setForm((f) => ({ ...f, languages: f.languages.includes(lang) ? f.languages.filter((l) => l !== lang) : [...f.languages, lang] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_project', id: projectId,
        title: form.title, ownerName: form.ownerName, description: form.description || null,
        loanAmount: form.loanAmount ? Number(form.loanAmount) : null,
        studentsCount: form.studentsCount ? Number(form.studentsCount) : null,
        tumanId: form.tumanId || null, languages: form.languages, photoUrl: form.photoUrl,
        isPublished: form.isPublished, fundedAt: form.fundedAt || null,
      }),
    });
    router.push('/admin/projects');
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Loyihani tahrirlash</h1>
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-on-surface-variant">Rasm</label>
          <ImageUpload value={form.photoUrl} onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Markaz nomi *</label>
          <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-[8px] bg-surface-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Tadbirkor ismi *</label>
          <input required value={form.ownerName} onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
            className="w-full rounded-[8px] bg-surface-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Tavsif</label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3} className="w-full resize-none rounded-[8px] bg-surface-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Viloyat</label>
            <select value={form.viloyatId} onChange={(e) => setForm((f) => ({ ...f, viloyatId: e.target.value, tumanId: '' }))}
              className="w-full rounded-[8px] bg-surface-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Tanlang</option>
              {viloyatlar.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Tuman</label>
            <select value={form.tumanId} onChange={(e) => setForm((f) => ({ ...f, tumanId: e.target.value }))}
              disabled={!form.viloyatId} className="w-full rounded-[8px] bg-surface-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
              <option value="">Tanlang</option>
              {tumanlar.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-on-surface-variant">Tillar</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button key={lang} type="button" onClick={() => toggleLang(lang)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${form.languages.includes(lang) ? 'bg-primary text-white' : 'bg-surface-low text-on-surface-variant hover:bg-surface'}`}>
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Ssuda miqdori (mln)</label>
            <input type="number" step="0.1" value={form.loanAmount} onChange={(e) => setForm((f) => ({ ...f, loanAmount: e.target.value }))}
              className="w-full rounded-[8px] bg-surface-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">O&apos;quvchilar soni</label>
            <input type="number" value={form.studentsCount} onChange={(e) => setForm((f) => ({ ...f, studentsCount: e.target.value }))}
              className="w-full rounded-[8px] bg-surface-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Moliyalashtirilgan sana</label>
          <input type="date" value={form.fundedAt} onChange={(e) => setForm((f) => ({ ...f, fundedAt: e.target.value }))}
            className="w-full rounded-[8px] bg-surface-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} className="h-5 w-5 rounded accent-primary" />
          <span className="text-sm text-on-surface">E&apos;lon qilingan</span>
        </label>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-medium text-white hover:shadow-lg disabled:opacity-60">
            {saving && <Loader2 className="animate-spin" size={16} />} Saqlash
          </button>
          <a href="/admin/projects" className="rounded-full border border-outline-variant/30 px-8 py-3 text-sm text-on-surface-variant hover:bg-surface-low">Bekor qilish</a>
        </div>
      </form>
    </div>
  );
}
