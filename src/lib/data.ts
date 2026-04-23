import { unstable_cache } from 'next/cache';
import { createSupabaseAdminClient } from './supabaseAdmin';

/**
 * Fetch all active trips with caching.
 * Revalidates every 1 hour (3600 seconds).
 */
export const getCachedTrips = unstable_cache(
    async () => {
        try {
            const supabase = createSupabaseAdminClient();
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('is_active', true)
                .eq('is_published', true);
            
            if (error) throw error;
            return data || [];
        } catch (e) {
            console.error('Failed to fetch trips:', e);
            return [];
        }
    },
    ['all-trips'],
    { revalidate: 3600, tags: ['trips'] }
);

/**
 * Fetch a single trip by slug with caching.
 */
export const getCachedTripBySlug = (slug: string, isPreview: boolean = false) => unstable_cache(
    async () => {
        const supabase = createSupabaseAdminClient();
        let query = supabase
            .from('trips')
            .select('*')
            .eq('slug', slug);
        
        if (!isPreview) {
            query = query.eq('is_published', true);
        }

        const { data, error } = await query.single();
        
        if (error) return null;
        return data;
    },
    [`trip-${slug}-${isPreview}`],
    { revalidate: isPreview ? 1 : 3600, tags: ['trips', `trip-${slug}`] }
)();

/**
 * Fetch itinerary for a trip with caching.
 */
export const getCachedItinerary = (tripId: string) => unstable_cache(
    async () => {
        const supabase = createSupabaseAdminClient();
        const { data, error } = await supabase
            .from('trip_itineraries')
            .select('*')
            .eq('trip_id', tripId)
            .order('day_number', { ascending: true });
        
        if (error) return [];
        return data || [];
    },
    [`itinerary-${tripId}`],
    { revalidate: 3600, tags: ['itineraries', `itinerary-${tripId}`] }
)();

/**
 * Fetch published blog posts with caching.
 */
export const getCachedBlogPosts = unstable_cache(
    async () => {
        try {
            const supabase = createSupabaseAdminClient();
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (e) {
            console.error('Failed to fetch blog posts:', e);
            return [];
        }
    },
    ['blog-posts'],
    { revalidate: 60, tags: ['blog'] }
);

/**
 * Fetch a single blog post by slug with caching.
 */
export const getCachedBlogPostBySlug = (slug: string) => unstable_cache(
    async () => {
        const supabase = createSupabaseAdminClient();
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();
        
        if (error) return null;
        return data;
    },
    [`blog-${slug}`],
    { revalidate: 60, tags: ['blog', `blog-${slug}`] }
)();

/**
 * Fetch all FAQs with caching.
 */
export const getCachedFaqs = unstable_cache(
    async () => {
        const supabase = createSupabaseAdminClient();
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('created_at', { ascending: true });

        
        if (error) throw error;
        return data || [];
    },
    ['all-faqs'],
    { revalidate: 86400, tags: ['faqs'] }
);
