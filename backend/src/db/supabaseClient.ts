import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Ensure environment variables are loaded in case client is imported in test runners
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from process.env."
  );
}

// Export server-only Supabase client utilizing the high-privilege service role key
export const supabase = createClient(
  supabaseUrl || "",
  supabaseServiceKey || ""
);
