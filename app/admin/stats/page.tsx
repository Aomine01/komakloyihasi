'use client';

import { useState, useEffect } from 'react';
import type { Stat } from '@/lib/types';
import { Save, Loader2 } from 'lucide-react';

export default function AdminStats() {
  const [statsList, setStatsList] = useState<Stat[]>([]);
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState<Record<string, { value: string; labelUz: string }>>({});

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    const res = await fetch('/api/admin/data?entity=stats');
    const data = await res.json();
    const items: Stat[] = data.stats || [];
    setStatsList(items);
    const init: Record<string, { value: string; labelUz: string }> = {};
    items.forEach((s) => { init[s.id] = { value: String(s.value), labelUz: s.labelUz }; });
    setEdited(init);
  }

  function handleChange(id: string, field: 'value' | 'labelUz', val: string) {
    setEdited((prev) => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  }

  async function handleSave() {
    setSaving(true);
    await fetch('/api/admin/data', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_stats', items: Object.entries(edited).map(([id, v]) => ({ id, ...v })) }),
    });
    setSaving(false);
    loadStats();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-on-surface">Statistika</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white hover:shadow-lg disabled:opacity-60">
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Saqlash
        </button>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {statsList.map((stat) => (
          <div key={stat.id} className="rounded-[12px] bg-surface-lowest p-6 shadow-float">
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">{stat.key}</div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm text-on-surface-variant">Qiymat</label>
                <input type="number" step="0.1" value={edited[stat.id]?.value || ''} onChange={(e) => handleChange(stat.id, 'value', e.target.value)}
                  className="w-full rounded-[8px] bg-surface-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-on-surface-variant">Sarlavha (UZ)</label>
                <input value={edited[stat.id]?.labelUz || ''} onChange={(e) => handleChange(stat.id, 'labelUz', e.target.value)}
                  className="w-full rounded-[8px] bg-surface-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
