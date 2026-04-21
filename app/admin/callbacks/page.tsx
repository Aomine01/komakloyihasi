'use client';

import { useState, useEffect } from 'react';
import type { Callback } from '@/lib/types';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Yangi', color: 'bg-primary/10 text-primary' },
  { value: 'contacted', label: "Bog'lanildi", color: 'bg-yellow-100 text-yellow-700' },
  { value: 'closed', label: 'Yopildi', color: 'bg-green-100 text-green-700' },
];

export default function AdminCallbacks() {
  const [callbackList, setCallbackList] = useState<Callback[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { loadCallbacks(); }, [filterStatus]);

  async function loadCallbacks() {
    const params = new URLSearchParams({ entity: 'callbacks' });
    if (filterStatus) params.set('status', filterStatus);
    const res = await fetch(`/api/admin/data?${params}`);
    const data = await res.json();
    setCallbackList(data.callbacks || []);
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/data', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_callback_status', id, status }),
    });
    loadCallbacks();
  }

  function exportCSV() {
    const headers = ['Ism', 'Telefon', 'Viloyat', 'Xabar', 'Holat', 'Sana'];
    const rows = callbackList.map((cb) => [
      cb.fullName, cb.phone, cb.region || '', (cb.message || '').replace(/"/g, '""'),
      cb.status, new Date(cb.createdAt!).toLocaleDateString('uz-UZ'),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `murojaatlar_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click(); URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-on-surface">Murojaatlar</h1>
        <div className="flex gap-2">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-[8px] bg-surface-lowest px-4 py-2.5 text-sm shadow-float outline-none">
            <option value="">Barcha holatlar</option>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={exportCSV} className="flex items-center gap-2 rounded-full border border-outline-variant/30 px-5 py-2.5 text-sm text-on-surface-variant hover:bg-surface-low">
            <Download size={14} /> CSV
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[12px] bg-surface-lowest shadow-float">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-low">
            <tr>
              <th className="px-4 py-3 font-medium text-on-surface-variant">Ism</th>
              <th className="px-4 py-3 font-medium text-on-surface-variant">Telefon</th>
              <th className="px-4 py-3 font-medium text-on-surface-variant">Viloyat</th>
              <th className="px-4 py-3 font-medium text-on-surface-variant">Holat</th>
              <th className="px-4 py-3 font-medium text-on-surface-variant">Sana</th>
              <th className="px-4 py-3 font-medium text-on-surface-variant"></th>
            </tr>
          </thead>
          <tbody>
            {callbackList.map((cb) => (
              <tr key={cb.id} className="border-t border-outline-variant/15">
                <td className="px-4 py-3 font-medium text-on-surface">{cb.fullName}</td>
                <td className="px-4 py-3 text-on-surface-variant">{cb.phone}</td>
                <td className="px-4 py-3 text-on-surface-variant">{cb.region || '—'}</td>
                <td className="px-4 py-3">
                  <select value={cb.status || 'new'} onChange={(e) => updateStatus(cb.id, e.target.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium outline-none ${STATUS_OPTIONS.find((s) => s.value === cb.status)?.color || ''}`}>
                    {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{new Date(cb.createdAt!).toLocaleDateString('uz-UZ')}</td>
                <td className="px-4 py-3">
                  {cb.message && (
                    <button onClick={() => setExpandedId(expandedId === cb.id ? null : cb.id)} className="text-primary hover:text-primary-container">
                      {expandedId === cb.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {callbackList.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-on-surface-variant">Murojaatlar topilmadi</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
