import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-40 pb-20 max-w-4xl">
        <h1 className="serif-title text-4xl mb-8">Booking Terms & Conditions</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500 italic">Last updated: March 30, 2026</p>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">1. Booking Process</h2>
            <p>A booking is confirmed only when the required deposit or full payment (depending on the departure date) is received and we issue a confirmation invoice. By booking with Saidpiece Travel, you agree to these terms and conditions.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">2. Pricing & Payment</h2>
            <p>All prices are in USD unless otherwise specified. We reserve the right to alter prices before a booking is confirmed. Payment can be made via Credit Card (Stripe), Binance Pay, Wire Transfer, or supported Crypto Wallets. Full payment is generally required 60 days before departure.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">3. Sustainable Development Fee (SDF)</h2>
            <p>As per the Royal Government of Bhutan's regulations, every visitor must pay a Sustainable Development Fee. This fee is included in our standard tour packages unless explicitly stated otherwise.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">4. Travel Insurance</h2>
            <p>It is a condition of booking with us that you have adequate travel insurance covering trip cancellation, medical expenses (including repatriation), and personal liability. Proof of insurance may be required before departure.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">5. Passport & Visas</h2>
            <p>You must have a valid passport with at least six months' validity from your date of entry into Bhutan. Saidpiece Travel will process your Bhutanese visa upon receipt of full payment and passport details.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
