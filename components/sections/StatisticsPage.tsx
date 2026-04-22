'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import type { Stat } from '@/lib/types';

/* ────────────────────────── helpers ────────────────────────── */
function useCounter(target: number, inView: boolean, duration = 1.8) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return controls.stop;
  }, [inView, target, duration]);
  return value;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: 'easeOut' },
  }),
};

/* ────────────────────────── static data ────────────────────── */
const YILLAR = ['2025-2026', '2026', '2025'];

// Monthly data per region (simulated for dynamics)
const MONTHLY_DATA: Record<string, number[]> = {
  Hammasi: [12, 19, 28, 41, 38, 55, 62, 74, 68, 83, 91, 107],
  default: [1, 1, 2, 2, 2, 3, 2, 3, 4, 1, 0, 0],
};

const MONTHS_SHORT = ['Yan','Fev','Mar','Apr','May','Iyun','Iyul','Avg','Sen','Okt','Noy','Dek'];

const PIE_DATA = [
  { label: "Jihozlash va ta'mirlash", pct: 40, color: '#00685f' },
  { label: "O'quv resurslari", pct: 30, color: '#008378' },
  { label: 'Texnologiyalar', pct: 20, color: '#006e2d' },
  { label: 'Boshqalar', pct: 10, color: '#b3c5ff' },
];

const REGION_ROWS = [
  { viloyat: "Qoraqalpog'iston Res.", loyihalar: 47, mablag: 5980, erkak: 23, ayol: 24 },
  { viloyat: 'Andijon viloyati', loyihalar: 48, mablag: 6150, erkak: 31, ayol: 17 },
  { viloyat: 'Buxoro viloyati', loyihalar: 89, mablag: 11480, erkak: 36, ayol: 53 },
  { viloyat: 'Jizzax viloyati', loyihalar: 40, mablag: 5190, erkak: 30, ayol: 10 },
  { viloyat: 'Qashqadaryo viloyati', loyihalar: 80, mablag: 10180, erkak: 46, ayol: 34 },
  { viloyat: 'Navoiy viloyati', loyihalar: 41, mablag: 5330, erkak: 16, ayol: 25 },
  { viloyat: 'Namangan viloyati', loyihalar: 45, mablag: 5584, erkak: 35, ayol: 10 },
  { viloyat: 'Samarqand viloyati', loyihalar: 63, mablag: 8130, erkak: 41, ayol: 22 },
  { viloyat: 'Sirdaryo viloyati', loyihalar: 10, mablag: 1300, erkak: 6, ayol: 4 },
  { viloyat: 'Surxondaryo viloyati', loyihalar: 79, mablag: 10230, erkak: 49, ayol: 30 },
  { viloyat: 'Toshkent viloyati', loyihalar: 40, mablag: 5021, erkak: 31, ayol: 9 },
  { viloyat: "Farg'ona viloyati", loyihalar: 55, mablag: 7030, erkak: 34, ayol: 21 },
  { viloyat: 'Xorazm viloyati', loyihalar: 63, mablag: 8070, erkak: 30, ayol: 33 },
].sort((a,b) => b.loyihalar - a.loyihalar);

const GEO_NAME_TO_REGION: Record<string, string> = {
  'Tashkent': 'Toshkent viloyati',
  'Samarkand': 'Samarqand viloyati',
  'Bukhoro': 'Buxoro viloyati',
  'Ferghana': "Farg'ona viloyati",
  'Navoi': 'Navoiy viloyati',
  'Andijon': 'Andijon viloyati',
  'Namangan': 'Namangan viloyati',
  'Kashkadarya': 'Qashqadaryo viloyati',
  'Surkhandarya': 'Surxondaryo viloyati',
  'Sirdaryo': 'Sirdaryo viloyati',
  'Jizzakh': 'Jizzax viloyati',
  'Khorezm': 'Xorazm viloyati',
  'Karakalpakstan': "Qoraqalpog'iston Res."
};

// GeoJSON id-based override: used when two features share the same name
const GEO_ID_TO_REGION: Record<string, string> = {
  'UZTO': 'Toshkent viloyati',
  'UZTK': 'Toshkent shahri',
};

const INITIAL_MAP_CENTER: [number, number] = [64.6, 41.6];
const INITIAL_MAP_ZOOM = 1;

const REGION_CENTERS: Record<string, [number, number]> = {
  'Hammasi': INITIAL_MAP_CENTER,
  'Toshkent viloyati': [69.9, 41.4],
  'Toshkent shahri': [69.27, 41.3],
  'Samarqand viloyati': [66.4, 39.8],
  'Buxoro viloyati': [63.6, 40.2],
  "Farg'ona viloyati": [71.5, 40.4],
  'Navoiy viloyati': [64.1, 42.4],
  'Andijon viloyati': [72.5, 40.7],
  'Namangan viloyati': [71.0, 41.0],
  'Qashqadaryo viloyati': [66.5, 38.6],
  'Surxondaryo viloyati': [67.8, 38.0],
  'Sirdaryo viloyati': [68.7, 40.4],
  'Jizzax viloyati': [67.6, 40.3],
  'Xorazm viloyati': [60.6, 41.3],
  "Qoraqalpog'iston Res.": [59.0, 43.5]
};

const CARD_COLORS = [
  { bg: 'bg-primary/10', icon: 'text-primary', ring: 'ring-primary/20' },
  { bg: 'bg-secondary/10', icon: 'text-secondary', ring: 'ring-secondary/20' },
  { bg: 'bg-tertiary/10', icon: 'text-tertiary', ring: 'ring-tertiary/20' },
  { bg: 'bg-primary-container/30', icon: 'text-primary-container', ring: 'ring-primary-container/20' },
];

/* ────────────────────────── sub-components ──────────────────── */

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const count = useCounter(value, inView);
  return <span ref={ref}>{count.toLocaleString('uz-UZ').replace(/,/g, ' ')}{suffix}</span>;
}

function KPICard({
  icon,
  label,
  value,
  unit,
  sub,
  trend,
  colorIdx,
  delay,
}: {
  icon: string;
  label: string;
  value: number;
  unit?: string;
  sub: string;
  trend?: string;
  colorIdx: number;
  delay?: number;
}) {
  const c = CARD_COLORS[colorIdx % CARD_COLORS.length];
  return (
    <motion.div
      custom={delay ?? 0}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeUp}
      className={`relative bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-ambient overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,104,95,0.15)]`}
    >
      {/* decorative blob */}
      <div className={`absolute -right-8 -top-8 w-36 h-36 rounded-full ${c.bg} blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none`} />
      <div className="relative z-10">
        <div className={`inline-flex p-3 rounded-xl ${c.bg} ring-1 ${c.ring} mb-4`}>
          <span className={`material-symbols-outlined ${c.icon}`} style={{ fontVariationSettings: "'FILL' 1", fontSize: '26px' }}>
            {icon}
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1">{label}</p>
        <p className="font-headline text-4xl font-extrabold text-on-surface leading-none mb-1">
          <AnimatedCounter value={value} />
          {unit && <span className="text-2xl ml-1 text-primary">{unit}</span>}
        </p>
        <p className="text-sm text-on-surface-variant">{sub}</p>
        {trend && (
          <div className="mt-3 flex items-center gap-1.5 text-secondary text-xs font-medium">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            {trend}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} className="h-52 flex items-end gap-1 sm:gap-1.5">
      {data.map((v, i) => {
        const h = max > 0 ? (v / max) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer relative">
            <div className="relative w-full">
              {/* tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-[10px] font-semibold py-1 px-2 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                {v} ta
              </div>
              <motion.div
                className="w-full rounded-t-md bg-primary/70 group-hover:bg-primary transition-all"
                initial={{ height: 0 }}
                animate={inView ? { height: `${h * 0.52 + 4}px` } : { height: 0 }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: 'easeOut' }}
                style={{ minHeight: 4 }}
              />
            </div>
            <span className="text-[9px] sm:text-[10px] text-on-surface-variant">{MONTHS_SHORT[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

function PieChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  // build conic-gradient stops
  let cumulative = 0;
  const stops = PIE_DATA.map((d) => {
    const start = cumulative;
    cumulative += d.pct;
    return `${d.color} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <div ref={ref} className="flex flex-col sm:flex-row items-center justify-center gap-8">
      <div className="relative w-44 h-44 shrink-0">
        <motion.div
          className="w-full h-full rounded-full"
          style={{ background: `conic-gradient(${stops})` }}
          initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="absolute inset-5 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-inner">
          <div className="text-center">
            <span className="block font-headline font-extrabold text-xl text-on-surface">100%</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">Jami mablag'</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {PIE_DATA.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-on-surface-variant">{d.label}</span>
            <span className="ml-auto text-sm font-semibold text-on-surface">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenderBar({ label, count, pct, delay, isFemale }: { label: string; count: number; pct: number; delay: number; isFemale?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center bg-surface-container/50 px-2 py-1 rounded-md">
        <div className="flex items-center gap-2">
           <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
             {isFemale ? 'woman' : 'man'}
           </span>
           <span className="text-sm font-bold text-on-surface">{label}</span>
        </div>
        <span className="text-sm font-extrabold text-primary">{count} nafar</span>
      </div>
      <div className="h-3 bg-surface-container rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={`h-full ${isFemale ? 'bg-gradient-to-r from-secondary to-secondary-container' : 'bg-gradient-to-r from-primary to-primary-container'} rounded-full`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ delay: delay * 0.1, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant text-right">{pct}% ulush</p>
    </div>
  );
}

/* ────────────────────────── main component ──────────────────── */
export default function StatisticsPage({ stats }: { stats: Stat[] }) {
  const [activeViloyat, setActiveViloyat] = useState('Hammasi');
  const [activeYil, setActiveYil] = useState('2025-2026');
  const [showAllRows, setShowAllRows] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState('');
  const [mapPosition, setMapPosition] = useState({ center: INITIAL_MAP_CENTER, zoom: INITIAL_MAP_ZOOM });
  
  // Smoothly animate between map regions
  const animateMapTo = (targetCenter: [number, number], targetZoom: number) => {
    const startCenter = mapPosition.center;
    const startZoom = mapPosition.zoom;

    animate(0, 1, {
      duration: 0.75,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (progress) => {
        const currentZoom = startZoom + (targetZoom - startZoom) * progress;
        const currentX = startCenter[0] + (targetCenter[0] - startCenter[0]) * progress;
        const currentY = startCenter[1] + (targetCenter[1] - startCenter[1]) * progress;
        setMapPosition({ center: [currentX, currentY], zoom: currentZoom });
      }
    });
  };

  // Handlers for Map
  const toggleRegion = (geoName: string) => {
    const region = GEO_NAME_TO_REGION[geoName] || geoName;
    if (activeViloyat === region) {
       setActiveViloyat('Hammasi');
       animateMapTo(INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM);
    } else {
       setActiveViloyat(region);
       animateMapTo(REGION_CENTERS[region] || INITIAL_MAP_CENTER, 2.5);
    }
  };

  const monthlyData = MONTHLY_DATA[activeViloyat] ?? MONTHLY_DATA.default;
  const filteredRows = activeViloyat === 'Hammasi' 
    ? REGION_ROWS 
    : REGION_ROWS.filter(r => r.viloyat.startsWith(activeViloyat));
  const tableRows = showAllRows ? filteredRows : filteredRows.slice(0, 5);

  let globalLoyiha = 700;
  let globalSumma = 89675;
  let globalErkak = 408;
  let globalAyol = 292;
  
  if (activeViloyat === 'Hammasi') {
     if (activeYil === '2025') {
        globalLoyiha = 126; globalSumma = 16126; globalErkak = 87; globalAyol = 39;
     } else if (activeYil === '2026') {
        globalLoyiha = 574; globalSumma = 73549; globalErkak = 321; globalAyol = 253;
     }
  }

  const activeRegionData = activeViloyat !== 'Hammasi' 
    ? REGION_ROWS.find(r => r.viloyat.startsWith(activeViloyat))
    : null;

  // If a specific region is selected but has no data (e.g. Toshkent shahri), 
  // it should show 0 instead of falling back to global totals.
  const currentErkak = activeViloyat === 'Hammasi' ? globalErkak : (activeRegionData?.erkak || 0);
  const currentAyol = activeViloyat === 'Hammasi' ? globalAyol : (activeRegionData?.ayol || 0);
  const currentLoyiha = activeViloyat === 'Hammasi' ? globalLoyiha : (activeRegionData?.loyihalar || 0);
  const currentMablag = activeViloyat === 'Hammasi' ? globalSumma : (activeRegionData?.mablag || 0);

  const genderData = [
    { label: 'Erkaklar', count: currentErkak, pct: currentLoyiha > 0 ? Math.round((currentErkak/currentLoyiha)*100) : 0 },
    { label: 'Xotin-qizlar', count: currentAyol, pct: currentLoyiha > 0 ? Math.round((currentAyol/currentLoyiha)*100) : 0 }
  ];

  const kpiCards = [
    {
      icon: 'check_circle',
      label: "Ruxsat berilgan loyihalar",
      value: currentLoyiha,
      unit: 'ta',
      sub: activeViloyat !== 'Hammasi' ? `${activeViloyat}da` : "Jami o'rganilgan loyihalar",
      trend: "Muvaffaqiyatli moliyalashtirilgan",
      colorIdx: 1,
    },
    {
      icon: 'account_balance',
      label: "Ajratilgan mablag'lar",
      value: currentMablag,
      unit: 'mln',
      sub: activeViloyat !== 'Hammasi' ? "Hudud uchun" : "Jami ajratilgan ko'mak",
      trend: "So'm miqdorida tasdiqlangan",
      colorIdx: 0,
    },
    {
      icon: 'man',
      label: 'Erkak mijozlar',
      value: currentErkak,
      unit: 'nafar',
      sub: "Moliyaviy ko'mak olgan yigitlar",
      trend: genderData[0].pct + "% umumiy ulush",
      colorIdx: 2,
    },
    {
      icon: 'woman',
      label: 'Ayol mijozlar',
      value: currentAyol,
      unit: 'nafar',
      sub: "Moliyaviy ko'mak olgan xotin-qizlar",
      trend: genderData[1].pct + "% umumiy ulush",
      colorIdx: 3,
    },
  ];

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative pt-28 pb-10 px-6 overflow-hidden">
        {/* background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border border-primary/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Tezkor ma'lumot
            </span>
          </motion.div>
          <motion.h1
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight mb-4"
          >
            Ko&apos;mak Loyihasi <br />
            <span className="gradient-text">Statistikasi</span>
          </motion.h1>

          {/* quick-stat strip */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {[
              { label: "So'nggi yangilanish", value: '20.04.2026' },
              { label: "Ma'lumotlar manbasi", value: 'Yoshlar Fondi' },
              { label: 'Hisobot davri', value: '2025–2026' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-surface-container-lowest rounded-xl px-4 py-3 border border-outline-variant/20 shadow-ambient">
                <span className="material-symbols-outlined text-primary text-base shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold truncate">{item.label}</p>
                  <p className="text-sm font-semibold text-on-surface">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── KPI Cards ── */}
      <section className="px-6 max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpiCards.map((card, i) => (
            <KPICard key={card.label} {...card} delay={i} />
          ))}
        </div>
      </section>

      {/* ── Regional Map (Now acts as the main filter, placed near top) ── */}
      <section className="px-6 max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="lg:col-span-2 bg-[#f4f7f6] rounded-2xl border border-outline-variant/20 shadow-[inset_0_4px_24px_rgba(0,104,95,0.05)] overflow-hidden relative flex flex-col min-h-[300px] sm:min-h-[400px]"
          >
            {/* Map Header */}
            <div className="px-6 pt-6 pb-2 flex justify-between items-start z-10 pointer-events-none border-b border-outline-variant/10">
                <div>
                    <h2 className="font-headline text-2xl font-bold text-on-surface">Hududiy Qamrov</h2>
                    <p className="text-sm text-on-surface-variant mt-1">Xaritadagi hududlarni tanlab ma'lumotlarni filtrlang.</p>
                </div>
            </div>

            {/* Context Tooltip for Mouse Hover */}
            {hoveredRegion && (
              <div
                className="absolute z-50 bg-inverse-surface text-inverse-on-surface text-xs font-semibold px-3 py-2 rounded-lg shadow-xl pointer-events-none transition-opacity duration-200"
                style={{ top: '80px', left: '24px' }}
              >
                {hoveredRegion}
              </div>
            )}

            {/* Reset Map Selection Button */}
            {activeViloyat !== 'Hammasi' && (
              <button 
                onClick={() => { setActiveViloyat('Hammasi'); animateMapTo(INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM); }}
                className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-sm hover:bg-surface-container-high text-primary text-sm font-semibold px-4 py-2 rounded-xl shadow border border-primary/20 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Barchasini ko'rsatish
              </button>
            )}
            
            <div 
              className="flex-1 relative overflow-hidden" 
              style={{ backgroundImage: 'radial-gradient(rgba(0, 104, 95, 0.15) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
            >
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ scale: 1800, center: [65.0, 41.5] }}
                  width={800}
                  height={400}
                  className="w-full h-full"
                >
                  <ZoomableGroup 
                    center={mapPosition.center} 
                    zoom={mapPosition.zoom} 
                    onMoveEnd={(pos) => setMapPosition({ center: pos.coordinates as [number, number], zoom: pos.zoom })}
                    maxZoom={5}
                  >
                    <Geographies geography="/uz (1).json">
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const geoId = geo.properties.id as string;
                          const geoName = geo.properties.name as string;
                          // Use id-based lookup first (handles Tashkent city vs viloyat)
                          const mappedViloyatName = GEO_ID_TO_REGION[geoId] ?? GEO_NAME_TO_REGION[geoName] ?? geoName;
                          const isActive = activeViloyat === mappedViloyatName;
                          const regionDataMock = REGION_ROWS.find(r => r.viloyat === mappedViloyatName);
                          // Toshkent shahri gets a slightly different shade to distinguish it
                          const isToshkentCity = geoId === 'UZTK';

                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onMouseEnter={() => {
                                 setHoveredRegion(mappedViloyatName + (regionDataMock ? ` — ${regionDataMock.loyihalar} loyiha` : ''));
                              }}
                              onMouseLeave={() => setHoveredRegion('')}
                              onClick={() => {
                                const region = mappedViloyatName;
                                if (activeViloyat === region) {
                                  setActiveViloyat('Hammasi');
                                  animateMapTo(INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM);
                                } else {
                                  setActiveViloyat(region);
                                  animateMapTo(REGION_CENTERS[region] || INITIAL_MAP_CENTER, 2.5);
                                }
                              }}
                              style={{
                                default: {
                                  fill: isActive ? '#006e2d' : isToshkentCity ? '#a8bab7' : '#bcc9c6',
                                  stroke: '#ffffff',
                                  strokeWidth: isToshkentCity ? 1 : 1.5,
                                  outline: 'none',
                                  transition: 'all 250ms',
                                },
                                hover: {
                                  fill: isActive ? '#006e2d' : '#89f5e7',
                                  stroke: '#00685f',
                                  strokeWidth: 1.5,
                                  outline: 'none',
                                  cursor: 'pointer',
                                },
                                pressed: {
                                  fill: '#005320',
                                  stroke: '#ffffff',
                                  outline: 'none',
                                },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
            </div>
          </motion.div>

          {/* Side region list (Scorecard) */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-ambient p-6 flex flex-col gap-3 overflow-y-auto"
            style={{ maxHeight: 400 }}
          >
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="font-body font-bold text-on-surface text-lg leading-tight">Holat</h3>
                    <p className="text-xs text-on-surface-variant font-medium">{activeViloyat === 'Hammasi' ? 'Respublika bo\'yicha' : activeViloyat + ' hududi'}</p>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-3">
                {filteredRows.map((row, i) => {
                  const maxLoyiha = REGION_ROWS[0].loyihalar;
                  const fillPct = Math.round((row.loyihalar / maxLoyiha) * 100);
                  return (
                    <div key={row.viloyat} className="group cursor-pointer" onClick={() => {
                        const rv = row.viloyat.split(' ')[0];
                        setActiveViloyat(rv);
                        animateMapTo(REGION_CENTERS[rv] || INITIAL_MAP_CENTER, 2.5);
                      }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                              i === 0
                                ? 'bg-primary text-on-primary'
                                : i === 1
                                ? 'bg-secondary text-on-secondary'
                                : i === 2
                                ? 'bg-tertiary text-on-tertiary'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors">{row.viloyat}</span>
                        </div>
                        <span className="text-xs font-bold text-primary">{row.loyihalar} ta</span>
                      </div>
                      <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${fillPct}%` }}
                          transition={{ delay: i * 0.07, duration: 0.7, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Charts Row (Pie & Bar) ── */}
      <section className="px-6 max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie chart — Left side now */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-ambient p-5 sm:p-7 flex flex-col justify-center"
          >
            <h3 className="font-body text-lg font-bold text-on-surface mb-8">Loyihalar taqsimoti</h3>
            <PieChart />
          </motion.div>

          {/* Bar chart — Right side now with Year Toggle */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-ambient p-5 sm:p-7 flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h3 className="font-body text-base sm:text-lg font-bold text-on-surface">Oylik loyihalar dinamikasi</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  {activeViloyat}
                </p>
              </div>
              {/* Inline Year Toggle */}
              <div className="flex bg-surface-container p-1 rounded-lg self-start sm:self-auto">
                {YILLAR.map((y) => (
                  <button
                    key={y}
                    onClick={() => setActiveYil(y)}
                    className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                      activeYil === y
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
            <BarChart key={activeViloyat + activeYil} data={monthlyData} />
          </motion.div>
        </div>
      </section>

      {/* ── Data Grid (Gender & Table) ── */}
      <section className="px-6 max-w-7xl mx-auto pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gender Breakdown */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-ambient p-5 sm:p-7 flex flex-col gap-6"
          >
             <div>
                <h3 className="font-body text-lg font-bold text-on-surface">Jinsi bo&apos;yicha statistika</h3>
                <p className="text-sm text-on-surface-variant mt-1">{activeViloyat === 'Hammasi' ? 'Jami ajratilgan qarzlar bo\'yicha' : activeViloyat + ' hududida'}</p>
             </div>
             <div className="space-y-6 flex-1 flex flex-col justify-center">
                {genderData.map((d, i) => (
                  <GenderBar key={d.label} {...d} delay={i} isFemale={i === 1} />
                ))}
             </div>
          </motion.div>

          {/* Regional Table */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-ambient overflow-hidden flex flex-col"
          >
            <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4 border-b border-outline-variant/10">
                <h3 className="font-body text-base sm:text-lg font-bold text-on-surface">Hududiy ko&apos;rsatkichlar jadvali</h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    <th className="text-left text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-3 sm:px-6 py-3">#</th>
                    <th className="text-left text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-3 sm:px-4 py-3">Viloyat</th>
                    <th className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-2 sm:px-4 py-3">Loyiha</th>
                    <th className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-2 sm:px-4 py-3">Summa</th>
                    <th className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-2 sm:px-4 py-3 bg-tertiary/5">♂</th>
                    <th className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-2 sm:px-4 py-3 bg-secondary/5">♀</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <motion.tr
                      key={row.viloyat}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-bold text-on-surface-variant">
                        {i < 3 ? (
                          <span className={`inline-flex w-6 h-6 sm:w-7 sm:h-7 rounded-full items-center justify-center text-[10px] sm:text-xs font-extrabold ${i === 0 ? 'bg-primary text-on-primary' : i === 1 ? 'bg-secondary text-on-secondary' : 'bg-tertiary text-on-tertiary'}`}>
                            {i + 1}
                          </span>
                        ) : (
                          <span className="text-on-surface-variant text-xs sm:text-sm">{i + 1}</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4">
                        <span className="font-medium text-on-surface text-xs sm:text-sm">{row.viloyat}</span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <span className="font-headline font-bold text-on-surface text-sm">{row.loyihalar}</span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <span className="text-[10px] sm:text-xs font-extrabold text-primary bg-primary/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap">{row.mablag.toLocaleString().replace(/,/g, ' ')} mln</span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center bg-tertiary/5">
                        <span className="text-sm font-bold text-on-surface">{row.erkak}</span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center bg-secondary/5">
                        <span className="text-sm font-bold text-on-surface">{row.ayol}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* show more */}
            <div className="px-4 sm:px-6 py-4 border-t border-outline-variant/15 flex justify-center bg-surface-container-lowest">
              <button
                onClick={() => setShowAllRows(!showAllRows)}
                className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
              >
                <span className="material-symbols-outlined text-base">{showAllRows ? 'expand_less' : 'expand_more'}</span>
                {showAllRows ? "Kamroq ko'rsatish" : "Barchasini ko'rsatish"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Data Last Updated Banner ── */}
      <section className="bg-surface-container-low px-4 sm:px-6 py-10 sm:py-12 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="bg-gradient-primary rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-on-primary shadow-ambient"
          >
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest opacity-80 mb-1">Ma&apos;lumotlar platformasi</p>
              <h2 className="font-headline text-xl sm:text-2xl md:text-3xl font-extrabold">
                Barcha ko&apos;rsatkichlar shaffof va tezkor
              </h2>
              <p className="mt-2 opacity-80 text-xs sm:text-sm">
                Ko&apos;mak loyihasi ochiq ma&apos;lumotlarni e'lon qilib boradi
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
              <div className="text-center bg-white/10 rounded-xl px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm shadow-inner flex-1 md:flex-none">
                <p className="font-headline text-2xl sm:text-3xl font-extrabold">{activeViloyat === 'Hammasi' ? globalLoyiha : activeRegionData?.loyihalar || 0}</p>
                <p className="text-[10px] sm:text-xs opacity-80 mt-0.5">Faol loyiha</p>
              </div>
              <div className="text-center bg-white/10 rounded-xl px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm shadow-inner flex-1 md:flex-none">
                <p className="font-headline text-2xl sm:text-3xl font-extrabold">{activeViloyat === 'Hammasi' ? 13 : 1}</p>
                <p className="text-[10px] sm:text-xs opacity-80 mt-0.5">Hudud</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
