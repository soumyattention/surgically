-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create simulations table for storing patient simulation data
CREATE TABLE public.simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  patient_name TEXT NOT NULL,
  procedure_id TEXT NOT NULL,
  procedure_name TEXT NOT NULL,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT,
  custom_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for simulations
CREATE POLICY "Users can view own simulations"
  ON public.simulations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations"
  ON public.simulations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations"
  ON public.simulations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own simulations"
  ON public.simulations FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for simulation images
INSERT INTO storage.buckets (id, name, public)
VALUES ('simulation-images', 'simulation-images', true);

-- Storage policies for simulation images
CREATE POLICY "Users can upload their own simulation images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'simulation-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own simulation images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'simulation-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view simulation images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'simulation-images');

CREATE POLICY "Users can update their own simulation images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'simulation-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own simulation images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'simulation-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_simulations_updated_at
  BEFORE UPDATE ON public.simulations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();