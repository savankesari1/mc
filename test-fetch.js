import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://keinsargadlkztqavmnu.supabase.co";
const SUPABASE_KEY = "sb_publishable_EwBziwtaqKAwABpJJQKJUA_6xeuv_aW";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function run() {
  const { data, error } = await supabase
    .from('resources')
    .select('id, slug, title')
    .eq('is_published', true);
  
  if (error) {
    console.error("ERROR:", error);
  } else {
    console.log("DATA:", data);
  }
}

run();
