
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
const envVars = {};
envLines.forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.join('=').trim();
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function publishTrips() {
    const slugsToPublish = ['nature-retreat', 'cultural-immersion'];
    
    const { data, error } = await supabase
        .from('trips')
        .update({ is_published: true })
        .in('slug', slugsToPublish)
        .select();
    
    if (error) {
        console.error('Error publishing trips:', error);
        return;
    }

    console.log('Published trips:', data.map(t => t.slug));
}

publishTrips();
