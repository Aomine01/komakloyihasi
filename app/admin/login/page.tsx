'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/admin/dashboard');
    } else {
      setError("Email yoki parol noto'g'ri");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[12px] bg-surface-lowest p-8 shadow-float">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
              <span className="font-display text-lg font-bold text-white">K</span>
            </div>
            <h1 className="mt-4 font-display text-xl font-bold text-on-surface">
              Ko&apos;mak Admin
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Boshqaruv paneliga kirish
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[0.875rem] font-medium text-on-surface-variant">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[8px] bg-surface-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.875rem] font-medium text-on-surface-variant">
                Parol
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-[8px] bg-surface-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-white transition-shadow hover:shadow-lg disabled:opacity-60"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              Kirish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
