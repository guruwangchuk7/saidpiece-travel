import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CancellationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-40 pb-20 max-w-4xl">
        <h1 className="serif-title text-4xl mb-8">Cancellation & Refund Policy</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500 italic">Last updated: March 30, 2026</p>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">1. Cancellation by You</h2>
            <p>If you decide to cancel your booking, the following cancellation charges will apply based on when we receive written notice of your cancellation:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-black">
              <li><strong>60+ days before departure:</strong> Loss of 20% of the total tour price (booking deposit).</li>
              <li><strong>30–59 days before departure:</strong> Loss of 50% of the total tour price.</li>
              <li><strong>Less than 30 days before departure:</strong> 100% cancellation fee.</li>
            </ul>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">2. Rescheduling Policy</h2>
            <p>You may request a rescheduling of your trip up to 45 days before departure, subject to a 10% administrative fee and any difference in tour pricing. Rescheduling is subject to availability.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">3. Bhutan Government (SDF) Refunds</h2>
            <p>The Royal Government of Bhutan has its own refund policy regarding the Sustainable Development Fee (SDF). While we will advocate for your refund, the final decision on the SDF portion of your payment lies with the Department of Tourism, Bhutan.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">4. Force Majeure</h2>
            <p>Saidpiece Travel reserves the right to cancel any trip due to forces beyond our control (e.g., pandemics, environmental crises, political unrest). In such cases, we will provide a full refund minus any non-refundable costs already paid to local vendors or gov agencies.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">5. Refund Processing</h2>
            <p>Refunds will be processed via the original payment method. For crypto payments, the refund will be issued in the same token at the USD value at time of cancellation, or at the current USD value, whichever is higher at our discretion.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
