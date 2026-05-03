import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
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
        <Asoschilar />
      </main>
      <Footer />
    </>
  );
}
