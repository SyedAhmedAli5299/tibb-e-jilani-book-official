import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('***')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    supabase = null;
  }
}

if (!supabase) {
  console.warn(
    'Supabase credentials are not configured or are invalid. The app will run in a limited, offline mode. Please provide valid credentials in your .env file for full functionality.'
  );
}

export { supabase };
