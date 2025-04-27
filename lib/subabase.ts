import { createClient } from "@supabase/supabase-js";
// import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUBABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ACCESS_KEY!;

// Create a single supabase client for the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

