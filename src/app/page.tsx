import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import TravelStyles from '@/components/TravelStyles';
import Destinations from '@/components/Destinations';
import Services from '@/components/Services';
import Catalog from '@/components/Catalog';
import Testimonials from '@/components/Testimonials';
import FeaturedTrips from '@/components/FeaturedTrips';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Intro />
      <TravelStyles />
      <Destinations />
      <Services />
      <Catalog />
      <Testimonials />
      <FeaturedTrips />
      <CTA />
      <Footer />
    </main>
  );
}
