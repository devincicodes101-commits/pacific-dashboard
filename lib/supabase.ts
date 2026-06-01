import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE = process.env.SUPABASE_SERVICE_KEY!;

// Client-side (used for Realtime subscriptions)
export const supabase = createClient(URL, ANON);

// Server-side (used for writing data)
export const supabaseAdmin = createClient(URL, SERVICE);
