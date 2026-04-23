import Link from 'next/link';

const sitemapData = [
  {
    category: 'Bookings & Experiences',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Browse Trips', href: '/browse' },
      { label: 'Build Your Journey (Wizard)', href: '/wizard' },
      { label: 'Secure Checkout', href: '/confirm-pay' },
    ],
  },
  {
    category: 'Bhutan Itineraries',
    links: [
      { label: 'Bhutan Discovery', href: '/trips/discovery' },
      { label: 'Cultural Immersion', href: '/trips/cultural' },
      { label: 'Nature Retreat', href: '/trips/nature' },
      { label: 'Family Adventure', href: '/trips/family' },
    ],
  },
  {
    category: 'About Saidpiece',
    links: [
      { label: 'Our Story', href: '/about/our-story' },
      { label: 'Responsible Travel', href: '/about/responsible-travel' },
      { label: 'The Team', href: '/about/meet-our-team' },
      { label: 'Booking Process', href: '/about/booking-process' },
      { label: 'Travel Blog', href: '/travel-blog' },
    ],
  },
  {
    category: 'Support & Legal',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Booking Terms', href: '/terms' },
      { label: 'Cancellation Policy', href: '/cancellation' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms-of-use' },
    ],
  },
  {
    category: 'Staff & Operations',
    links: [
      { label: 'Staff Login', href: '/admin/login' },
      { label: 'Booking Management', href: '/admin/enquiries' },
    ],
  }
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow container mx-auto px-4 pt-40 pb-20 max-w-5xl">
        <h1 className="serif-title text-4xl mb-12">Website Sitemap</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {sitemapData.map((section) => (
            <div key={section.category} className="sitemap-section">
              <h2 className="serif-title text-2xl text-black mb-6 pb-2 border-b-1 border-gray-100 font-semibold">{section.category}</h2>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-brand transition-colors duration-200 block text-lg font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 bg-gray-50 rounded-lg text-center border-1 border-gray-100">
          <h3 className="serif-title text-xl text-black mb-4 font-semibold">Technical Sitemap</h3>
          <p className="text-gray-600 mb-6 font-medium">Looking for our XML sitemap for search engines?</p>
          <a
            href="/sitemap.xml"
            className="px-6 py-3 bg-black text-white rounded font-bold hover:opacity-90 inline-block transition-opacity"
          >
            /sitemap.xml
          </a>
        </div>
      </main>
    </div>
  );
}
