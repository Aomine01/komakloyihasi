'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import type { Viloyat } from '@/lib/types';

const schema = z.object({
  full_name: z.string().min(3, 'Kamida 3 ta belgi'),
  phone: z.string().regex(/^\+998[0-9]{9}$/, 'Format: +998XXXXXXXXX'),
  region: z.string().optional(),
  message: z.string().max(500, 'Maksimum 500 ta belgi').optional(),
});

type FormData = z.infer<typeof schema>;

const contactInfo = [
  { icon: 'call', text: '+998 71 200 06 02' },
  { icon: 'mail', text: 'komak@yoshlarfondi.uz' },
  { icon: 'location_on', text: 'Toshkent sh., Yunusobod tumani' },
  { icon: 'schedule', text: 'Du–Ju: 9:00 – 18:00' },
];

export default function CallbackForm({
  viloyatlar,
}: {
  viloyatlar: Viloyat[];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Could show error toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="boglanish" className="bg-surface py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-medium text-sm mb-6 tracking-wide">
            <span className="material-symbols-outlined text-sm">support_agent</span>
            Bog&apos;lanish
          </span>
          <h2 className="font-headline text-4xl font-extrabold text-on-surface leading-tight tracking-tight">
            Mutaxassis aloqasi
          </h2>
          <p className="mt-4 font-body text-lg text-on-surface-variant max-w-xl">
            Sizga qulay vaqtda mutaxassisimiz qo&apos;ng&apos;iroq qiladi va barcha savollaringizga batafsil javob beradi.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Contact info cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {contactInfo.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-5 border border-outline-variant/20 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">
                    {item.icon}
                  </span>
                </div>
                <span className="font-body text-base text-on-surface">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 rounded-3xl bg-surface-container-lowest p-8 md:p-10 shadow-ambient border border-outline-variant/15">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center min-h-[360px] text-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                    <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface mb-3">
                    Arizangiz qabul qilindi!
                  </h3>
                  <p className="font-body text-lg text-on-surface-variant max-w-sm">
                    Rahmat! Mutaxassislarimiz tez orada ko&apos;rsatilgan raqam orqali bog&apos;lanishadi.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full name */}
                    <div>
                      <label className="mb-2 block font-body text-sm font-medium text-on-surface-variant">
                        To&apos;liq ismingiz *
                      </label>
                      <input
                        {...register('full_name')}
                        placeholder="Ism va familiya"
                        className="w-full rounded-xl bg-surface-container px-4 py-3.5 font-body text-base text-on-surface border border-transparent outline-none transition-all placeholder:text-on-surface-variant/50 focus:bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                      {errors.full_name && (
                        <p className="mt-1.5 text-xs text-error font-medium">
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-2 block font-body text-sm font-medium text-on-surface-variant">
                        Telefon raqam *
                      </label>
                      <input
                        {...register('phone')}
                        placeholder="+998"
                        className="w-full rounded-xl bg-surface-container px-4 py-3.5 font-body text-base text-on-surface border border-transparent outline-none transition-all placeholder:text-on-surface-variant/50 focus:bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-xs text-error font-medium">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Region */}
                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-on-surface-variant">
                      Viloyatingiz
                    </label>
                    <select
                      {...register('region')}
                      className="w-full rounded-xl bg-surface-container px-4 py-3.5 font-body text-base text-on-surface border border-transparent outline-none transition-all focus:bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%233d4947%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.2em_1.2em]"
                    >
                      <option value="">Hududni tanlang</option>
                      {viloyatlar.map((v) => (
                        <option key={v.id} value={v.name}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-on-surface-variant">
                      Qo&apos;shimcha xabar
                    </label>
                    <textarea
                      {...register('message')}
                      rows={4}
                      placeholder="Qanday savollaringiz bor layk? (ixtiyoriy)"
                      className="w-full resize-y rounded-xl bg-surface-container px-4 py-3.5 font-body text-base text-on-surface border border-transparent outline-none transition-all placeholder:text-on-surface-variant/50 focus:bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-error font-medium">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-on-primary transition-all hover:bg-primary/90 disabled:opacity-70 shadow-sm hover:shadow-md"
                  >
                    {submitting ? (
                      <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>sync</span>
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>send</span>
                    )}
                    {submitting ? 'Yuborilmoqda...' : 'Sorov qoldirish'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
