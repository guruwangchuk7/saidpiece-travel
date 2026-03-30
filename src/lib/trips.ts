import { supabase } from './supabaseClient';

export interface Trip {
    id: string;
    title: string;
    slug: string;
    duration_days: number;
    duration_nights: number;
    starting_price: number;
    level: string;
    image_url: string;
    description: string;
    is_active: boolean;
    type?: string; // Mapped from metadata or additional columns if needed
    activity?: string;
    destination?: string;
    tags?: string[];
}

export async function getTrips() {
    if (!supabase) return [];
    
    const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('is_active', true);
    
    if (error) {
        console.error('Error fetching trips:', error);
        return [];
    }
    
    return data as Trip[];
}

export async function getTripBySlug(slug: string) {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('slug', slug)
        .single();
    
    if (error) {
        console.error(`Error fetching trip with slug ${slug}:`, error);
        return null;
    }
    
    return data as Trip;
}
