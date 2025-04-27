import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";
// import { createBrowserClient } from "@supabase/ssr";


// Create a single supabase client for the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

