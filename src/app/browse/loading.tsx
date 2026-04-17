import { TripCardSkeleton } from '@/components/Skeleton';

export default function BrowseLoading() {
    return (
        <main>
            <div className="browse-page-layout">
                <div className="breadcrumbs">
                    <div className="container">
                        <div className="skeleton-pulse" style={{ width: '150px', height: '16px', borderRadius: '4px' }}></div>
                    </div>
                </div>

                <div className="container browse-grid" style={{ marginTop: '40px' }}>
                    <aside className="filters-sidebar" style={{ borderRight: '1px solid #eee' }}>
                        <div className="filter-inner">
                            <div className="skeleton-pulse" style={{ width: '100%', height: '400px', borderRadius: '8px' }}></div>
                        </div>
                    </aside>

                    <div className="results-area">
                        <div className="results-header" style={{ marginBottom: '30px' }}>
                            <div className="skeleton-pulse" style={{ width: '60%', height: '40px', marginBottom: '10px' }}></div>
                            <div className="skeleton-pulse" style={{ width: '40%', height: '20px' }}></div>
                        </div>

                        <div className="trip-results-grid">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <TripCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

