import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import nextDynamic from 'next/dynamic';

// Lazy-load below-the-fold sections to reduce initial JS bundle
const HowItWorks = nextDynamic(() => import('@/components/sections/HowItWorks'), {
  loading: () => <div className="min-h-[60vh]" />,
});
const FeaturedKomakchilar = nextDynamic(() => import('@/components/sections/FeaturedKomakchilar'), {
  loading: () => <div className="min-h-[60vh]" />,
});
const Asoschilar = nextDynamic(() => import('@/components/sections/Asoschilar'), {
  loading: () => <div className="min-h-[40vh]" />,
});
const Footer = nextDynamic(() => import('@/components/sections/Footer'), {
  loading: () => <div className="min-h-[30vh]" />,
});

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedKomakchilar />
        <Asoschilar />
      </main>
      <Footer />
    </>
  );
}
