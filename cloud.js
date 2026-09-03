/* ============ Compte & synchronisation de la progression (Supabase) ============ */
'use strict';

/* État de la connexion cloud. Utilisé par app.js. */
const CLOUD = {
  prêt: false,          // config présente ET SDK chargé
  client: null,
  utilisateur: null,    // { id, email } — null si déconnecté
  timer: null,          // débounce de sauvegarde
};

function cloudConfiguré() {
  return !!(typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
}

function cloudInit() {
  if (!cloudConfiguré()) return false;
  try {
    if (!window.supabase || !window.supabase.createClient) return false;
    CLOUD.client = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    CLOUD.prêt = true;
    // Restaure la session (reconnexion automatique) et réagit aux changements.
    CLOUD.client.auth.onAuthStateChange((_événement, session) => {
      if (typeof appliquerSession === 'function') appliquerSession(session);
    });
    return true;
  } catch (e) {
    return false;
  }
}

async function cloudSeConnecter(email, motDePasse) {
  const { data, error } = await CLOUD.client.auth.signInWithPassword({ email, password: motDePasse });
  if (error) throw new Error(error.message);
  return data;
}

async function cloudCréerCompte(email, motDePasse) {
  const { data, error } = await CLOUD.client.auth.signUp({ email, password: motDePasse });
  if (error) throw new Error(error.message);
  return data;
}

async function cloudSeDéconnecter() {
  if (!CLOUD.prêt) return;
  await CLOUD.client.auth.signOut();
}

async function cloudChargerProgression(userId) {
  const { data, error } = await CLOUD.client
    .from('profils')
    .select('progress, updated_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? { progress: data.progress, updatedAt: data.updated_at } : null;
}

async function cloudSauvegarderProgression(userId, progress) {
  const { error } = await CLOUD.client
    .from('profils')
    .upsert({ id: userId, progress, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

async function cloudSupprimerProgression(userId) {
  const { error } = await CLOUD.client
    .from('profils')
    .delete()
    .eq('id', userId);
  if (error) throw new Error(error.message);
}

/* Sauvegarde différée (débounce) pour ne pas écrire à chaque clic. */
function cloudPlanifierSauvegarde(état) {
  if (!CLOUD.prêt || !CLOUD.utilisateur || !état) return;
  clearTimeout(CLOUD.timer);
  CLOUD.timer = setTimeout(async () => {
    try {
      await cloudSauvegarderProgression(CLOUD.utilisateur.id, état);
      if (typeof majIndicateurCloud === 'function') majIndicateurCloud('ok');
    } catch (e) {
      if (typeof majIndicateurCloud === 'function') majIndicateurCloud('err');
    }
  }, 1500);
}