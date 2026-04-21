'use client';

import { useEffect, useState } from 'react';
import type { Project } from '@/lib/types';
import { Plus, Trash2, Eye, EyeOff, Search, GraduationCap } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  async function fetchProjects() {
    const params = new URLSearchParams({ entity: 'projects', page: String(page) });
    if (search) params.set('search', search);
    const res = await fetch(`/api/admin/data?${params}`);
    const data = await res.json();
    setProjects(data.projects || []);
  }

  async function togglePublish(id: string, current: boolean) {
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_publish', id, isPublished: current }),
    });
    fetchProjects();
  }

  async function deleteProject(id: string, photoUrl?: string | null) {
    if (!confirm("Loyihani o'chirish?")) return;
    if (photoUrl) {
      await fetch('/api/admin/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: photoUrl }),
      });
    }
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_project', id }),
    });
    fetchProjects();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-on-surface">Loyihalar</h1>
        <a
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={16} /> Yangi loyiha
        </a>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Qidirish..."
            className="w-full rounded-[8px] bg-surface-lowest py-2.5 pl-10 pr-4 text-sm shadow-float outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-[12px] bg-surface-lowest shadow-float">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-low">
            <tr>
              <th className="px-4 py-3 font-medium text-on-surface-variant">Rasm</th>
              <th className="px-4 py-3 font-medium text-on-surface-variant">Nomi</th>
              <th className="px-4 py-3 font-medium text-on-surface-variant">Tadbirkor</th>
              <th className="px-4 py-3 font-medium text-on-surface-variant">Holat</th>
              <th className="px-4 py-3 font-medium text-on-surface-variant">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-outline-variant/15">
                <td className="px-4 py-3">
                  {p.photoUrl ? (
                    <img src={p.photoUrl} alt="" className="h-10 w-14 rounded-[4px] object-cover" />
                  ) : (
                    <div className="flex h-10 w-14 items-center justify-center rounded-[4px] bg-surface-low">
                      <GraduationCap size={16} className="text-on-surface-variant" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-on-surface">{p.title}</td>
                <td className="px-4 py-3 text-on-surface-variant">{p.ownerName}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    p.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {p.isPublished ? 'Faol' : 'Qoralama'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePublish(p.id, p.isPublished!)}
                      className="rounded-[8px] p-2 text-on-surface-variant hover:bg-surface-low"
                    >
                      {p.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <a href={`/admin/projects/${p.id}/edit`} className="rounded-[8px] p-2 text-primary hover:bg-primary/10">✏️</a>
                    <button onClick={() => deleteProject(p.id, p.photoUrl)} className="rounded-[8px] p-2 text-red-500 hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-on-surface-variant">Loyihalar topilmadi</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
          className="rounded-[8px] px-4 py-2 text-sm text-on-surface-variant disabled:opacity-40 hover:bg-surface-lowest">← Oldingi</button>
        <span className="px-3 py-2 text-sm text-on-surface-variant">Sahifa {page + 1}</span>
        <button onClick={() => setPage(page + 1)} disabled={projects.length < PAGE_SIZE}
          className="rounded-[8px] px-4 py-2 text-sm text-on-surface-variant disabled:opacity-40 hover:bg-surface-lowest">Keyingi →</button>
      </div>
    </div>
  );
}
