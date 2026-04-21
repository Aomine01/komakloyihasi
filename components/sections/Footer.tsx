export default function Footer() {
  return (
    <footer className="bg-surface w-full pt-16 pb-8">
      <div className="bg-gradient-to-t from-primary-container/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6 border-t border-outline-variant/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
              <span className="text-xl font-bold text-primary font-headline">Ko‘mak</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 font-body text-sm leading-relaxed">
              <a className="text-on-surface-variant hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4" href="#about">Loyiha haqida</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4" href="#">Xizmat ko‘rsatish shartlari</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4" href="#">Maxfiylik siyosati</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4" href="#">Ochiq ma&apos;lumotlar</a>
            </nav>
          </div>
          <div className="mt-8 text-center md:text-left text-on-surface-variant font-body text-sm leading-relaxed">
            © {new Date().getFullYear()} Ko‘mak. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </div>
    </footer>
  );
}
