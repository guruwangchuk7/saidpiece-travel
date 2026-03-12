import BrowseTripsClient from './BrowseTripsClient';

export default async function BrowsePage({
    searchParams,
}: {
    searchParams: Promise<{ filter?: string; type?: string; activity?: string }>;
}) {
    const params = await searchParams;

    return (
        <BrowseTripsClient
            initialCollection={params.filter ?? 'all'}
            initialType={params.type}
            initialActivity={params.activity}
        />
    );
}
