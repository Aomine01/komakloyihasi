import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import nextDynamic from 'next/dynamic';

// Lazy-load all below-the-fold sections — ssr:false keeps them out of the
// initial JS bundle entirely; the server still sends the skeleton HTML.
const HowItWorks = nextDynamic(() => import('@/components/sections/HowItWorks'), {
  ssr: false,
  loading: () => <div className="min-h-[60vh] bg-surface-container-low animate-pulse" />,
});
const FeaturedKomakchilar = nextDynamic(() => import('@/components/sections/FeaturedKomakchilar'), {
  ssr: false,
  loading: () => <div className="min-h-[60vh] bg-surface-container-low animate-pulse" />,
});
const Asoschilar = nextDynamic(() => import('@/components/sections/Asoschilar'), {
  ssr: false,
  loading: () => <div className="min-h-[40vh] bg-surface animate-pulse" />,
});
const Footer = nextDynamic(() => import('@/components/sections/Footer'), {
  ssr: false,
  loading: () => <div className="min-h-[30vh] bg-surface-container-low animate-pulse" />,
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
