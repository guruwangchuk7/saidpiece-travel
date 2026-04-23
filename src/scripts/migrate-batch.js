const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const tripsToMigrate = [
    {
        trip: {
            title: 'Bhutan Discovery',
            slug: 'bhutan-discovery',
            duration_days: 8,
            duration_nights: 7,
            starting_price: 2400,
            level: 'Easy',
            image_url: 'bhutan/main4.webp',
            description: "Bhutan is one of the few places where travel still feels meaningful— quiet monasteries above pine forests, rivers flowing through fertile valleys, and a culture guided by the philosophy of Gross National Happiness.",
            category: 'Cultural',
            destination: 'Bhutan',
            is_active: true,
            is_published: true
        },
        itinerary: [
            { day_number: 1, title: 'Arrive in Paro', description: 'Arrive in Paro and transfer to your hotel. Enjoy a gentle acclimatisation walk and a welcome dinner.' },
            { day_number: 2, title: 'Paro Valley Heritage', description: 'Visit Rinpung Dzong viewpoint and explore Bhutanese heritage sites.' },
            { day_number: 3, title: "Tiger's Nest Monastery Hike", description: "Hike to the famous Taktsang Monastery, Bhutan's most sacred pilgrimage site." },
            { day_number: 4, title: 'Paro to Thimphu', description: 'Drive to Thimphu and visit Buddha Dordenma overlooking the valley.' },
            { day_number: 5, title: 'Thimphu Culture & Crafts', description: 'Explore Bhutan’s traditional crafts, markets, and cultural heritage.' },
            { day_number: 6, title: 'Thimphu to Punakha', description: 'Cross Dochula Pass and descend into the Punakha Valley.' },
            { day_number: 7, title: 'Punakha Valley Exploration', description: 'Gentle hike to Khamsum Chorten and explore the valley.' },
            { day_number: 8, title: 'Departure', description: 'Transfer to Paro airport for departure.' }
        ]
    },
    {
        trip: {
            title: 'Bhutan Peaks & Valleys',
            slug: 'bhutan-peaks-valleys',
            duration_days: 14,
            duration_nights: 13,
            starting_price: 8295,
            level: 'Strenuous',
            image_url: 'bhutan/main4.webp',
            description: "For the truly adventurous. This 14-day expedition reaches the highest peaks and deepest valleys of Bhutan, offering unparalleled views of the Himalayas.",
            category: 'Adventure',
            destination: 'Bhutan',
            is_active: true,
            is_published: true
        },
        itinerary: [
            { day_number: 1, title: 'Arrival', description: 'Arrival in Paro and initial briefing.' },
            { day_number: 2, title: 'Acclimatization', description: 'Gentle hikes around Paro to prepare for high altitudes.' },
            { day_number: 14, title: 'Departure', description: 'Transfer to Paro airport.' }
        ]
    },
    {
        trip: {
            title: 'Bhutan Family Adventure',
            slug: 'bhutan-family-adventure',
            duration_days: 10,
            duration_nights: 9,
            starting_price: 3000,
            level: 'Easy',
            image_url: 'bhutan/9.webp',
            description: "A journey crafted for families seeking meaningful adventure. Discover a kingdom where success is measured in happiness, nature is revered, and children are welcomed with open arms.",
            category: 'Family',
            destination: 'Bhutan',
            is_active: true,
            is_published: true
        },
        itinerary: [
            { day_number: 1, title: 'Welcome to Bhutan', description: 'Arrive in Paro. Drive to Thimphu and settle into your family-friendly hotel.' },
            { day_number: 2, title: 'Takins & Stamps', description: 'Visit the Motithang Takin Preserve and the General Post Office.' },
            { day_number: 3, title: 'Folk Heritage', description: 'Visit the Simply Bhutan museum for interactive demonstrations.' },
            { day_number: 10, title: 'Departure', description: 'Say goodbye to the Dragon Kingdom.' }
        ]
    }
];

async function migrateAll() {
    for (const item of tripsToMigrate) {
        console.log(`Migrating ${item.trip.title}...`);
        
        const { data: trip, error: tripError } = await supabase
            .from('trips')
            .upsert(item.trip, { onConflict: 'slug' })
            .select()
            .single();

        if (tripError) {
            console.error(`Error upserting ${item.trip.title}:`, tripError);
            continue;
        }

        console.log(`Trip ${trip.title} upserted. Syncing itinerary...`);

        await supabase.from('trip_itineraries').delete().eq('trip_id', trip.id);

        const itineraryToInsert = item.itinerary.map(i => ({
            ...i,
            trip_id: trip.id
        }));

        const { error: itinError } = await supabase.from('trip_itineraries').insert(itineraryToInsert);

        if (itinError) {
            console.error(`Error inserting itinerary for ${trip.title}:`, itinError);
        } else {
            console.log(`Itinerary for ${trip.title} migrated successfully.`);
        }
    }
}

migrateAll();
