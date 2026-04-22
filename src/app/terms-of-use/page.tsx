export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow container mx-auto px-4 pt-40 pb-20 max-w-4xl">
        <h1 className="serif-title text-4xl mb-8">Terms of Use</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500 italic">Last updated: March 30, 2026</p>
          
          <section>
            <h2 className="serif-title text-2xl text-black mt-8">1. Acceptance of Terms</h2>
            <p>By accessing or using our website, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please refrain from using our platform.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">2. Accuracy of Information</h2>
            <p>While we strive for accuracy, we cannot guarantee that all details on our website (itineraries, prices, or hotel descriptions) are always current. We reserve the right to correct any errors when confirmed at the time of booking.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">3. Intellectual Property</h2>
            <p>All content on this website, including text, images, logos, and designs, is the property of Saidpiece Travel and is protected by copyright laws. You may not reproduce or use our intellectual property without prior written consent.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">4. Prohibited Uses</h2>
            <p>You may not use our website for any unlawful purposes, including attempting to disrupt our services, spread malware, or impersonate our staff. We reserve the right to terminate access for any user who violates these rules.</p>
          </section>

          <section>
            <h2 className="serif-title text-2xl text-black mt-8">5. Governing Law</h2>
            <p>These terms are governed by the laws of the Royal Government of Bhutan. Any disputes arising from the use of our services will be subject to the exclusive jurisdiction of the courts of Bhutan.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
