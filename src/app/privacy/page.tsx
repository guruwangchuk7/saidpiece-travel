import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-40 pb-20 max-w-4xl">
        <h1 className="serif-title text-4xl mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500 italic">Last updated: March 30, 2026</p>
          
          <section>
            <h2 className="serif-title text-2xl text-black mt-8">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you make a booking, create an account, or contact us for support. This includes your name, email address, passport details (for visa processing), and payment information.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">2. How We Use Your Information</h2>
            <p>We use the information we collect to facilitate your travel arrangements, process your Bhutanese visa, manage your payments, and communicate with you about your trip. We also use data to improve our services and ensure security.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">3. Data Sharing & Third Parties</h2>
            <p>We share your data with the Bhutanese Department of Tourism for visa processing, and with our trusted local partners (guides, hotels, transportation) only as necessary to fulfill your travel itinerary. Your data is never sold to third parties.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">4. Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. When you pay via crypto or card, your sensitive financial details are processed by secure external providers (Stripe, Binance, or the blockchain) and are not stored on our servers.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information at any time. To exercise these rights, please contact us at <a href="mailto:saidpiece@gmail.com" className="text-brand">saidpiece@gmail.com</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
