'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
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
const YILLAR = ['Umumiy', '2026', '2025'];

// Growth timeline (Oct 2025 – Mar 2026)
const GROWTH_TIMELINE = [
  { month: 'Okt 2025', value: 2 },
  { month: 'Noy 2025', value: 3 },
  { month: 'Dek 2025', value: 7 },
  { month: 'Yan 2026', value: 40 },
  { month: 'Fev 2026', value: 76 },
  { month: 'Mar 2026', value: 163 },
];

// Monthly data per region (simulated for dynamics)
const MONTHLY_DATA: Record<string, number[]> = {
  Hammasi: [2, 3, 7, 40, 76, 163, 0, 0, 0, 0, 0, 0],
  default: [0, 1, 1, 3, 5, 10, 0, 0, 0, 0, 0, 0],
};

const MONTHS_SHORT = ['Okt','Noy','Dek','Yan','Fev','Mar','Apr','May','Iyun','Iyul','Avg','Sen'];

// Faoliyat holati (Activity Status)
const ACTIVITY_DATA = [
  { label: 'Faol', count: 221, pct: 73, color: '#00685f' },
  { label: 'Jarayonda', count: 35, pct: 12, color: '#3b82f6' },
  { label: 'Nofaol', count: 46, pct: 15, color: '#ef4444' },
];

// Xulosa matritsasi
const XULOSA_DATA = [
  { label: 'Jarayonda', mavjud: 11, mavjudEmas: 34, total: 45 },
  { label: 'Maqsadli', mavjud: 78, mavjudEmas: 112, total: 190 },
  { label: 'Maqsadsiz', mavjud: 0, mavjudEmas: 32, total: 32 },
  { label: 'Qisman maqsadli', mavjud: 4, mavjudEmas: 1, total: 5 },
];

// Jihozlar (Equipment)
const EQUIPMENT_DATA = [
  { label: 'Stullar jami', value: 4097, color: '#00685f' },
  { label: 'Stollar jami', value: 2297, color: '#14b8a6' },
  { label: 'Kompyuterlar', value: 265, color: '#3b82f6' },
  { label: 'Elektron doskalar', value: 68, color: '#f59e0b' },
];

// Til taqsimoti
const LANGUAGE_DATA = [
  { label: 'Ingliz tili', value: 184, color: '#ef4444' },
  { label: 'Rus tili', value: 57, color: '#3b82f6' },
  { label: 'Koreys tili', value: 163, color: '#10b981' },
];

// Ta'minot turi
const SUPPLY_DATA = [
  { label: 'Kafillik', value: 231, icon: 'verified_user', color: '#00685f' },
  { label: "Sug'urta", value: 71, icon: 'shield', color: '#f59e0b' },
];

const PIE_DATA = [
  { label: "Jihozlash va ta'mirlash", pct: 40, color: '#00685f' },
  { label: "O'quv resurslari", pct: 30, color: '#14b8a6' },
  { label: 'Texnologiyalar', pct: 20, color: '#f59e0b' },
  { label: 'Boshqalar', pct: 10, color: '#b3c5ff' },
];

const REGION_ROWS = [
  { viloyat: "Qoraqalpog'iston Res.", markazlar: 30, summa: 3800, oqituvchilar: 37, oquvchilar: 754 },
  { viloyat: 'Andijon viloyati', markazlar: 19, summa: 2450, oqituvchilar: 63, oquvchilar: 1662 },
  { viloyat: 'Buxoro viloyati', markazlar: 61, summa: 7660, oqituvchilar: 100, oquvchilar: 1966 },
  { viloyat: 'Jizzax viloyati', markazlar: 17, summa: 2200, oqituvchilar: 17, oquvchilar: 455 },
  { viloyat: 'Qashqadaryo viloyati', markazlar: 32, summa: 4030, oqituvchilar: 72, oquvchilar: 1705 },
  { viloyat: 'Navoiy viloyati', markazlar: 20, summa: 2600, oqituvchilar: 50, oquvchilar: 1334 },
  { viloyat: 'Namangan viloyati', markazlar: 12, summa: 1417, oqituvchilar: 47, oquvchilar: 1627 },
  { viloyat: 'Samarqand viloyati', markazlar: 21, summa: 2730, oqituvchilar: 59, oquvchilar: 928 },
  { viloyat: 'Sirdaryo viloyati', markazlar: 5, summa: 650, oqituvchilar: 12, oquvchilar: 201 },
  { viloyat: 'Surxondaryo viloyati', markazlar: 35, summa: 4550, oqituvchilar: 83, oquvchilar: 1948 },
  { viloyat: 'Toshkent viloyati', markazlar: 18, summa: 2341, oqituvchilar: 46, oquvchilar: 772 },
  { viloyat: "Farg'ona viloyati", markazlar: 19, summa: 2410, oqituvchilar: 82, oquvchilar: 2011 },
  { viloyat: 'Xorazm viloyati', markazlar: 13, summa: 1690, oqituvchilar: 30, oquvchilar: 1202 },
].sort((a,b) => b.markazlar - a.markazlar);

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
  const max = Math.max(...data, 1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (v / max) * 100;
    return { x, y, v };
  });

  const createPath = (pts: typeof points) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = createPath(points);
  const areaPath = `${linePath} L 100 100 L 0 100 Z`;

  return (
    <div ref={ref} className="h-52 relative w-full flex flex-col justify-end mt-4">
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 z-0 pb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full border-b border-on-surface-variant border-dashed h-0" />
        ))}
      </div>
      
      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute z-20 bg-inverse-surface text-inverse-on-surface text-[10px] font-bold py-1 px-2 rounded-md pointer-events-none shadow-lg transform -translate-x-1/2 -translate-y-full transition-all"
          style={{ 
            left: `${points[hoveredIndex].x}%`, 
            top: `calc(${points[hoveredIndex].y}% - 12px)`,
          }}
        >
          {points[hoveredIndex].v} ta
        </div>
      )}

      {/* SVG for line and area */}
      <div className="absolute inset-0 pb-6 z-10">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00685f" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00685f" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <motion.path
            d={areaPath}
            fill="url(#areaGradient)"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          />
          
          <motion.path
            d={linePath}
            fill="none"
            stroke="#00685f"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* HTML Dots for perfect circles */}
      <div className="absolute inset-0 pb-6 z-10 pointer-events-none">
        {points.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full border-2 border-white cursor-pointer pointer-events-auto transition-all duration-300 ${hoveredIndex === i ? 'bg-primary w-3 h-3' : 'bg-[#00685f] w-2 h-2'}`}
            style={{
              left: `calc(${p.x}% - ${hoveredIndex === i ? '6px' : '4px'})`,
              top: `calc(${p.y}% - ${hoveredIndex === i ? '6px' : '4px'})`,
              boxShadow: hoveredIndex === i ? '0 0 8px rgba(0,104,95,0.6)' : 'none'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1 + i * 0.05, duration: 0.3 }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>
      
      <div className="flex justify-between mt-auto pt-2 z-10 px-1 relative">
        {data.map((_, i) => (
          <span key={i} className="text-[9px] sm:text-[10px] font-semibold text-on-surface-variant w-8 text-center -ml-4 first:ml-0 last:-mr-4">
            {MONTHS_SHORT[i]}
          </span>
        ))}
      </div>
    </div>
  );
}

function PieChart({ totalMablag }: { totalMablag: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const ringWidth = 3;
  const gap = 3.5;

  return (
    <div ref={ref} className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
      <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 overflow-visible">
          {PIE_DATA.map((d, i) => {
            const radius = 22 + i * (ringWidth + gap);
            const circumference = 2 * Math.PI * radius;
            const strokeDasharray = `${(d.pct / 100) * circumference} ${circumference}`;
            const isHovered = hoveredIndex === i;
            const isOtherHovered = hoveredIndex !== null && hoveredIndex !== i;

            return (
              <g key={d.label}>
                {/* Background track */}
                <circle
                  cx="50" cy="50" r={radius}
                  fill="none" stroke={d.color} strokeWidth={ringWidth}
                  strokeOpacity="0.1"
                />
                {/* Foreground progress */}
                <motion.circle
                  cx="50" cy="50" r={radius}
                  fill="none" stroke={d.color} strokeWidth={isHovered ? ringWidth + 1.5 : ringWidth}
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  initial={{ strokeDashoffset: circumference }}
                  animate={inView ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: 1.5, delay: i * 0.15, ease: "easeOut" }}
                  style={{
                    opacity: isOtherHovered ? 0.3 : 1,
                    filter: isHovered ? `drop-shadow(0 0 6px ${d.color}80)` : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer outline-none"
                />
              </g>
            );
          }).reverse()}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
             <span className="block text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-0.5">Jami</span>
             <span className="block font-headline font-extrabold text-xl text-on-surface leading-none">{totalMablag.toLocaleString('uz-UZ').replace(/,/g, ' ')}</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 flex-1 w-full">
        {PIE_DATA.map((d, i) => (
          <div 
            key={d.label} 
            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-300 ${hoveredIndex === i ? 'bg-surface-container shadow-sm scale-105' : 'hover:bg-surface-container/50'}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="w-3.5 h-3.5 rounded-full shrink-0 shadow-inner" style={{ backgroundColor: d.color, transform: hoveredIndex === i ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.2s' }} />
            <span className={`text-sm ${hoveredIndex === i ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>{d.label}</span>
            <span className={`ml-auto text-sm ${hoveredIndex === i ? 'font-extrabold text-on-surface' : 'font-semibold text-on-surface'}`}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenderVisualization({ data }: { data: { label: string; count: number; pct: number }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const erkak = data[0];
  const ayol = data[1];

  return (
    <div ref={ref} className="relative w-full h-full flex flex-col justify-center">
      {/* Dynamic Split Bar */}
      <div className="flex w-full h-20 sm:h-24 rounded-[2rem] overflow-hidden shadow-inner relative bg-surface-container-low">
        {/* Erkaklar Section */}
        <motion.div 
          className="relative h-full bg-gradient-to-r from-primary to-primary-container flex items-center justify-start px-4 sm:px-8 overflow-hidden group cursor-pointer"
          initial={{ width: '50%' }}
          animate={inView ? { width: `${erkak.pct}%` } : {}}
          transition={{ duration: 1.5, type: "spring", bounce: 0.3, delay: 0.1 }}
        >
          {/* Abstract background pattern */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_50%,_white_0%,_transparent_60%)]" />
          <motion.span 
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            whileHover={{ scale: 1.2, x: 10, rotate: -5 }}
            transition={{ delay: 0.6, type: 'spring', hover: { type: 'spring', stiffness: 300 } }}
            className="material-symbols-outlined text-on-primary text-4xl sm:text-5xl drop-shadow-md relative z-10" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            man
          </motion.span>
        </motion.div>

        {/* Ayollar Section */}
        <motion.div 
          className="relative h-full bg-gradient-to-l from-secondary to-secondary-container flex items-center justify-end px-4 sm:px-8 overflow-hidden group cursor-pointer"
          initial={{ width: '50%' }}
          animate={inView ? { width: `${ayol.pct}%` } : {}}
          transition={{ duration: 1.5, type: "spring", bounce: 0.3, delay: 0.1 }}
        >
          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-[radial-gradient(circle_at_70%_50%,_white_0%,_transparent_60%)]" />
          <motion.span 
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            whileHover={{ scale: 1.2, x: -10, rotate: 5 }}
            transition={{ delay: 0.7, type: 'spring', hover: { type: 'spring', stiffness: 300 } }}
            className="material-symbols-outlined text-on-secondary text-4xl sm:text-5xl drop-shadow-md relative z-10" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            woman
          </motion.span>
        </motion.div>
      </div>

      {/* Stats Below */}
      <div className="flex justify-between items-end mt-8 px-2 sm:px-4">
         <div className="text-left">
            <span className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,104,95,0.4)]" /> {erkak.label}
            </span>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
               <span className="font-headline text-3xl sm:text-4xl font-extrabold text-on-surface">{erkak.pct}%</span>
               <span className="text-xs sm:text-sm font-semibold text-on-surface-variant">{erkak.count} nafar</span>
            </div>
         </div>
         <div className="text-right">
            <span className="flex items-center justify-end gap-2 text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
              {ayol.label} <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(20,184,166,0.4)]" />
            </span>
            <div className="flex items-baseline justify-end gap-1.5 sm:gap-2">
               <span className="text-xs sm:text-sm font-semibold text-on-surface-variant">{ayol.count} nafar</span>
               <span className="font-headline text-3xl sm:text-4xl font-extrabold text-on-surface">{ayol.pct}%</span>
            </div>
         </div>
      </div>
    </div>
  );
}

/* ────────────────────────── main component ──────────────────── */
export default function StatisticsPage({ stats }: { stats: Stat[] }) {
  const [activeViloyat, setActiveViloyat] = useState('Hammasi');
  const [activeYil, setActiveYil] = useState('Umumiy');
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

  // Global totals (new dashboard data: 29.04.2026)
  let globalMarkazlar = 302;
  let globalSumma = 38528; // mln so'm
  let globalOqituvchilar = 698;
  let globalOquvchilar = 16565;
  let globalErkak = 408;
  let globalAyol = 292;
  
  if (activeViloyat === 'Hammasi') {
     if (activeYil === '2025') {
        globalMarkazlar = 126; globalSumma = 16126; globalOqituvchilar = 280; globalOquvchilar = 6200; globalErkak = 87; globalAyol = 39;
     } else if (activeYil === '2026') {
        globalMarkazlar = 176; globalSumma = 22402; globalOqituvchilar = 418; globalOquvchilar = 10365; globalErkak = 321; globalAyol = 253;
     }
  }

  const activeRegionData = activeViloyat !== 'Hammasi' 
    ? REGION_ROWS.find(r => r.viloyat.startsWith(activeViloyat))
    : null;

  const currentMarkazlar = activeViloyat === 'Hammasi' ? globalMarkazlar : (activeRegionData?.markazlar || 0);
  const currentSumma = activeViloyat === 'Hammasi' ? globalSumma : (activeRegionData?.summa || 0);
  const currentOqituvchilar = activeViloyat === 'Hammasi' ? globalOqituvchilar : (activeRegionData?.oqituvchilar || 0);
  const currentOquvchilar = activeViloyat === 'Hammasi' ? globalOquvchilar : (activeRegionData?.oquvchilar || 0);
  const currentErkak = activeViloyat === 'Hammasi' ? globalErkak : 0;
  const currentAyol = activeViloyat === 'Hammasi' ? globalAyol : 0;
  const currentLoyiha = currentMarkazlar;
  const currentMablag = currentSumma;

  const genderData = [
    { label: 'Erkaklar', count: currentErkak, pct: (currentErkak + currentAyol) > 0 ? Math.round((currentErkak/(currentErkak + currentAyol))*100) : 0 },
    { label: 'Ayollar', count: currentAyol, pct: (currentErkak + currentAyol) > 0 ? Math.round((currentAyol/(currentErkak + currentAyol))*100) : 0 }
  ];

  const kpiCards = [
    {
      icon: 'school',
      label: "O'quv markazlar",
      value: currentMarkazlar,
      unit: 'ta',
      sub: activeViloyat !== 'Hammasi' ? `${activeViloyat}da` : "Jami moliyalashtirilgan markazlar",
      trend: "Muvaffaqiyatli tashkil etilgan",
      colorIdx: 1,
    },
    {
      icon: 'account_balance',
      label: "Jami summa",
      value: currentSumma,
      unit: 'mln',
      sub: activeViloyat !== 'Hammasi' ? "Hudud uchun" : "Jami ajratilgan mablag'",
      trend: "So'm miqdorida tasdiqlangan",
      colorIdx: 0,
    },
    {
      icon: 'person',
      label: "O'qituvchilar jami",
      value: currentOqituvchilar,
      unit: 'nafar',
      sub: "Markazlardagi o'qituvchilar",
      trend: "Pedagogik kadrlar",
      colorIdx: 2,
    },
    {
      icon: 'groups',
      label: "O'quvchilar jami",
      value: currentOquvchilar,
      unit: 'nafar',
      sub: "O'quvchilar soni",
      trend: "O'sish: 114.47%",
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
              { label: "So'nggi yangilanish", value: '29.04.2026' },
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

      {/* ── Regional Map & Main Stats ── */}
      <section className="px-6 max-w-7xl mx-auto mb-10">
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeUp}
          className="bg-[#f4f7f6] rounded-[24px] border border-outline-variant/20 shadow-[inset_0_4px_24px_rgba(0,104,95,0.05)] overflow-hidden relative flex flex-col lg:flex-row min-h-[400px] lg:min-h-[500px]"
          style={{ backgroundImage: 'radial-gradient(rgba(0, 104, 95, 0.15) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
        >
          {/* Left side: Map area */}
          <div className="flex-1 relative order-2 lg:order-1 min-h-[400px] flex flex-col">
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

            {/* Zoom Controls Panel */}
            <div className="absolute top-6 right-6 z-20 flex flex-col bg-surface-container-lowest/90 backdrop-blur-sm rounded-xl shadow-sm border border-outline-variant/20 p-1">
              <button 
                onClick={() => setMapPosition(p => ({ ...p, zoom: Math.min(p.zoom * 1.5, 5) }))} 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                title="Yaqinlashtirish"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
              <button 
                onClick={() => setMapPosition(p => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) }))} 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                title="Uzoqlashtirish"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <div className="w-full h-[1px] bg-outline-variant/20 my-0.5" />
              <button 
                onClick={() => { setActiveViloyat('Hammasi'); animateMapTo(INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                title="Barchasini ko'rsatish"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
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
                          const mappedViloyatName = GEO_ID_TO_REGION[geoId] ?? GEO_NAME_TO_REGION[geoName] ?? geoName;
                          const isActive = activeViloyat === mappedViloyatName;
                          const regionDataMock = REGION_ROWS.find(r => r.viloyat === mappedViloyatName);
                          const isToshkentCity = geoId === 'UZTK';

                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onMouseEnter={() => {
                                 setHoveredRegion(mappedViloyatName + (regionDataMock ? ` — ${regionDataMock.markazlar} markaz` : ''));
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
                                  fill: isActive ? '#00685f' : isToshkentCity ? '#cbd5e1' : '#e2e8f0',
                                  stroke: '#ffffff',
                                  strokeWidth: isActive ? 2 : 1,
                                  outline: 'none',
                                  transition: 'all 250ms',
                                },
                                hover: {
                                  fill: isActive ? '#005320' : '#89f5e7',
                                  stroke: isActive ? '#ffffff' : '#00685f',
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
          </div>

          {/* Right side: Stats Panel */}
          <div className="w-full lg:w-[420px] p-6 lg:p-8 flex flex-col justify-center gap-6 relative z-10 order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-outline-variant/10 bg-transparent">
            
            {/* Card 1: O'quv markazlar */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-5 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-on-surface-variant font-semibold mb-1">
                  {activeViloyat === 'Hammasi' ? "Respublika bo'yicha o'quv markazlar" : `${activeViloyat} hududida markazlar`}
                </p>
                <p className="font-headline text-3xl font-extrabold text-on-surface leading-none">{currentMarkazlar.toLocaleString().replace(/,/g, ' ')}</p>
              </div>
            </div>

            {/* Card 2: Moliyaviy Mablag' */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col">
              <p className="text-sm text-on-surface-variant font-semibold mb-2">Jami ajratilgan moliyaviy mablag'</p>
              <div className="flex items-baseline gap-1.5 mb-6">
                <p className="font-headline text-[32px] font-extrabold text-on-surface leading-none">
                  {currentMablag.toLocaleString('uz-UZ').replace(/,/g, ' ')}
                </p>
                <span className="text-sm font-bold text-on-surface-variant">mln. so'm</span>
              </div>
              
              {/* Stacked Progress Bar */}
              <div className="h-2.5 flex rounded-full overflow-hidden mb-5 bg-surface-container-low">
                <motion.div className="h-full bg-[#3b82f6]" initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 1 }} />
                <motion.div className="h-full bg-[#10b981]" initial={{ width: 0 }} animate={{ width: '20%' }} transition={{ duration: 1 }} />
                <motion.div className="h-full bg-[#f59e0b]" initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 1 }} />
              </div>

              {/* Legend for Stacked Bar */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-1.5 rounded-full bg-[#3b82f6] shrink-0"></span>
                    <span className="text-on-surface-variant font-medium">Talab qilingan mablag'</span>
                  </div>
                  <span className="font-bold text-on-surface text-right whitespace-nowrap ml-2">{Math.round(currentMablag * 1.25).toLocaleString('uz-UZ').replace(/,/g, ' ')} <span className="text-[10px] text-on-surface-variant font-normal">mln. so'm</span></span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-1.5 rounded-full bg-[#10b981] shrink-0"></span>
                    <span className="text-on-surface-variant font-medium">Jamg'arma tomonidan ajratilgan mablag'</span>
                  </div>
                  <span className="font-bold text-on-surface text-right whitespace-nowrap ml-2">{Math.round(currentMablag * 0.15).toLocaleString('uz-UZ').replace(/,/g, ' ')} <span className="text-[10px] text-on-surface-variant font-normal">mln. so'm</span></span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-1.5 rounded-full bg-[#f59e0b] shrink-0"></span>
                    <span className="text-on-surface-variant font-medium">Bank kreditlari</span>
                  </div>
                  <span className="font-bold text-on-surface text-right whitespace-nowrap ml-2">{Math.round(currentMablag * 0.85).toLocaleString('uz-UZ').replace(/,/g, ' ')} <span className="text-[10px] text-on-surface-variant font-normal">mln. so'm</span></span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
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
            <PieChart totalMablag={currentMablag} />
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

      {/* ── New Dashboard Sections ── */}
      <section className="px-6 max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Faoliyat holati (Activity Status Donut) -> Pulsing Status Arc */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-ambient p-5 sm:p-7 relative overflow-hidden"
          >
            {/* Glowing background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="font-body text-lg font-bold text-on-surface mb-6 relative z-10">Faoliyat holati</h3>
            <div className="flex items-center gap-6 relative z-10">
              {/* Concentric Arcs */}
              <div className="relative w-32 h-32 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {ACTIVITY_DATA.map((d, i) => {
                    const radius = 42 - (i * 8);
                    const circumference = 2 * Math.PI * radius;
                    const strokeDasharray = `${(d.pct / 100) * circumference} ${circumference}`;
                    return (
                      <g key={d.label}>
                        <circle cx="50" cy="50" r={radius} fill="none" stroke={d.color} strokeWidth="5" strokeOpacity="0.15" />
                        <motion.circle
                          cx="50" cy="50" r={radius}
                          fill="none" stroke={d.color} strokeWidth="5" strokeLinecap="round"
                          strokeDasharray={strokeDasharray}
                          initial={{ strokeDashoffset: circumference }}
                          whileInView={{ strokeDashoffset: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: i * 0.2, ease: 'easeOut' }}
                          style={{ filter: `drop-shadow(0 0 3px ${d.color}60)` }}
                        />
                      </g>
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-headline text-2xl font-extrabold text-on-surface">302</span>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-4 flex-1">
                {ACTIVITY_DATA.map((d, i) => (
                  <div key={d.label} className="relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center w-4 h-4">
                           <div className="absolute inset-0 rounded-full opacity-20" style={{ backgroundColor: d.color }} />
                           <motion.div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: d.color }}
                              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                           />
                        </div>
                        <span className="text-sm font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">{d.label}</span>
                      </div>
                      <div className="text-right flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-on-surface">{d.count}</span>
                        <span className="text-[10px] font-bold" style={{ color: d.color }}>{d.pct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Xulosa matritsasi -> Clean Metric Grid */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-ambient p-5 sm:p-7 relative overflow-hidden"
          >
             <h3 className="font-body text-lg font-bold text-on-surface mb-6 relative z-10">Xulosa tasnifi</h3>
             <div className="grid grid-cols-2 gap-3 relative z-10">
                {/* Mavjud card */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 transition-transform hover:scale-[1.02]">
                   <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Mavjud (93)</div>
                   <div className="space-y-2.5">
                      <div className="flex justify-between items-center"><span className="text-xs text-on-surface-variant font-medium">Maqsadli</span> <span className="font-bold text-sm text-on-surface">78</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-on-surface-variant font-medium">Jarayonda</span> <span className="font-bold text-sm text-on-surface">11</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-on-surface-variant font-medium">Qisman</span> <span className="font-bold text-sm text-on-surface">4</span></div>
                      <div className="flex justify-between items-center opacity-50"><span className="text-xs text-on-surface-variant font-medium">Maqsadsiz</span> <span className="font-bold text-sm text-on-surface">0</span></div>
                   </div>
                </div>
                {/* Mavjud emas card */}
                <div className="bg-surface-container/50 rounded-xl p-4 border border-outline-variant/10 transition-transform hover:scale-[1.02]">
                   <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Yo&apos;q (179)</div>
                   <div className="space-y-2.5">
                      <div className="flex justify-between items-center"><span className="text-xs text-on-surface-variant font-medium">Maqsadli</span> <span className="font-bold text-sm text-on-surface">112</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-on-surface-variant font-medium">Jarayonda</span> <span className="font-bold text-sm text-on-surface">34</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-on-surface-variant font-medium">Maqsadsiz</span> <span className="font-bold text-sm text-on-surface">32</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-on-surface-variant font-medium">Qisman</span> <span className="font-bold text-sm text-on-surface">1</span></div>
                   </div>
                </div>
             </div>
             
             {/* Total bottom bar */}
             <div className="mt-4 bg-surface-container-low rounded-xl p-3 flex justify-between items-center border border-outline-variant/10 relative z-10">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-1">Umumiy xulosalar</span>
                <span className="font-headline font-extrabold text-xl text-on-surface pr-1">272</span>
             </div>
          </motion.div>

          {/* Jihozlar (Equipment) -> Segmented Particles */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-ambient p-5 sm:p-7 relative overflow-hidden flex flex-col"
          >
            <h3 className="font-body text-lg font-bold text-on-surface mb-6">Jihozlar</h3>
            <div className="space-y-5 relative z-10 flex-1 flex flex-col justify-center">
              {EQUIPMENT_DATA.map((item, i) => {
                const maxVal = Math.max(...EQUIPMENT_DATA.map(e => e.value));
                const segmentCount = 12; // 12 blocks total
                const activeSegments = Math.max(1, Math.round((item.value / maxVal) * segmentCount));
                
                return (
                  <div key={item.label} className="group cursor-default">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider group-hover:text-on-surface transition-colors">{item.label}</span>
                      <span className="text-sm font-extrabold text-on-surface bg-surface-container px-2 py-0.5 rounded text-primary transition-all group-hover:bg-primary/10 group-hover:shadow-sm">{item.value.toLocaleString().replace(/,/g, ' ')}</span>
                    </div>
                    <div className="flex gap-1 h-2.5">
                       {[...Array(segmentCount)].map((_, idx) => (
                          <motion.div 
                             key={idx}
                             className="flex-1 rounded-sm"
                             style={{ backgroundColor: idx < activeSegments ? item.color : `${item.color}20` }}
                             initial={{ opacity: 0, scaleY: 0 }}
                             whileInView={{ opacity: 1, scaleY: 1 }}
                             viewport={{ once: true }}
                             transition={{ duration: 0.4, delay: i * 0.1 + idx * 0.05 }}
                          />
                       ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Til taqsimoti & Ta'minot turi ── */}
      <section className="px-6 max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Til taqsimoti -> Overlapping Hexagons / Orbs */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-ambient p-5 sm:p-7 relative overflow-hidden"
          >
            <h3 className="font-body text-lg font-bold text-on-surface mb-6 relative z-10">Ingliz tili, Rus tili va Koreys tili</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative z-10">
              {LANGUAGE_DATA.map((lang, i) => {
                 const percentage = Math.round((lang.value / 404) * 100);
                 return (
                  <motion.div 
                     key={lang.label} 
                     className="relative text-center p-5 rounded-2xl bg-surface-container/30 border border-outline-variant/10 hover:bg-surface-container/60 transition-all duration-300 group overflow-hidden cursor-default"
                     whileHover={{ y: -4 }}
                  >
                    {/* Background glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: lang.color }} />
                    
                    <div className="relative mx-auto w-24 h-24 mb-5 flex items-center justify-center">
                       {/* Abstract liquid shape */}
                       <motion.div 
                         className="absolute inset-0 opacity-20 transition-all duration-500 group-hover:opacity-40"
                         style={{ backgroundColor: lang.color, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
                         animate={{ rotate: 360 }}
                         transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
                       />
                       <motion.div 
                         className="absolute inset-2 opacity-30 transition-all duration-500 group-hover:opacity-60"
                         style={{ backgroundColor: lang.color, borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
                         animate={{ rotate: -360 }}
                         transition={{ duration: 15 + i, repeat: Infinity, ease: 'linear' }}
                       />
                       <div className="relative z-10 flex flex-col items-center justify-center bg-surface-container-lowest w-16 h-16 rounded-full shadow-sm border border-outline-variant/10">
                         <span className="font-headline text-xl font-extrabold text-on-surface leading-none">{lang.value}</span>
                         <span className="text-[9px] font-bold mt-0.5" style={{ color: lang.color }}>{percentage}%</span>
                       </div>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-on-surface-variant uppercase tracking-widest">{lang.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Ta'minot turi -> Glassmorphism glowing edge cards */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-ambient p-5 sm:p-7 flex flex-col relative overflow-hidden"
          >
            <h3 className="font-body text-lg font-bold text-on-surface mb-5 relative z-10">Ta&apos;minot turi</h3>
            <div className="space-y-4 flex-1 flex flex-col justify-center relative z-10">
              {SUPPLY_DATA.map((item, i) => (
                <motion.div 
                   key={item.label} 
                   className="relative flex items-center gap-5 p-5 rounded-2xl overflow-hidden group cursor-default"
                   whileHover={{ scale: 1.02 }}
                   transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {/* Glowing dynamic background */}
                  <div className="absolute inset-0 bg-surface-container/40 group-hover:bg-surface-container/80 transition-colors duration-300" />
                  <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5" style={{ backgroundColor: item.color }} />
                  <div className="absolute -right-10 -top-10 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity blur-2xl rounded-full pointer-events-none" style={{ backgroundColor: item.color }} />

                  <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/50 backdrop-blur-md" style={{ backgroundColor: item.color + '15' }}>
                    <span className="material-symbols-outlined text-[28px] drop-shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <div className="relative z-10 flex-1">
                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="font-headline text-3xl font-extrabold text-on-surface">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
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
                <h3 className="font-body text-lg font-bold text-on-surface">Gender bo&apos;yicha statistika</h3>
                <p className="text-sm text-on-surface-variant mt-1">{activeViloyat === 'Hammasi' ? 'Jami ajratilgan qarzlar bo\'yicha' : activeViloyat + ' hududida'}</p>
             </div>
             <div className="flex-1 flex flex-col justify-center">
                <GenderVisualization data={genderData} />
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
                    <th className="text-left text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-3 sm:px-4 py-3">Hudud</th>
                    <th className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-2 sm:px-4 py-3">Markazlar</th>
                    <th className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-2 sm:px-4 py-3">Summa</th>
                    <th className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-2 sm:px-4 py-3 bg-tertiary/5">O'qituvchi</th>
                    <th className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-2 sm:px-4 py-3 bg-secondary/5">O'quvchi</th>
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
                        <span className="font-headline font-bold text-on-surface text-sm">{row.markazlar}</span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <span className="text-[10px] sm:text-xs font-extrabold text-primary bg-primary/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap">{row.summa.toLocaleString().replace(/,/g, ' ')} mln</span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center bg-tertiary/5">
                        <span className="text-sm font-bold text-on-surface">{row.oqituvchilar}</span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center bg-secondary/5">
                        <span className="text-sm font-bold text-on-surface">{row.oquvchilar}</span>
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
                <p className="font-headline text-2xl sm:text-3xl font-extrabold">{activeViloyat === 'Hammasi' ? globalMarkazlar : activeRegionData?.markazlar || 0}</p>
                <p className="text-[10px] sm:text-xs opacity-80 mt-0.5">O&apos;quv markaz</p>
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
