import Link from 'next/link';
import Image from 'next/image';

const links = [
  { label: 'Loyiha haqida', href: '/#about' },
  { label: "Ko'makchilar", href: '/loyihalar' },
  { label: 'Statistika', href: '/statistika' },
  { label: 'FAQ', href: '/faq' },
  { label: "Bog'lanish", href: '/aloqa' },
];

export default function Footer() {
  return (
    <footer className="bg-surface-dim border-t border-outline-variant/15">

      {/* Top wave accent */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary-container to-secondary opacity-60" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">

          {/* Brand block */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center group mb-4">
              <div className="relative w-36 h-12 transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src="/logo.svg" 
                  alt="Ko'mak Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Chekka va olis hududlarda zamonaviy til o&apos;quv markazlarini ochmoqchi
              yoshlarga — foizsiz ssuda, davlat ko&apos;magi va yaxlit ekotizim.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://t.me/komak_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#229ED9] text-white text-sm
                           font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="m22 2-7 20-4-9-9-4Z M22 2 11 13" />
                </svg>
                Telegram bot
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">
              Sahifalar
            </p>
            <ul className="flex flex-col gap-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-on-surface-variant hover:text-primary
                               transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline group-hover:bg-primary transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Badge */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1">
              Homiylari
            </p>
            <div className="inline-flex items-center gap-2 bg-surface-container-low rounded-2xl px-5 py-4 max-w-xs">
              <span
                className="material-symbols-outlined text-primary text-2xl shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance
              </span>
              <div>
                <p className="font-semibold text-on-surface text-sm leading-tight">
                  O&apos;zbekiston Yoshlar Fondi
                </p>
                <p className="text-on-surface-variant text-xs mt-0.5">Davlat ko&apos;magi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-outline-variant/15 flex flex-col md:flex-row
                        items-center justify-between gap-3 text-xs text-on-surface-variant">
          <span>
            &copy; {new Date().getFullYear()} Ko&apos;mak Yoshlar Ta&apos;lim Loyihasi.
            Barcha huquqlar himoyalangan.
          </span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-colors">Maxfiylik siyosati</a>
            <a href="#" className="hover:text-primary transition-colors">Foydalanish shartlari</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
