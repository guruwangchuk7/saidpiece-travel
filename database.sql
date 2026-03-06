-- Supabase PostgreSQL Schema for Saidpiece Travelers
-- Designed for 3rd Normal Form (3NF) and Supabase architecture

-- 1. Create Custom Types & Enums
CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');
CREATE TYPE enquiry_status AS ENUM ('new', 'proposed', 'awaiting_payment', 'confirmed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE departure_status AS ENUM ('available', 'guaranteed', 'limited_space', 'sold_out');

-- 2. Profiles Table (Extending default auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    role user_role DEFAULT 'customer'::user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for profiles email
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- 3. Trips Table (Catalog / Packages)
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    duration_nights INTEGER NOT NULL CHECK (duration_nights >= 0),
    starting_price DECIMAL(10, 2) NOT NULL CHECK (starting_price >= 0),
    level VARCHAR(100), -- e.g., 'Family Friendly', 'Moderate'
    image_url VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for trip lookups
CREATE INDEX idx_trips_slug ON public.trips(slug);
CREATE INDEX idx_trips_is_active ON public.trips(is_active);

-- 4. Trip Departures Table (Dates & Pricing)
CREATE TABLE public.trip_departures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    status departure_status DEFAULT 'available'::departure_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_end_after_start CHECK (end_date >= start_date)
);

-- Index for finding departures by trip and date
CREATE INDEX idx_trip_departures_trip_id ON public.trip_departures(trip_id);
CREATE INDEX idx_trip_departures_start_date ON public.trip_departures(start_date);

-- 5. Enquiries / Bookings Table
CREATE TABLE public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable for guest enquiries
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    departure_id UUID REFERENCES public.trip_departures(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passengers_count INTEGER DEFAULT 1 NOT NULL CHECK (passengers_count > 0),
    message TEXT,
    trip_name_fallback VARCHAR(255), -- Fallback if not linked to a trip_id
    proposed_date DATE,
    total_amount DECIMAL(10, 2) CHECK (total_amount >= 0),
    status enquiry_status DEFAULT 'new'::enquiry_status NOT NULL,
    payment_status payment_status DEFAULT 'pending'::payment_status NOT NULL,
    stripe_session_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for enquiries filtering
CREATE INDEX idx_enquiries_user_id ON public.enquiries(user_id);
CREATE INDEX idx_enquiries_email ON public.enquiries(email);
CREATE INDEX idx_enquiries_status ON public.enquiries(status);
CREATE INDEX idx_enquiries_stripe_session ON public.enquiries(stripe_session_id);

-- 6. Functions & Triggers for updated_at Auto-Update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON public.trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_departures_updated_at
    BEFORE UPDATE ON public.trip_departures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at
    BEFORE UPDATE ON public.enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Row Level Security (RLS) Policies (Examples)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_departures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile. Staff/Admin can read all.
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Trips: Anyone can read active trips. Admin can edit.
CREATE POLICY "Public read active trips" ON public.trips FOR SELECT USING (is_active = true);

-- Trip Departures: Anyone can read.
CREATE POLICY "Public read trip departures" ON public.trip_departures FOR SELECT USING (true);

-- Enquiries: Users can view/create their own. Staff/Admin can view/edit all.
CREATE POLICY "Users can create enquiries" ON public.enquiries FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can view own enquiries" ON public.enquiries FOR SELECT USING (auth.uid() = user_id);

-- 8. Auto-Create Profile on Signup
-- This function automatically inserts a row into public.profiles 
-- whenever a new user signs up via Supabase Auth (e.g., Google login).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    -- Extract full name from Google metadata if available
    NEW.raw_user_meta_data->>'full_name',
    -- Default everyone to 'customer'. 
    -- You can manually change your admin emails to 'staff' or 'admin' in the database later.
    'customer'::public.user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger that fires the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
