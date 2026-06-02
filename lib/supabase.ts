import { createClient, SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_KEY;

// Client-side (Realtime). Guarded so a missing public env var never blanks the page.
export const supabase: SupabaseClient | null =
  URL && ANON ? createClient(URL, ANON) : null;

// Server-side (writes/reads in API routes).
export const supabaseAdmin: SupabaseClient | null =
  URL && SERVICE ? createClient(URL, SERVICE) : null;
