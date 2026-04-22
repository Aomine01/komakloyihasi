import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant/20 text-on-surface pt-12 pb-4 font-sans selection:bg-primary selection:text-on-primary relative overflow-hidden">
      
      {/* Subtle shape watermark */}
      <div className="absolute right-0 bottom-0 w-[50vw] h-[50vw] opacity-[0.04] pointer-events-none translate-x-1/4 translate-y-1/4">
        <Image src="/justshape.png" alt="Ko'mak Shape" fill className="object-contain" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col min-h-[500px] relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline/30 pb-4 mb-8">
          <div className="flex gap-4 font-bold text-sm tracking-tight text-on-surface-variant">
            <Link href="/faq" className="hover:underline underline-offset-4">Ko'mak loyihasi qoidalari</Link>
            <Link href="/loyihalar" className="hover:underline underline-offset-4">Ochiq Hisobotlar</Link>
          </div>
          <div className="flex gap-6 items-center mt-4 md:mt-0 font-bold text-sm tracking-tight">
            <span>Ijtimoiy tarmoqlarimiz</span>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-70 transition-opacity">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5.838a4.162 4.162 0 1 0 0 8.324 4.162 4.162 0 0 0 0-8.324zm0 6.822a2.66 2.66 0 1 1 0-5.32 2.66 2.66 0 0 1 0 5.32zm4.275-7.859a1.002 1.002 0 1 0 0 2.004 1.002 1.002 0 0 0 0-2.004z"/></svg>
              </a>
              <a href="https://t.me/komak_bot" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z M22 2 11 13" /></svg>
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M21.582 6.186a2.684 2.684 0 0 0-1.884-1.894C18.033 3.846 12 3.846 12 3.846s-6.033 0-7.698.446a2.684 2.684 0 0 0-1.884 1.894C2 7.868 2 12 2 12s0 4.132.418 5.814a2.684 2.684 0 0 0 1.884 1.894c1.665.446 7.698.446 7.698.446s6.033 0 7.698-.446a2.684 2.684 0 0 0 1.884-1.894C22 16.132 22 12 22 12s0-4.132-.418-5.814zM9.8 15.5V8.5L15.9 12l-6.1 3.5z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Content area: Links and Disclaimer */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-8 mb-12">
          
          {/* Columns (Left Half) */}
          <div className="xl:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-4 tracking-tight">Loyihalar</h3>
              <ul className="flex flex-col gap-2.5 text-[13px] font-semibold tracking-tight">
                <li><Link href="/loyihalar" className="hover:underline underline-offset-4">Barcha loyihalar</Link></li>
                <li><Link href="/statistika" className="hover:underline underline-offset-4">Statistika dashboard</Link></li>
                <li><Link href="/#hero" className="hover:underline underline-offset-4">Qarz olish tartibi</Link></li>
                <li><Link href="/faq" className="hover:underline underline-offset-4">Ko'p so'raladigan savollar</Link></li>
                <li><Link href="/#about" className="hover:underline underline-offset-4">O'quv markazlari xaritasi</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 tracking-tight">Tashkilot</h3>
              <ul className="flex flex-col gap-2.5 text-[13px] font-semibold tracking-tight">
                <li><Link href="/#about" className="hover:underline underline-offset-4">Biz haqimizda</Link></li>
                <li><Link href="#" className="hover:underline underline-offset-4">Yoshlar ishlari agentligi</Link></li>
                <li><Link href="#" className="hover:underline underline-offset-4">Hamkorlar</Link></li>
                <li><Link href="#" className="hover:underline underline-offset-4">OAV uchun</Link></li>
                <li><Link href="/aloqa" className="hover:underline underline-offset-4">Bog'lanish</Link></li>
                <li><Link href="#" className="hover:underline underline-offset-4">Ijtimoiy ekologiya (ESG)</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 tracking-tight">Huquqiy axborot</h3>
              <ul className="flex flex-col gap-2.5 text-[13px] font-semibold tracking-tight">
                <li><Link href="#" className="hover:underline underline-offset-4">Shartnoma shartlari</Link></li>
                <li><Link href="#" className="hover:underline underline-offset-4">Siyosat va xavfsizlik</Link></li>
                <li><Link href="#" className="hover:underline underline-offset-4">Ommaviy oferta</Link></li>
                <li><Link href="#" className="hover:underline underline-offset-4">Maxfiylik siyosati</Link></li>
                <li><Link href="#" className="hover:underline underline-offset-4 text-blue-800">Your Privacy Choices</Link></li>
              </ul>
            </div>
          </div>

          {/* Disclaimer (Right Half) */}
          <div className="xl:col-span-7 text-[10px] sm:text-[11px] font-semibold leading-relaxed space-y-3.5 opacity-90 max-w-4xl tracking-tight text-on-surface-variant">
            <h3 className="font-bold text-[13px] text-on-surface">Barcha moliyaviy operatsiyalar ma'lum xatarlar bilan bog'liq</h3>
            <p>
              Ko'mak xizmatlari "Ko'mak" NNT va O'zbekiston Yoshlar Fondi (dastur hammuassisi) tomonidan hududiy tadbirkorlikni rivojlantirish maqsadida taklif etiladi. Ajratilgan mablag'lar bo'yicha qo'shimcha foiz olinmasa-da, har bir hisob uchun shartnoma asosida jarima va komissiya to'lovlari qo'llanilishi mumkin. Iltimos, loyihada ishtirok etishdan oldin Ommaviy Oferta bilan batafsil tanishib chiqing.
            </p>
            <p>
              <b>Faoliyat hududi yoshlari portfoliosini shakllantirish</b> "Yoshlar Menedjmenti MChJ" (SIA a'zosi) orqali yuritiladi. Ko'mak operatsiyalari va filiallari davlat monopoliyasi yoki kafolati ostida ishlamaydi, moliyaviy barqarorlik faqat a'zolar mas'uliyati ostidadir.
            </p>
            <p>
              Ko'mak kartasi va hisobraqamlari ishtirokchi yoshlarning bank kafilligi orqali shakllantiriladi va barcha operatsiyalar vakolatli banklar (TBC, Ipak Yo'li, Kapitalbank va hh.) litsenziyalari asosida amalga oshiriladi. NNT bank xizmatlarini to'g'ridan-to'g'ri ko'rsatmaydi, barcha tranzaksiyalar hamkor dilerlar tomonidan o'tkaziladi.
            </p>
            <p>
              Qarz olish, maqsadli ishlatmaslik yoki belgilangan muddatda to'lamaslik yuridik harakatlarga hamda ishonchsizlik reytingiga olib kelishi mumkin. Tadbirkorlik faoliyati xavflarni o'z ichiga olib, rejalashtirilgan o'quv markazlari tijoriy daromad keltirmaslik ehtimolini ham inobatga olish lozim. Qatnashish oldidan barcha hujjatlar, jumladan <b>Sanoat va moliyaviy xavflar beyonnomasi</b>ni to'liq o'rganish tavsiya etiladi.
            </p>
            <p className="mt-8 pt-4">
              {new Date().getFullYear()} © Ko'mak loyihasi (O'zYoshlarFondi, O'zbekiston) Barcha huquqlar qat'iy himoyalangan.
            </p>
          </div>
        </div>

        {/* Giant Logo Text bottom */}
        <div className="mt-auto overflow-hidden w-full select-none pointer-events-none flex justify-center pt-8">
          <span 
            className="font-black text-on-surface block tracking-tighter" 
            style={{ 
              fontSize: '28vw', 
              lineHeight: '0.72',
              letterSpacing: '-0.06em',
              marginBottom: '-2vw'
            }}
          >
            ko'mak
          </span>
        </div>
      </div>
    </footer>
  );
}
