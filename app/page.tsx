import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import Footer from '@/components/sections/Footer';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 bg-surface rounded-b-[2.5rem] shadow-xl pb-10 min-h-screen">
        <Hero />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
