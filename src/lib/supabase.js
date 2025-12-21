import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iaffymcabxiwjxjpsmqo.supabase.co';
const supabaseKey = 'sb_publishable_HE_I4AdZNgFz_jwtxmz6NA_Rh2rld1j';

export const supabase = createClient(supabaseUrl, supabaseKey);
