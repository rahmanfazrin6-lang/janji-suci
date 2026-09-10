const supabaseConfig = window.__SUPABASE_CONFIG__ || {};
const supabaseClient = window.supabase?.createClient?.(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

function requireSupabase() {
  if (!supabaseClient) {
    throw new Error('Supabase belum terkonfigurasi. Periksa VITE_PUBLIC_SUPABASE_URL dan VITE_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return supabaseClient;
}

async function registerWithSupabase({ nama, email, password }) {
  const { data, error } = await requireSupabase().auth.signUp({
    email,
    password,
    options: { data: { nama } },
  });
  if (error) throw error;
  return data.user;
}

async function loginWithSupabase({ email, password }) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

async function logoutFromSupabase() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}

async function getSupabaseSession() {
  const { data, error } = await requireSupabase().auth.getSession();
  if (error) throw error;
  return data.session;
}

async function saveSupabaseAppData(appData) {
  const client = requireSupabase();
  const { data: current, error: currentError } = await client.auth.getUser();
  if (currentError) throw currentError;
  const { error } = await client.from('wedding_plans').upsert({
    user_id: current.user.id,
    data: appData,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function loadSupabaseAppData() {
  const client = requireSupabase();
  const { data, error } = await client.from('wedding_plans').select('data').maybeSingle();
  if (error) throw error;
  return data?.data || null;
}

function getSupabaseUser(user) {
  return user ? {
    id: user.id,
    nama: user.user_metadata?.nama || user.email?.split('@')[0] || 'Mempelai',
    email: user.email || '',
  } : null;
}
