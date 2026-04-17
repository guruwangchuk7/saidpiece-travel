import React from 'react';

export function TripCardSkeleton() {
  return (
    <div className="trip-card skeleton">
      <div className="image-placeholder skeleton-pulse" style={{ height: '220px' }}></div>
      <div className="trip-card-content">
        <div className="skeleton-text skeleton-pulse" style={{ width: '80%', height: '24px', marginBottom: '15px' }}></div>
        <div className="skeleton-text skeleton-pulse" style={{ width: '40%', height: '16px', marginBottom: '20px' }}></div>
        <div className="trip-card-footer">
          <div className="skeleton-text skeleton-pulse" style={{ width: '30%', height: '20px' }}></div>
          <div className="skeleton-text skeleton-pulse" style={{ width: '25%', height: '30px' }}></div>
        </div>
      </div>
    </div>
  );
}

export function ItinerarySkeleton() {
  return (
    <div className="itinerary-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-item" style={{ marginBottom: '15px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
          <div className="skeleton-text skeleton-pulse" style={{ width: '100%', height: '50px' }}></div>
        </div>
      ))}
    </div>
  );
}

