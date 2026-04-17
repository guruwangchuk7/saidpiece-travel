import BrowseTripsClient from './BrowseTripsClient';
import { getCachedTrips } from '@/lib/data';

export default async function BrowsePage({
    searchParams,
}: {
    searchParams: Promise<{ filter?: string; type?: string; activity?: string }>;
}) {
    const params = await searchParams;
    const initialTrips = await getCachedTrips();

    return (
        <BrowseTripsClient
            initialCollection={params.filter ?? 'all'}
            initialType={params.type}
            initialActivity={params.activity}
            initialTrips={initialTrips}
        />
    );
}

