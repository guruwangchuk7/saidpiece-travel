const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('Starting migration for Bhutan Discovery...');

    const tripSlug = 'bhutan-discovery';
    
    // 1. Upsert Trip
    const { data: trip, error: tripError } = await supabase
        .from('trips')
        .upsert({
            title: 'Bhutan Discovery',
            slug: tripSlug,
            duration_days: 8,
            duration_nights: 7,
            starting_price: 2400,
            level: 'Easy',
            image_url: 'bhutan/main4.webp',
            description: "Bhutan is one of the few places where travel still feels meaningful— quiet monasteries above pine forests, rivers flowing through fertile valleys, and a culture guided by the philosophy of Gross National Happiness. This journey is designed for first-time visitors who want to experience Bhutan's iconic destinations without feeling rushed, while enjoying private guiding, seamless travel arrangements, and comfortable boutique stays.",
            category: 'Private Journey',
            destination: 'Bhutan',
            is_active: true
        }, { onConflict: 'slug' })
        .select()
        .single();

    if (tripError) {
        console.error('Error upserting trip:', tripError);
        return;
    }

    console.log('Trip upserted:', trip.id);

    // 2. Clear existing itinerary
    await supabase.from('trip_itineraries').delete().eq('trip_id', trip.id);

    // 3. Insert Itinerary
    const itinerary = [
        {
            trip_id: trip.id,
            day_number: 1,
            title: 'Arrive in Paro',
            description: 'Arrive in Paro and transfer to your hotel. Enjoy a gentle acclimatisation walk and a welcome dinner.',
            accommodation: 'Boutique Hotel, Paro',
            meals: 'Dinner'
        },
        {
            trip_id: trip.id,
            day_number: 2,
            title: 'Paro Valley Heritage',
            description: 'Visit Rinpung Dzong viewpoint and explore Bhutanese heritage sites. Optional farmhouse lunch and quiet monastery visit.',
            accommodation: 'Boutique Hotel, Paro',
            meals: 'Breakfast, Lunch'
        },
        {
            trip_id: trip.id,
            day_number: 3,
            title: "Tiger's Nest Monastery Hike",
            description: "Hike to the famous Taktsang Monastery, Bhutan's most sacred pilgrimage site.",
            accommodation: 'Boutique Hotel, Paro',
            meals: 'Breakfast, Lunch'
        },
        {
            trip_id: trip.id,
            day_number: 4,
            title: 'Paro to Thimphu',
            description: 'Drive to Thimphu and visit Buddha Dordenma overlooking the valley.',
            accommodation: 'Heritage Stay, Thimphu',
            meals: 'Breakfast'
        },
        {
            trip_id: trip.id,
            day_number: 5,
            title: 'Thimphu Culture & Crafts',
            description: 'Explore Bhutan’s traditional crafts, markets, and cultural heritage.',
            accommodation: 'Heritage Stay, Thimphu',
            meals: 'Breakfast, Lunch'
        },
        {
            trip_id: trip.id,
            day_number: 6,
            title: 'Thimphu to Punakha',
            description: 'Cross Dochula Pass and descend into the Punakha Valley.',
            accommodation: 'Riverside Lodge, Punakha',
            meals: 'Breakfast'
        },
        {
            trip_id: trip.id,
            day_number: 7,
            title: 'Punakha Valley Exploration',
            description: 'Gentle hike to Khamsum Chorten and explore the valley.',
            accommodation: 'Riverside Lodge, Punakha',
            meals: 'Breakfast, Lunch'
        },
        {
            trip_id: trip.id,
            day_number: 8,
            title: 'Departure',
            description: 'Transfer to Paro airport for departure.',
            accommodation: 'N/A',
            meals: 'Breakfast'
        }
    ];

    const { error: itinError } = await supabase.from('trip_itineraries').insert(itinerary);

    if (itinError) {
        console.error('Error inserting itinerary:', itinError);
    } else {
        console.log('Itinerary migrated successfully.');
    }
}

migrate();
