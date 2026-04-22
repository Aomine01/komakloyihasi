import Link from 'next/link';
import Image from 'next/image';

const links = [
  { label: 'Loyiha haqida', href: '/#about' },
  { label: "Ko'makchilar", href: '/loyihalar' },
  { label: 'Statistika', href: '/statistika' },
  { label: 'FAQ', href: '/faq' },
  { label: "Bog'lanish", href: 'https://t.me/komakmentor' },
];

export default function Footer() {
  return (
    <footer className="bg-[#00685f] text-white pt-16 pb-8 font-sans selection:bg-white selection:text-[#00685f] relative overflow-hidden">
      
      {/* Giant Background Logo Text (Placed behind other texts) */}
      <div className="absolute left-0 bottom-[-4vw] right-0 w-full select-none pointer-events-none flex justify-center z-0">
        <span 
          className="font-black text-white/10 block tracking-tighter" 
          style={{ 
            fontSize: '32vw', 
            lineHeight: '0.75',
            letterSpacing: '-0.05em'
          }}
        >
          ko'mak
        </span>
      </div>

      {/* Subtle shape watermark */}
      <div className="absolute right-0 top-0 w-[40vw] h-[40vw] opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4 z-0">
        <Image src="/justshape.png" alt="Ko'mak Shape" fill className="object-contain" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col min-h-[350px] relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/20 pb-4 mb-10">
          <div className="flex gap-4 font-bold text-sm tracking-tight text-white/80">
            <Link href="/faq" className="hover:text-white transition-colors">Ko'mak loyihasi</Link>
            <Link href="/statistika" className="hover:text-white transition-colors">Ochiq Hisobotlar</Link>
          </div>
          <div className="flex gap-6 items-center mt-4 md:mt-0 font-bold text-sm tracking-tight text-white/80">
            <span>Ijtimoiy tarmoqlarimiz</span>
            <div className="flex gap-4 text-white">
              <a href="https://www.instagram.com/komak_loyihasi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="hover:opacity-75 transition-opacity">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5.838a4.162 4.162 0 1 0 0 8.324 4.162 4.162 0 0 0 0-8.324zm0 6.822a2.66 2.66 0 1 1 0-5.32 2.66 2.66 0 0 1 0 5.32zm4.275-7.859a1.002 1.002 0 1 0 0 2.004 1.002 1.002 0 0 0 0-2.004z"/></svg>
              </a>
              <a href="https://t.me/komak_loyihasi" target="_blank" rel="noreferrer" className="hover:opacity-75 transition-opacity">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z M22 2 11 13" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Real Links Area */}
          <div className="md:col-span-8 lg:col-span-6 grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-5">
                Sahifalar
              </p>
              <ul className="flex flex-col gap-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[15px] font-medium text-white/90 hover:text-white transition-colors flex items-center gap-1.5 group tracking-tight"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Real description Area */}
            <div>
               <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-5">
                  Loyiha maqsadi
               </p>
               <p className="text-[15px] font-medium leading-relaxed tracking-tight text-white/90 max-w-sm">
                 Chekka va olis hududlarda zamonaviy til o'quv markazlarini ochmoqchi yoshlarga — foizsiz ssuda, davlat ko'magi va yaxlit ekotizim.
               </p>
               
               <div className="mt-8 flex flex-col gap-1.5">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Homiylari</p>
                 <p className="text-[15px] font-semibold text-white">O'zbekiston Yoshlar Fondi</p>
               </div>
            </div>
          </div>

          {/* Copyright Area */}
          <div className="md:col-span-4 lg:col-span-6 flex flex-col justify-end md:text-right mt-16 md:mt-0">
             <span className="text-sm font-semibold tracking-tight text-white/60 mb-2">
               &copy; {new Date().getFullYear()} Ko'mak loyihasi. Barcha huquqlar himoyalangan.
             </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
