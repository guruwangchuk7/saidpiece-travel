import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCachedTripBySlug, getCachedItinerary } from '@/lib/data';
import TripDetailClient from './TripDetailClient';
import { ItinerarySkeleton } from '@/components/Skeleton';

export default async function DynamicTripDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // 1. Fetch trip metadata first (for Hero/Overview)
    const trip = await getCachedTripBySlug(slug);

    if (!trip) {
        return notFound();
    }

    return (
        <TripDetailClient trip={trip}>
            <Suspense fallback={<ItinerarySkeleton />}>
                <ItineraryLoader tripId={trip.id} />
            </Suspense>
        </TripDetailClient>
    );
}

/**
 * Separate component to handle deferred itinerary loading.
 * This allows the main page shell to stream immediately.
 */
async function ItineraryLoader({ tripId }: { tripId: string }) {
    const itinerary = await getCachedItinerary(tripId);
    
    // We can't use the client-side toggleAccordion here, 
    // but we can render the initial state. 
    // The Client Component (TripDetailClient) can take over once hydrated.
    return (
        <div className="itinerary-accordion">
            {itinerary.map((item) => (
                <div key={item.day_number} className="accordion-item">
                    <div className="accordion-header">
                        <div className="day-badge">Day {item.day_number}</div>
                        <span className="day-title">{item.title}</span>
                        <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                    <div className="accordion-content" style={{ display: item.day_number === 1 ? 'block' : 'none' }}>
                        <p>{item.description}</p>
                        {(item.accommodation || item.meals) && (
                            <div style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
                                {item.accommodation && <div><strong>Overnight:</strong> {item.accommodation}</div>}
                                {item.meals && <div><strong>Meals:</strong> {item.meals}</div>}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}



