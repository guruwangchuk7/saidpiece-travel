-- Strictly Schema-Compliant Seed Content for Saidpiece Travelers
-- Refer to contentforsaidpiecetravel/content.md for sources

-- 1. Site Settings (key, value, description)
INSERT INTO public.site_settings (key, value, description) VALUES
('site_name', 'Saidpiece Travelers', 'The name of the website'),
('contact_email', 'saidpiece@gmail.com', 'Primary contact email'),
('hero_title', 'A Journey Created with Heart so Bhutan Stays with You for Life', 'Main landing page headline'),
('hero_sub_title', 'Private journeys in Bhutan: locally rooted, mindful, and tailored', 'Main landing page sub-headline'),
('intro_title', 'A Journey Created with Heart', 'Introduction section title'),
('intro_text_1', 'At Saidpiece Travelers, we believe travel to Bhutan should feel personal, meaningful, and unhurried. Every journey we design is crafted to help you experience the real rhythm of the country— its quiet monasteries, mountain valleys, living traditions, and warm hospitality.', 'First paragraph of intro'),
('story_quote', 'The most meaningful journeys are those that lead us not just to new places, but to new ways of seeing the world.', 'Founders story quote'),
('story_body_1', 'Saidpiece Travel was born from my desire to share the true feeling of my home, Bhutan. After returning from abroad and reflecting on our family''s deep roots in hospitality, I realized that many travelers miss the soul of the country.', 'Founders story first paragraph')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. FAQs (id, question, answer, category)
INSERT INTO public.faqs (id, question, answer, category) VALUES
(gen_random_uuid(), 'How hard is the Tiger''s Nest (Taktsang) hike?', 'It is a moderate 4-6 hour round trip. The trail is well-maintained but steep. Most people with average fitness can do it at a steady pace.', 'Activities'),
(gen_random_uuid(), 'Is Bhutan a luxury destination?', 'Bhutan is a premium destination due to the $200 per day Sustainable Development Fee (SDF). However, the true luxury is the unhurried pace and deep cultural connection.', 'Planning'),
(gen_random_uuid(), 'Can I customize my trip?', 'Absolutely. Every itinerary we publish is just a starting point. We specialize in tailoring journeys to your specific interests.', 'Booking')
ON CONFLICT (question) DO NOTHING;

-- 3. Destinations (id, name, title, slug, description, image_url, sort_order)
INSERT INTO public.destinations (name, title, slug, description, image_url, sort_order) VALUES
('Paro', 'The Gateway Valley', 'paro-valley', 'Home to the iconic Tiger’s Nest monastery, Paro is a beautiful valley of rice fields and ancient fortresses.', 'bhutan/main4.webp', 1),
('Thimphu', 'The Living Capital', 'thimphu', 'Bhutan’s vibrant capital city, where traditional architecture meets modern Himalayan life.', 'bhutan/7.webp', 2),
('Punakha', 'The Ancient Seat', 'punakha', 'A warm, fertile valley famous for its spectacular Dzong at the confluence of two major rivers.', 'bhutan/main5.webp', 3),
('Bumthang', 'The Spiritual Heartland', 'bumthang', 'Bhutan’s most sacred district, home to its oldest temples and deeply traditional way of life.', 'bhutan/8.webp', 4)
ON CONFLICT (name) DO UPDATE SET 
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order;

-- 4. Trips (id, title, slug, duration_days, duration_nights, starting_price, level, image_url, description, trip_type, destination, category)
INSERT INTO public.trips (id, title, slug, duration_days, duration_nights, starting_price, level, image_url, description, trip_type, destination, category) VALUES
('b3a165b4-929a-463e-8c34-eb54e2096752', 'Bhutan Discovery', 'bhutan-discovery', 8, 7, 2400, 'Easy Active', 'bhutan/main4.webp', 'Perfect First-Time Journey to Paro, Thimphu & Punakha. Experience Bhutan''s iconic destinations without feeling rushed.', 'Private Journey', 'Paro', 'Cultural'),
('f71d5b30-e83c-11ed-a05b-0242ac120003', 'Cultural Immersion', 'cultural-immersion', 12, 11, 3600, 'Cultural', 'bhutan/main5.webp', 'A Deep-Dive into Bhutanese Traditions. Go beyond the surface and connect with the soul of the Dragon Kingdom.', 'Private Journey', 'Central Bhutan', 'Cultural'),
('a83e6c41-f92d-11ed-be56-0242ac120002', 'Nature & Wellness Retreat', 'nature-retreat', 10, 9, 3000, 'Wellness', 'bhutan/main6.webp', 'Quiet Valleys & Spiritual Stillness. A journey designed for those seeking peace and reconnection with nature.', 'Nature', 'Phobjikha', 'Wellness'),
('d94f7d52-0a3e-11ee-be56-0242ac120002', 'Bhutan Family Adventure', 'bhutan-family-adventure', 10, 9, 3000, 'Family Friendly', 'bhutan/9.webp', 'A Memorable Journey for All Ages. Crafted for families seeking meaningful adventure and hands-on experiences.', 'Family', 'Western Bhutan', 'Family'),
('e0508e63-1b4f-11ee-be56-0242ac120002', 'Romantic Escape', 'romantic-escape', 10, 9, 3800, 'Luxury', 'bhutan/10.webp', 'An Unforgettable Honeymoon or Anniversary. Intimate moments in one of the world''s most romantic destinations.', 'Luxury', 'Paro', 'Romantic'),
('c1619f74-2c50-11ee-be56-0242ac120002', 'Druk Path Trek', 'druk-path-trek', 6, 5, 1800, 'Moderate', 'bhutan/11.webp', 'The Most Popular High Altitude Trek in Bhutan. Incredible views of Mt. Gangkar Puensum.', 'Trek', 'Paro', 'Hiking'),
('b2720d85-3d61-11ee-be56-0242ac120002', 'Festival Tours', 'festival-tours', 10, 9, 3000, 'Cultural', 'bhutan/12.webp', 'Witness the Vibrant Tshechu Festivals. A riot of colors, mask dances, and spiritual fervor.', 'Cultural', 'Punakha', 'Festival')
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    duration_days = EXCLUDED.duration_days,
    duration_nights = EXCLUDED.duration_nights,
    starting_price = EXCLUDED.starting_price,
    level = EXCLUDED.level,
    image_url = EXCLUDED.image_url,
    description = EXCLUDED.description,
    trip_type = EXCLUDED.trip_type,
    destination = EXCLUDED.destination,
    category = EXCLUDED.category;

-- 5. Trip Itineraries (trip_id, day_number, title, description)
INSERT INTO public.trip_itineraries (id, trip_id, day_number, title, description) VALUES
(gen_random_uuid(), 'b3a165b4-929a-463e-8c34-eb54e2096752', 1, 'Arrival & Spirit of Paro', 'Arrive in Paro. Welcome dinner with organic local ingredients.'),
(gen_random_uuid(), 'b3a165b4-929a-463e-8c34-eb54e2096752', 2, 'Paro Heritage', 'Visit Rinpung Dzong and exploring the valley''s sacred sites.'),
(gen_random_uuid(), 'b3a165b4-929a-463e-8c34-eb54e2096752', 3, 'Tiger''s Nest Hike', 'Ascend to Taktsang Monastery, the iconic high point of any journey.')
ON CONFLICT DO NOTHING;

-- 6. Testimonials (client_name, role, content, is_featured)
INSERT INTO public.testimonials (id, client_name, role, content, is_featured) VALUES
(gen_random_uuid(), 'Sarah Mitchell', 'Traveler', 'The entire trip was perfectly orchestrated. Our guide was incredibly knowledgeable and passionate.', true),
(gen_random_uuid(), 'Elena Rodriguez', 'Traveler', 'An absolute life-changing experience. Being so close to nature was incredible.', true)
ON CONFLICT DO NOTHING;

-- 7. Sample Enquiry (For testing the Admin Dashboard)
INSERT INTO public.enquiries (id, first_name, email, trip_name_fallback, message, status, created_at) VALUES
(gen_random_uuid(), 'John Doe', 'john@example.com', 'Bhutan Discovery', 'I am interested in a private tour for two people in October.', 'new', NOW())
ON CONFLICT DO NOTHING;

-- NOTE: To access the Admin Dashboard, ensure your user profile in Supabase 
-- has the role 'admin' or 'staff'. You can run this manually in the SQL Editor:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@gmail.com';
