-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.crypto_payment_intents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  enquiry_id uuid,
  user_email character varying NOT NULL,
  traveler_name character varying NOT NULL,
  trip_name character varying NOT NULL,
  fiat_currency character varying NOT NULL,
  fiat_amount numeric NOT NULL CHECK (fiat_amount >= 0::numeric),
  token_symbol character varying NOT NULL,
  token_address character varying NOT NULL,
  token_decimals integer NOT NULL CHECK (token_decimals >= 0),
  expected_token_amount numeric NOT NULL CHECK (expected_token_amount >= 0::numeric),
  expected_token_amount_base_units character varying NOT NULL,
  received_token_amount numeric,
  received_token_amount_base_units character varying,
  chain_id bigint NOT NULL,
  recipient_address character varying NOT NULL,
  sender_address character varying,
  tx_hash character varying UNIQUE,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::crypto_payment_status,
  quote_expires_at timestamp with time zone NOT NULL,
  verified_at timestamp with time zone,
  failure_code character varying,
  failure_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT crypto_payment_intents_pkey PRIMARY KEY (id),
  CONSTRAINT crypto_payment_intents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT crypto_payment_intents_enquiry_id_fkey FOREIGN KEY (enquiry_id) REFERENCES public.enquiries(id)
);

CREATE TABLE public.enquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  trip_id uuid,
  departure_id uuid,
  first_name character varying NOT NULL,
  email character varying NOT NULL,
  passengers_count integer NOT NULL DEFAULT 1 CHECK (passengers_count > 0),
  message text,
  trip_name_fallback character varying,
  proposed_date date,
  total_amount numeric CHECK (total_amount >= 0::numeric),
  status USER-DEFINED NOT NULL DEFAULT 'new'::enquiry_status,
  payment_status USER-DEFINED NOT NULL DEFAULT 'pending'::payment_status,
  stripe_session_id character varying UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT enquiries_pkey PRIMARY KEY (id),
  CONSTRAINT enquiries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT enquiries_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT enquiries_departure_id_fkey FOREIGN KEY (departure_id) REFERENCES public.trip_departures(id)
);

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  role USER-DEFINED NOT NULL DEFAULT 'customer'::user_role,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.trip_departures (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  status USER-DEFINED NOT NULL DEFAULT 'available'::departure_status,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT trip_departures_pkey PRIMARY KEY (id),
  CONSTRAINT trip_departures_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id)
);

CREATE TABLE public.trips (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  duration_days integer NOT NULL CHECK (duration_days > 0),
  duration_nights integer NOT NULL CHECK (duration_nights >= 0),
  starting_price numeric NOT NULL CHECK (starting_price >= 0::numeric),
  level character varying,
  image_url character varying,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT trips_pkey PRIMARY KEY (id)
);
