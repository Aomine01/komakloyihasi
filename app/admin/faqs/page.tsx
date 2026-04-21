'use client';

import { useState, useEffect } from 'react';
import type { FAQ } from '@/lib/types';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, Save, Eye, EyeOff, Loader2 } from 'lucide-react';

function SortableFAQItem({ faq, onUpdate, onDelete, onTogglePublish }: {
  faq: FAQ; onUpdate: (id: string, q: string, a: string) => void;
  onDelete: (id: string) => void; onTogglePublish: (id: string, current: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: faq.id });
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState(faq.question);
  const [a, setA] = useState(faq.answer);
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="rounded-[12px] bg-surface-lowest p-4 shadow-float">
      <div className="flex items-start gap-3">
        <button {...attributes} {...listeners} className="mt-1 cursor-grab text-on-surface-variant hover:text-primary"><GripVertical size={18} /></button>
        <div className="flex-1">
          {editing ? (
            <div className="space-y-3">
              <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-[8px] bg-surface-low px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              <textarea value={a} onChange={(e) => setA(e.target.value)} rows={3} className="w-full resize-none rounded-[8px] bg-surface-low px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              <div className="flex gap-2">
                <button onClick={() => { onUpdate(faq.id, q, a); setEditing(false); }} className="rounded-full bg-primary px-4 py-1.5 text-xs text-white">Saqlash</button>
                <button onClick={() => { setQ(faq.question); setA(faq.answer); setEditing(false); }} className="rounded-full border border-outline-variant/30 px-4 py-1.5 text-xs text-on-surface-variant">Bekor</button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-display text-sm font-semibold text-on-surface">{faq.question}</p>
              <p className="mt-1 text-xs text-on-surface-variant line-clamp-2">{faq.answer}</p>
            </>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <button onClick={() => onTogglePublish(faq.id, faq.isPublished!)} className="rounded-[8px] p-2 text-on-surface-variant hover:bg-surface-low">
            {faq.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          {!editing && <button onClick={() => setEditing(true)} className="rounded-[8px] p-2 text-primary hover:bg-primary/10 text-xs">✏️</button>}
          <button onClick={() => onDelete(faq.id)} className="rounded-[8px] p-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}

export default function AdminFAQs() {
  const [faqList, setFaqList] = useState<FAQ[]>([]);
  const [saving, setSaving] = useState(false);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { loadFaqs(); }, []);

  async function loadFaqs() {
    const res = await fetch('/api/admin/data?entity=faqs');
    const data = await res.json();
    setFaqList(data.faqs || []);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setFaqList((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  async function saveOrder() {
    setSaving(true);
    await fetch('/api/admin/data', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_faq_order', items: faqList.map((f, i) => ({ id: f.id, sortOrder: i + 1 })) }),
    });
    setSaving(false);
  }

  async function handleUpdate(id: string, q: string, a: string) {
    await fetch('/api/admin/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update_faq', id, question: q, answer: a }) });
    loadFaqs();
  }
  async function handleDelete(id: string) {
    if (!confirm("O'chirish?")) return;
    await fetch('/api/admin/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete_faq', id }) });
    loadFaqs();
  }
  async function handleTogglePublish(id: string, current: boolean) {
    await fetch('/api/admin/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'toggle_faq_publish', id, isPublished: current }) });
    loadFaqs();
  }
  async function handleAdd() {
    if (!newQ || !newA) return;
    await fetch('/api/admin/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add_faq', question: newQ, answer: newA, sortOrder: faqList.length + 1 }) });
    setNewQ(''); setNewA(''); setShowAdd(false); loadFaqs();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-on-surface">FAQ boshqaruvi</h1>
        <div className="flex gap-2">
          <button onClick={saveOrder} disabled={saving} className="flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white hover:shadow-lg disabled:opacity-60">
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Tartibni saqlash
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 rounded-full border border-outline-variant/30 px-5 py-2.5 text-sm text-on-surface-variant hover:bg-surface-low">
            <Plus size={14} /> Yangi
          </button>
        </div>
      </div>
      {showAdd && (
        <div className="mt-6 rounded-[12px] bg-surface-lowest p-6 shadow-float">
          <h3 className="text-sm font-semibold text-on-surface">Yangi savol qo&apos;shish</h3>
          <input value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="Savol" className="mt-3 w-full rounded-[8px] bg-surface-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
          <textarea value={newA} onChange={(e) => setNewA(e.target.value)} placeholder="Javob" rows={3} className="mt-3 w-full resize-none rounded-[8px] bg-surface-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
          <div className="mt-3 flex gap-2">
            <button onClick={handleAdd} className="rounded-full bg-primary px-5 py-2 text-sm text-white">Qo&apos;shish</button>
            <button onClick={() => setShowAdd(false)} className="rounded-full border border-outline-variant/30 px-5 py-2 text-sm text-on-surface-variant">Bekor</button>
          </div>
        </div>
      )}
      <div className="mt-6 space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={faqList.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {faqList.map((faq) => (
              <SortableFAQItem key={faq.id} faq={faq} onUpdate={handleUpdate} onDelete={handleDelete} onTogglePublish={handleTogglePublish} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
