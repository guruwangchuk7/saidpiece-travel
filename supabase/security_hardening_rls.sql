-- Security Hardening: Enable RLS and define policies for all public tables
-- Project: saidpiece-travel
-- Author: Cyber Security Engineer Expert (AI)

-- 1. Enable RLS on all tables
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_departures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- 2. Helper function for staff checks (ensure it's robust)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (role IN ('staff', 'admin'))
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Define Policies

--------------------------------------------------------------------------------
-- AUDIT LOGS (Admin Only)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff can view audit logs" ON public.audit_logs;
CREATE POLICY "Staff can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.is_staff());

--------------------------------------------------------------------------------
-- BLOCKCHAIN BOOKINGS (User owned + Staff)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own blockchain bookings" ON public.blockchain_bookings;
CREATE POLICY "Users can view own blockchain bookings" ON public.blockchain_bookings
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.is_staff());

DROP POLICY IF EXISTS "Staff can manage blockchain bookings" ON public.blockchain_bookings;
CREATE POLICY "Staff can manage blockchain bookings" ON public.blockchain_bookings
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

--------------------------------------------------------------------------------
-- BLOG POSTS (Public read published, Staff manage all)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT TO anon, authenticated
    USING (status = 'published' OR public.is_staff());

DROP POLICY IF EXISTS "Staff can manage blog posts" ON public.blog_posts;
CREATE POLICY "Staff can manage blog posts" ON public.blog_posts
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

--------------------------------------------------------------------------------
-- CRYPTO PAYMENT INTENTS (User owned + Staff)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own crypto intents" ON public.crypto_payment_intents;
CREATE POLICY "Users can view own crypto intents" ON public.crypto_payment_intents
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.is_staff());

DROP POLICY IF EXISTS "Users can insert own crypto intents" ON public.crypto_payment_intents;
CREATE POLICY "Users can insert own crypto intents" ON public.crypto_payment_intents
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can manage crypto intents" ON public.crypto_payment_intents;
CREATE POLICY "Staff can manage crypto intents" ON public.crypto_payment_intents
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

--------------------------------------------------------------------------------
-- DESTINATIONS (Public read, Staff manage)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view destinations" ON public.destinations;
CREATE POLICY "Anyone can view destinations" ON public.destinations
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Staff can manage destinations" ON public.destinations;
CREATE POLICY "Staff can manage destinations" ON public.destinations
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

--------------------------------------------------------------------------------
-- ENQUIRIES (User owned + Staff, Guest insert)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own enquiries" ON public.enquiries;
CREATE POLICY "Users can view own enquiries" ON public.enquiries
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.is_staff());

DROP POLICY IF EXISTS "Anyone can insert enquiries" ON public.enquiries;
CREATE POLICY "Anyone can insert enquiries" ON public.enquiries
    FOR INSERT TO anon, authenticated
    WITH CHECK (true); -- Allow leads to come in from anywhere

DROP POLICY IF EXISTS "Staff can manage enquiries" ON public.enquiries;
CREATE POLICY "Staff can manage enquiries" ON public.enquiries
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

--------------------------------------------------------------------------------
-- FAQS (Public read, Staff manage)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view faqs" ON public.faqs;
CREATE POLICY "Anyone can view faqs" ON public.faqs
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Staff can manage faqs" ON public.faqs;
CREATE POLICY "Staff can manage faqs" ON public.faqs
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

--------------------------------------------------------------------------------
-- PROFILES (User owned + Staff)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id OR public.is_staff());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Staff can manage all profiles" ON public.profiles;
CREATE POLICY "Staff can manage all profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

--------------------------------------------------------------------------------
-- SITE SETTINGS (Public read, Staff manage)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view site settings" ON public.site_settings
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Staff can manage site settings" ON public.site_settings;
CREATE POLICY "Staff can manage site settings" ON public.site_settings
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

--------------------------------------------------------------------------------
-- TESTIMONIALS (Public read, Staff manage)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view testimonials" ON public.testimonials
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Staff can manage testimonials" ON public.testimonials;
CREATE POLICY "Staff can manage testimonials" ON public.testimonials
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

--------------------------------------------------------------------------------
-- TRIPS & DEPARTURES & ITINERARIES (Public read, Staff manage)
--------------------------------------------------------------------------------

-- Trips
DROP POLICY IF EXISTS "Anyone can view active trips" ON public.trips;
CREATE POLICY "Anyone can view active trips" ON public.trips
    FOR SELECT TO anon, authenticated
    USING (is_active = true OR public.is_staff());

DROP POLICY IF EXISTS "Staff can manage trips" ON public.trips;
CREATE POLICY "Staff can manage trips" ON public.trips
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Trip Departures
DROP POLICY IF EXISTS "Anyone can view trip departures" ON public.trip_departures;
CREATE POLICY "Anyone can view trip departures" ON public.trip_departures
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Staff can manage trip departures" ON public.trip_departures;
CREATE POLICY "Staff can manage trip departures" ON public.trip_departures
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Trip Itineraries
DROP POLICY IF EXISTS "Anyone can view trip itineraries" ON public.trip_itineraries;
CREATE POLICY "Anyone can view trip itineraries" ON public.trip_itineraries
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Staff can manage trip itineraries" ON public.trip_itineraries;
CREATE POLICY "Staff can manage trip itineraries" ON public.trip_itineraries
    FOR ALL TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());
