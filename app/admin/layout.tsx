'use client';

import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  HelpCircle,
  PhoneCall,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { SessionProvider } from 'next-auth/react';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Loyihalar', href: '/admin/projects', icon: FolderOpen },
  { label: 'FAQ', href: '/admin/faqs', icon: HelpCircle },
  { label: 'Murojaatlar', href: '/admin/callbacks', icon: PhoneCall },
  { label: 'Statistika', href: '/admin/stats', icon: BarChart3 },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const userEmail = session?.user?.email || '';

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[240px] transform border-r border-outline-variant/15 bg-surface-lowest transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 px-6">
          <span className="font-display text-lg font-bold text-primary">
            Ko&apos;mak
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-medium text-primary">
            Admin
          </span>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-on-surface-variant hover:bg-surface-low'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-low"
          >
            <LogOut size={18} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-outline-variant/15 bg-surface-lowest px-4 lg:px-8">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden text-sm text-on-surface-variant lg:block">
            Boshqaruv paneli
          </div>
          <div className="text-sm text-on-surface-variant">{userEmail}</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
