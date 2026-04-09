-- ==========================================
-- PRODUCTION BOOKINGS MIGRATION (FIXED)
-- Targeted for Saidpiece Travel V2
-- ==========================================

-- 1. Create Booking Status Enum (Safe/Idempotent)
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'awaiting_payment', 'paid', 'confirmed', 'failed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Create or Upgrade Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE RESTRICT,
    departure_id UUID REFERENCES public.trip_departures(id) ON DELETE SET NULL,
    traveler_name VARCHAR(255),
    traveler_email VARCHAR(255),
    passengers_count INTEGER DEFAULT 1 NOT NULL CHECK (passengers_count > 0),
    total_amount DECIMAL(12, 2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', 
    payment_method VARCHAR(50), 
    payment_reference VARCHAR(255) UNIQUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Comprehensive Column Upgrade (Ensures every single column is present)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS trip_id UUID REFERENCES public.trips(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS departure_id UUID REFERENCES public.trip_departures(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS traveler_name VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS traveler_email VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS passengers_count INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS total_amount DECIMAL(12, 2) DEFAULT 0 NOT NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD' NOT NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Cast status column to Enum safely
DO $$ BEGIN
    ALTER TABLE public.bookings 
    ALTER COLUMN status TYPE booking_status USING (status::booking_status);
EXCEPTION WHEN others THEN
    RAISE NOTICE 'Skipping status cast as it might already be an enum or empty.';
END $$;

-- 5. Add Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_reference ON public.bookings(payment_reference);

-- 6. Enable RLS & Policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings" ON public.bookings 
    FOR SELECT USING (auth.uid() = user_id OR public.is_staff());

DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
CREATE POLICY "Users can insert own bookings" ON public.bookings 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can manage all bookings" ON public.bookings;
CREATE POLICY "Staff can manage all bookings" ON public.bookings 
    FOR ALL USING (public.is_staff());

-- 7. Cross-table links for tracking
ALTER TABLE public.crypto_payment_intents 
ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL;

ALTER TABLE public.enquiries 
ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL;
