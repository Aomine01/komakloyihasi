import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import FeaturedKomakchilar from '@/components/sections/FeaturedKomakchilar';
import Asoschilar from '@/components/sections/Asoschilar';
import Footer from '@/components/sections/Footer';

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
