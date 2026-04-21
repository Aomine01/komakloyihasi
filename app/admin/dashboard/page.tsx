'use client';

import { useEffect, useState } from 'react';
import { FolderOpen, PhoneCall, BarChart3, Plus } from 'lucide-react';
import type { Callback } from '@/lib/types';

export default function AdminDashboard() {
  const [projectCount, setProjectCount] = useState(0);
  const [callbackCount, setCallbackCount] = useState(0);
  const [newCallbackCount, setNewCallbackCount] = useState(0);
  const [recentCallbacks, setRecentCallbacks] = useState<Callback[]>([]);

  useEffect(() => {
    fetch('/api/admin/data?entity=dashboard')
      .then((r) => r.json())
      .then((data) => {
        setProjectCount(data.projectCount || 0);
        setCallbackCount(data.callbackCount || 0);
        setNewCallbackCount(data.newCallbackCount || 0);
        setRecentCallbacks(data.recentCallbacks || []);
      });
  }, []);

  const cards = [
    { label: 'Loyihalar', value: projectCount, icon: FolderOpen, href: '/admin/projects' },
    { label: 'Barcha murojaatlar', value: callbackCount, icon: PhoneCall, href: '/admin/callbacks' },
    { label: 'Yangi murojaatlar', value: newCallbackCount, icon: BarChart3, href: '/admin/callbacks' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-on-surface">Dashboard</h1>
        <a
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white hover:shadow-lg"
        >
          <Plus size={16} />
          Yangi loyiha
        </a>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.label}
              href={card.href}
              className="rounded-[12px] bg-surface-lowest p-6 shadow-float transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <Icon className="text-primary" size={22} />
                <span className="font-display text-3xl font-bold text-on-surface">
                  {card.value}
                </span>
              </div>
              <p className="mt-2 text-sm text-on-surface-variant">{card.label}</p>
            </a>
          );
        })}
      </div>

      {/* Recent callbacks */}
      <div className="mt-10">
        <h2 className="font-display text-lg font-bold text-on-surface">
          So&apos;nggi murojaatlar
        </h2>
        <div className="mt-4 overflow-hidden rounded-[12px] bg-surface-lowest shadow-float">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-low">
              <tr>
                <th className="px-4 py-3 font-medium text-on-surface-variant">Ism</th>
                <th className="px-4 py-3 font-medium text-on-surface-variant">Telefon</th>
                <th className="px-4 py-3 font-medium text-on-surface-variant">Holat</th>
                <th className="px-4 py-3 font-medium text-on-surface-variant">Sana</th>
              </tr>
            </thead>
            <tbody>
              {recentCallbacks.map((cb) => (
                <tr key={cb.id} className="border-t border-outline-variant/15">
                  <td className="px-4 py-3 text-on-surface">{cb.fullName}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{cb.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        cb.status === 'new'
                          ? 'bg-primary/10 text-primary'
                          : cb.status === 'contacted'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {cb.status === 'new' ? 'Yangi' : cb.status === 'contacted' ? "Bog'lanildi" : 'Yopildi'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {new Date(cb.createdAt!).toLocaleDateString('uz-UZ')}
                  </td>
                </tr>
              ))}
              {recentCallbacks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-on-surface-variant">
                    Hozircha murojaatlar yo&apos;q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
