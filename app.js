/* ============ PythonQuest — logique de l'application ============ */
'use strict';

/* ---------- État & persistance ---------- */
const STORAGE_KEY = 'pythonquest_progress_v1';
const PLAYGROUND_KEY = 'pythonquest_playground';

function stateParDefaut() {
  return {
    xp: 0,
    completed: {},          // niveau -> { lecon: true, quiz: true, project: true }
    exerciseSolved: {},     // 'niveau_lecon' -> true
    quizBest: {},           // 'niveau' -> meilleur score
    projectChecklist: {},   // 'niveau' -> [true, false, ...]
    quizParfait: {},        // niveau -> true (quiz réussi sans faute)
    badges: {},             // id de badge -> date ISO de déblocage
    stats: {                // statistiques pour les succès
      exercices: 0,
      playgroundRuns: 0,
      streak: 0,
      bestStreak: 0,
      lastVisit: null,      // date locale YYYY-MM-DD de la dernière visite
    },
    updatedAt: null,        // date de la dernière modification (pour la synchro cloud)
  };
}

let state = stateParDefaut();

function loadState() {
  try {
    const brut = localStorage.getItem(STORAGE_KEY);
    if (brut) state = Object.assign(stateParDefaut(), JSON.parse(brut));
  } catch (e) { /* stockage indisponible : on continue en mémoire */ }
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  // Synchronisation vers le compte, si connecté (cloud.js) :
  if (typeof cloudPlanifierSauvegarde === 'function') cloudPlanifierSauvegarde(state);
}

function addXp(n) {
  state.xp += n;
  saveState();
  majHeader();
}

/* ---------- Utilitaires ---------- */
function $(sel) { return document.querySelector(sel); }

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightPython(code) {
  const esc = escapeHtml(code);
  const re = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\b(def|class|if|elif|else|for|while|in|not|and|or|return|import|from|as|try|except|finally|raise|with|yield|async|await|lambda|True|False|None|pass|global|assert|is)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()|\b(self|cls)\b/g;
  return esc.replace(re, (m, com, str, kw, num, fn) => {
    if (com) return '<span class="tok-com">' + com + '</span>';
    if (str) return '<span class="tok-str">' + str + '</span>';
    if (kw) return '<span class="tok-kw">' + kw + '</span>';
    if (num) return '<span class="tok-num">' + num + '</span>';
    if (fn) return '<span class="tok-fn">' + fn + '</span>';
    return m;
  });
}

/* Les blocs de code sont stockés côté JS (et non dans des attributs HTML)
   pour éviter les soucis de guillemets dans le code Python. */
const blocsDeCode = new Map();
let compteurBlocs = 0;

function codeBlock(code, extraClass) {
  const id = 'bloc_' + (++compteurBlocs);
  blocsDeCode.set(id, code);
  return `
    <div class="code-block ${extraClass || ''}">
      <div class="code-actions">
        <button class="run" data-block="${id}" data-run="1">▶️ Exécuter</button>
        <button data-block="${id}" data-copy="1">📋 Copier</button>
      </div>
      <pre>${highlightPython(code)}</pre>
    </div>`;
}

function niveauParId(id) { return LEVELS.find(n => n.id === id); }
function leconParId(niveau, id) { return niveau.lessons.find(l => l.id === id); }
function estTermine(niveauId, itemId) {
  return !!(state.completed[niveauId] && state.completed[niveauId][itemId]);
}
function marquerTermine(niveauId, itemId) {
  if (!state.completed[niveauId]) state.completed[niveauId] = {};
  if (!state.completed[niveauId][itemId]) {
    state.completed[niveauId][itemId] = true;
    saveState();
    return true; // nouvellement terminé
  }
  return false;
}

function progressionNiveau(niveau) {
  let done = 0;
  let total = niveau.lessons.length + 2; // + quiz + projet
  for (const l of niveau.lessons) if (estTermine(niveau.id, l.id)) done++;
  if (estTermine(niveau.id, 'quiz')) done++;
  if (estTermine(niveau.id, 'project')) done++;
  return { done, total, pct: Math.round((done / total) * 100) };
}

function progressionGlobale() {
  let done = 0;
  for (const niveau of LEVELS) {
    for (const l of niveau.lessons) if (estTermine(niveau.id, l.id)) done++;
    if (estTermine(niveau.id, 'quiz')) done++;
    if (estTermine(niveau.id, 'project')) done++;
  }
  return { done, total: TOTAL_ETAPES, pct: Math.round((done / TOTAL_ETAPES) * 100) };
}

/* ---------- Succès & badges ---------- */
const BADGES = [
  { id: 'premiere_lecon', emoji: '📘', nom: 'Première leçon', desc: 'Termine ta première leçon' },
  { id: 'premier_exercice', emoji: '💪', nom: 'Premier pas', desc: 'Réussis ton premier exercice' },
  { id: 'exercices_5', emoji: '✍️', nom: 'En pleine forme', desc: 'Réussis 5 exercices' },
  { id: 'exercices_15', emoji: '🔥', nom: 'Machine à résoudre', desc: 'Réussis 15 exercices' },
  { id: 'premier_quiz', emoji: '❓', nom: 'Sous pression', desc: 'Termine ton premier quiz' },
  { id: 'quiz_parfait', emoji: '🎯', nom: 'Score parfait', desc: 'Fais un sans-faute à un quiz' },
  { id: 'quiz_parfait_tous', emoji: '👑', nom: 'Maître des quiz', desc: 'Fais un sans-faute aux 4 quiz' },
  { id: 'premier_projet', emoji: '🛠️', nom: 'Premier projet', desc: 'Valide ton premier projet' },
  { id: 'tous_projets', emoji: '🏗️', nom: 'Architecte', desc: 'Valide les 4 projets du parcours' },
  { id: 'niveau_1', emoji: '🌱', nom: 'Fondations posées', desc: 'Termine 100 % du Niveau 1' },
  { id: 'niveau_2', emoji: '🚀', nom: 'Décollage', desc: 'Termine 100 % du Niveau 2' },
  { id: 'niveau_3', emoji: '⚙️', nom: 'Professionnel', desc: 'Termine 100 % du Niveau 3' },
  { id: 'niveau_4', emoji: '🏆', nom: 'Pro', desc: 'Termine 100 % du Niveau 4' },
  { id: 'parcours_complet', emoji: '🌟', nom: 'PythonQuest terminé', desc: 'Termine les 4 niveaux du parcours' },
  { id: 'xp_100', emoji: '🎈', nom: '100 XP', desc: 'Cumule 100 points d\'expérience' },
  { id: 'xp_500', emoji: '💎', nom: '500 XP', desc: 'Cumule 500 points d\'expérience' },
  { id: 'xp_1000', emoji: '🏅', nom: '1000 XP', desc: 'Cumule 1000 points d\'expérience' },
  { id: 'streak_3', emoji: '📅', nom: '3 jours de suite', desc: 'Reviens t\'entraîner 3 jours d\'affilée' },
  { id: 'streak_7', emoji: '⚡', nom: 'Semaine complète', desc: 'Reviens t\'entraîner 7 jours d\'affilée' },
  { id: 'playground_10', emoji: '🖥️', nom: 'Adepte du Playground', desc: 'Exécute 10 programmes dans le Playground' },
];

function badgeParId(id) { return BADGES.find(b => b.id === id); }

function debloquerBadge(id) {
  if (!state.badges[id]) {
    state.badges[id] = new Date().toISOString();
    saveState();
    return true;
  }
  return false;
}

function nbLeconsTerminees() {
  let n = 0;
  for (const niveau of LEVELS) {
    for (const l of niveau.lessons) if (estTermine(niveau.id, l.id)) n++;
  }
  return n;
}
function nbQuizTermines() { return LEVELS.filter(n => estTermine(n.id, 'quiz')).length; }
function nbProjetsValides() { return LEVELS.filter(n => estTermine(n.id, 'project')).length; }
function nbQuizParfaits() { return Object.keys(state.quizParfait || {}).length; }

function verifierBadges() {
  const conditions = {
    premiere_lecon: nbLeconsTerminees() >= 1,
    premier_exercice: state.stats.exercices >= 1,
    exercices_5: state.stats.exercices >= 5,
    exercices_15: state.stats.exercices >= 15,
    premier_quiz: nbQuizTermines() >= 1,
    quiz_parfait: nbQuizParfaits() >= 1,
    quiz_parfait_tous: nbQuizParfaits() >= 4,
    premier_projet: nbProjetsValides() >= 1,
    tous_projets: nbProjetsValides() >= 4,
    niveau_1: progressionNiveau(LEVELS[0]).pct >= 100,
    niveau_2: progressionNiveau(LEVELS[1]).pct >= 100,
    niveau_3: progressionNiveau(LEVELS[2]).pct >= 100,
    niveau_4: progressionNiveau(LEVELS[3]).pct >= 100,
    parcours_complet: progressionGlobale().pct >= 100,
    xp_100: state.xp >= 100,
    xp_500: state.xp >= 500,
    xp_1000: state.xp >= 1000,
    streak_3: (state.stats.streak || 0) >= 3,
    streak_7: (state.stats.streak || 0) >= 7,
    playground_10: state.stats.playgroundRuns >= 10,
  };
  const nouveaux = [];
  for (const [id, cond] of Object.entries(conditions)) {
    if (cond && debloquerBadge(id)) {
      const b = badgeParId(id);
      if (b) nouveaux.push(b.nom);
    }
  }
  if (nouveaux.length) {
    const liste = nouveaux.slice(0, 2).join(' et ');
    afficherNotification('🏅 Succès débloqué : ' + liste + (nouveaux.length > 2 ? '…' : '') + ' !');
  }
  majHeader();
  return nouveaux.length;
}

function dateLocale() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

function majSerie() {
  const stats = state.stats;
  const aujourdHui = dateLocale();
  if (stats.lastVisit === aujourdHui) return;   // déjà visité aujourd'hui
  const hier = new Date(Date.now() - 86400000);
  const p = (n) => String(n).padStart(2, '0');
  const hierStr = hier.getFullYear() + '-' + p(hier.getMonth() + 1) + '-' + p(hier.getDate());
  stats.streak = (stats.lastVisit === hierStr) ? (stats.streak || 0) + 1 : 1;
  stats.lastVisit = aujourdHui;
  stats.bestStreak = Math.max(stats.bestStreak || 0, stats.streak);
  saveState();
}

function formaterDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) { return ''; }
}

function afficherSucces() {
  const debloques = Object.keys(state.badges || {}).length;
  const s = state.stats;
  $('#view-succes').innerHTML = `
    <div class="succes-head">
      <h2>🏅 Succès</h2>
      <p>Débloque des badges en progressant dans le parcours. Ta progression et tes succès sont sauvegardés localement.</p>
    </div>
    <div class="grid-stats">
      <div class="stat"><div class="n">${debloques}/${BADGES.length}</div><div class="l">succès débloqués</div></div>
      <div class="stat"><div class="n">${state.xp}</div><div class="l">points d'expérience</div></div>
      <div class="stat"><div class="n">${s.streak || 0} 🔥</div><div class="l">série actuelle (jours)</div></div>
      <div class="stat"><div class="n">${s.bestStreak || 0} ⚡</div><div class="l">meilleure série</div></div>
      <div class="stat"><div class="n">${s.exercices || 0}</div><div class="l">exercices résolus</div></div>
      <div class="stat"><div class="n">${s.playgroundRuns || 0}</div><div class="l">programmes exécutés</div></div>
    </div>
    <h3 style="margin:18px 0 12px">Tous les succès</h3>
    <div class="grid-cards">
      ${BADGES.map(b => {
        const dateIso = state.badges[b.id];
        return `
        <div class="tile ${dateIso ? '' : 'locked'}" style="cursor:default">
          <div class="t-top">
            <span class="t-emoji">${dateIso ? b.emoji : '🔒'}</span>
            <span class="tag ${dateIso ? 'project' : 'lesson'}">${dateIso ? 'Débloqué' : 'Verrouillé'}</span>
          </div>
          <div class="t-title">${escapeHtml(b.nom)}</div>
          <div class="t-desc">${escapeHtml(b.desc)}</div>
          ${dateIso ? `<div class="t-meta">Débloqué le ${formaterDate(dateIso)}</div>` : ''}
        </div>`;
      }).join('')}
    </div>`;
}

function montrerVue(nomVue) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === nomVue));
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  $('#view-' + nomVue).classList.add('active');
  if (nomVue === 'parcours') renderSidebar();
  if (nomVue === 'succes') afficherSucces();
  window.scrollTo(0, 0);
}

function majHeader() {
  $('#xp-badge').textContent = '⭐ ' + state.xp + ' XP';
  const cpt = $('#badge-count');
  if (cpt) cpt.textContent = '🏅 ' + Object.keys(state.badges || {}).length + '/' + BADGES.length;
  const p = progressionGlobale();
  $('#global-bar-fill').style.width = p.pct + '%';
}

/* ---------- Interpréteur Python (Pyodide) ---------- */
let pyodide = null;

async function initPyodide() {
  const el = $('#py-status');
  el.textContent = '⏳ Chargement de l\'interpréteur Python…';
  try {
    if (typeof loadPyodide === 'undefined') throw new Error('pyodide indisponible');
    pyodide = await loadPyodide();
    pyodide.setStdout({ batched: () => {} }); // par défaut : on capture dans runPython
    el.textContent = '✅ Interpréteur Python prêt';
    el.classList.add('ok');
  } catch (e) {
    el.textContent = '⚠️ Interpréteur indisponible (hors ligne ?) — les exercices seront en lecture seule';
    el.classList.add('err');
  }
}

async function runPython(code) {
  if (!pyodide) {
    return { ok: false, output: 'L\'interpréteur Python n\'est pas encore chargé. Vérifie ta connexion internet puis recharge la page.' };
  }
  let out = '';
  try {
    pyodide.setStdout({ batched: (texte) => { out += texte; } });
    // runPythonAsync : permet aussi le `await` de haut niveau (asyncio)
    await pyodide.runPythonAsync(code);
    return { ok: true, output: out || '(aucune sortie)' };
  } catch (e) {
    return { ok: false, output: out + (out ? '\n' : '') + '⚠️ ' + (e.message || e) };
  }
}

/* ---------- Navigation ---------- */
let navActuel = 'debutant:dashboard';

function naviguer(dest) {
  navActuel = dest;
  const parts = dest.split(':');
  const niveau = niveauParId(parts[0]);
  $('#level-dashboard').style.display = 'none';
  $('#lesson-view').style.display = 'none';
  $('#quiz-view').style.display = 'none';
  $('#project-view').style.display = 'none';

  if (parts[1] === 'dashboard') afficherDashboard(niveau);
  else if (parts[1] === 'lesson') afficherLecon(niveau, leconParId(niveau, parts[2]));
  else if (parts[1] === 'quiz') afficherQuiz(niveau);
  else if (parts[1] === 'project') afficherProjet(niveau);

  renderSidebar();
  $('#content').scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ---------- Sidebar ---------- */
function renderSidebar() {
  const conteneur = $('#level-list');
  let html = '';
  for (const niveau of LEVELS) {
    const prog = progressionNiveau(niveau);
    const ouvert = navActuel.split(':')[0] === niveau.id;
    html += `
      <div class="level-block ${ouvert ? 'open' : ''}">
        <div class="lv-head" data-level="${niveau.id}">
          <span class="lv-emoji">${niveau.emoji}</span>
          <div style="flex:1">
            <div class="lv-title">${escapeHtml(niveau.title)}</div>
            <div class="lv-sub">${escapeHtml(niveau.subtitle)}</div>
          </div>
          <div class="lv-pct">${prog.pct}%</div>
        </div>
        <div class="lv-pbar"><div style="width:${prog.pct}%; background:${niveau.color}"></div></div>
        <div class="level-items">
          <button class="item-btn ${navActuel === niveau.id + ':dashboard' ? 'active' : ''}" data-nav="${niveau.id}:dashboard">
            <span class="ic">📋</span> Vue d'ensemble
          </button>
          ${niveau.lessons.map(l => `
            <button class="item-btn ${navActuel === niveau.id + ':lesson:' + l.id ? 'active' : ''}" data-nav="${niveau.id}:lesson:${l.id}">
              <span class="ic">${estTermine(niveau.id, l.id) ? '<span class="done">✓</span>' : l.emoji}</span>
              ${escapeHtml(l.title)}
            </button>`).join('')}
          <button class="item-btn ${navActuel === niveau.id + ':quiz' ? 'active' : ''}" data-nav="${niveau.id}:quiz">
            <span class="ic">${estTermine(niveau.id, 'quiz') ? '<span class="done">✓</span>' : '❓'}</span> Quiz
          </button>
          <button class="item-btn ${navActuel === niveau.id + ':project' ? 'active' : ''}" data-nav="${niveau.id}:project">
            <span class="ic">${estTermine(niveau.id, 'project') ? '<span class="done">✓</span>' : niveau.project.emoji}</span>
            ${escapeHtml(niveau.project.title)}
          </button>
        </div>
      </div>`;
  }
  conteneur.innerHTML = html;

  conteneur.querySelectorAll('.lv-head').forEach(h => {
    h.addEventListener('click', () => {
      h.closest('.level-block').classList.toggle('open');
    });
  });
  conteneur.querySelectorAll('.item-btn').forEach(b => {
    b.addEventListener('click', () => naviguer(b.dataset.nav));
  });
}

/* ---------- Dashboard ---------- */
function afficherDashboard(niveau) {
  const prog = progressionNiveau(niveau);
  const quizMeilleur = state.quizBest[niveau.id];
  const projetFait = estTermine(niveau.id, 'project');

  let tuiles = niveau.lessons.map(l => `
    <button class="tile" data-nav="${niveau.id}:lesson:${l.id}">
      <div class="t-top"><span class="t-emoji">${l.emoji}</span><span class="tag lesson">Leçon</span></div>
      <div class="t-title">${escapeHtml(l.title)}</div>
      <div class="t-desc">${escapeHtml(l.objectives[0])}</div>
      <div class="t-meta"><span>⏱️ ${escapeHtml(l.duration)}</span>${estTermine(niveau.id, l.id) ? '<span style="color:var(--green)">✓ terminée</span>' : ''}</div>
    </button>`).join('');

  tuiles += `
    <button class="tile" data-nav="${niveau.id}:quiz">
      <div class="t-top"><span class="t-emoji">❓</span><span class="tag quiz">Quiz</span></div>
      <div class="t-title">Quiz du niveau</div>
      <div class="t-desc">${niveau.quiz.questions.length} questions pour valider tes acquis</div>
      <div class="t-meta">${quizMeilleur != null ? '<span style="color:var(--yellow)">Meilleur score : ' + quizMeilleur + '/' + niveau.quiz.questions.length + '</span>' : '<span>Pas encore fait</span>'}</div>
    </button>
    <button class="tile" data-nav="${niveau.id}:project">
      <div class="t-top"><span class="t-emoji">${niveau.project.emoji}</span><span class="tag project">Projet</span></div>
      <div class="t-title">${escapeHtml(niveau.project.title)}</div>
      <div class="t-desc">${escapeHtml(niveau.project.summary.slice(0, 90))}…</div>
      <div class="t-meta">${projetFait ? '<span style="color:var(--green)">🏆 Projet validé</span>' : '<span>Projet à réaliser</span>'}</div>
    </button>`;

  $('#level-dashboard').style.display = 'block';
  $('#level-dashboard').innerHTML = `
    <div class="hero">
      <h2>${niveau.emoji} ${escapeHtml(niveau.title)}</h2>
      <div class="hero-sub">${escapeHtml(niveau.subtitle)}</div>
      <p>${niveau.intro}</p>
      <div class="pills">
        ${niveau.skills.map(s => `<span class="pill"><b>${escapeHtml(s)}</b></span>`).join('')}
      </div>
    </div>
    <div class="grid-stats">
      <div class="stat"><div class="n" style="color:${niveau.color}">${prog.done}/${prog.total}</div><div class="l">étapes terminées</div></div>
      <div class="stat"><div class="n">${prog.pct}%</div><div class="l">progression du niveau</div></div>
      <div class="stat"><div class="n">${quizMeilleur != null ? quizMeilleur + '/' + niveau.quiz.questions.length : '—'}</div><div class="l">meilleur quiz</div></div>
      <div class="stat"><div class="n">${projetFait ? '🏆' : '—'}</div><div class="l">projet validé</div></div>
    </div>
    <h3 style="margin-bottom:12px">Contenu du niveau</h3>
    <div class="grid-cards">${tuiles}</div>`;

  $('#level-dashboard').querySelectorAll('.tile').forEach(t => {
    t.addEventListener('click', () => naviguer(t.dataset.nav));
  });

  // Succès récents (badges débloqués)
  const badgesRecents = Object.entries(state.badges || {})
    .sort((a, b) => b[1].localeCompare(a[1]))
    .slice(0, 3);
  if (badgesRecents.length) {
    const bloc = document.createElement('div');
    bloc.className = 'card';
    bloc.style.marginTop = '18px';
    bloc.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <h3 style="margin:0">🏅 Succès récents</h3>
        <button class="btn-ghost btn-small" data-nav-succes>Voir tous les succès</button>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">
        ${badgesRecents.map(([id, date]) => {
          const b = badgeParId(id);
          if (!b) return '';
          return `
          <div class="tile" style="cursor:default;flex:1;min-width:150px">
            <div class="t-top"><span class="t-emoji">${b.emoji}</span><span class="tag project">${escapeHtml(b.nom)}</span></div>
            <div class="t-desc">Débloqué le ${formaterDate(date)}</div>
          </div>`;
        }).join('')}
      </div>`;
    $('#level-dashboard').appendChild(bloc);
    bloc.querySelector('[data-nav-succes]').addEventListener('click', () => montrerVue('succes'));
  }
}

/* ---------- Leçon ---------- */
function afficherLecon(niveau, lecon) {
  const sections = lecon.sections.map(s => {
    let html = `<div class="section"><h3>${escapeHtml(s.heading)}</h3>`;
    if (s.paragraphs) html += s.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    if (s.list) html += `<ul>${s.list.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
    if (s.code) html += codeBlock(s.code);
    if (s.note) html += `<div class="note">💡 ${escapeHtml(s.note)}</div>`;
    if (s.warn) html += `<div class="warn">⚠️ ${escapeHtml(s.warn)}</div>`;
    return html + '</div>';
  }).join('');

  const ex = lecon.exercise;
  const exKey = niveau.id + '_' + lecon.id;
  const exFait = !!state.exerciseSolved[exKey];

  const index = niveau.lessons.findIndex(l => l.id === lecon.id);
  const prev = niveau.lessons[index - 1];
  const next = niveau.lessons[index + 1];

  $('#lesson-view').style.display = 'block';
  $('#lesson-view').innerHTML = `
    <div class="card">
      <div class="lesson-head">
        <span class="lh-emoji">${lecon.emoji}</span>
        <div>
          <div class="lh-level">${escapeHtml(niveau.title)}</div>
          <h2>${escapeHtml(lecon.title)}</h2>
          <div style="font-size:12.5px;color:var(--text-dim)">⏱️ ${escapeHtml(lecon.duration)}${exFait ? ' · ✅ exercice réussi' : ''}</div>
        </div>
      </div>
      <div class="objectives">
        <h4>🎯 Objectifs de la leçon</h4>
        <ul>${lecon.objectives.map(o => `<li>${escapeHtml(o)}</li>`).join('')}</ul>
      </div>
      ${sections}
      ${lecon.tip ? `<div class="tip"><b>💡 Astuce :</b> ${escapeHtml(lecon.tip)}</div>` : ''}
    </div>

    <div class="card exercise">
      <h3>🏋️ ${escapeHtml(ex.title)}</h3>
      <p>${escapeHtml(ex.instructions)}</p>
      <div class="ex-grid">
        <div class="ex-editor">
          <textarea id="ex-editor" spellcheck="false">${escapeHtml(ex.starter)}</textarea>
          <div class="ex-actions">
            <button class="btn-primary btn-small" id="ex-run">▶️ Exécuter</button>
            <button class="btn-success btn-small" id="ex-check">✔️ Vérifier</button>
            <button class="btn-ghost btn-small" id="ex-solution">👁️ Voir la solution</button>
          </div>
        </div>
        <div>
          <div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Sortie attendue :</div>
          <pre class="ex-output" style="min-height:60px">${escapeHtml(ex.expectedLabel || ex.expected)}</pre>
          <div style="font-size:12px;color:var(--text-dim);margin:8px 0 4px">Ta sortie :</div>
          <pre class="ex-output" id="ex-output">${exFait ? '✅ Déjà réussi !' : '—'}</pre>
          <div class="ex-feedback" id="ex-feedback"></div>
          <div class="solution" id="ex-solution-block">${codeBlock(ex.solution)}</div>
        </div>
      </div>
    </div>

    <div class="nav-lessons">
      ${prev ? `<button class="btn-ghost" data-nav="${niveau.id}:lesson:${prev.id}">← ${escapeHtml(prev.title)}</button>` : '<span class="spacer"></span>'}
      <button class="btn-primary" id="btn-terminer-lecon">${estTermine(niveau.id, lecon.id) ? '✔️ Leçon terminée' : '✔️ Marquer la leçon comme terminée (+20 XP)'}</button>
      ${next ? `<button class="btn-ghost" data-nav="${niveau.id}:lesson:${next.id}">${escapeHtml(next.title)} →</button>` : `<button class="btn-ghost" data-nav="${niveau.id}:quiz">Quiz du niveau →</button>`}
    </div>`;

  $('#lesson-view').querySelectorAll('[data-nav]').forEach(b => {
    b.addEventListener('click', () => naviguer(b.dataset.nav));
  });

  const boutonTerminer = $('#btn-terminer-lecon');
  boutonTerminer.addEventListener('click', () => {
    if (marquerTermine(niveau.id, lecon.id)) {
      addXp(20);
      boutonTerminer.textContent = '✔️ Leçon terminée';
      renderSidebar();
      afficherNotification('Leçon terminée ! +20 XP 🎉');
    }
  });

  // Exercice
  const editeur = $('#ex-editor');
  const sortie = $('#ex-output');
  const feedback = $('#ex-feedback');

  // Au premier clic dans l'éditeur, on retire les commentaires de consigne
  // placés en haut de niveau (ex. « # Écris ton code ici ») pour laisser la
  // place à la saisie. Les commentaires indentés (dans un bloc de code, comme
  // « # Complète ici ») sont conservés : ils gardent le code valide.
  let starterUtilise = false;
  editeur.addEventListener('focus', () => {
    if (!starterUtilise) {
      starterUtilise = true;
      editeur.value = ex.starter
        .split('\n')
        .map(l => (l.trim().startsWith('#') && !/^\s/.test(l) ? '' : l))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }
  });
  editeur.addEventListener('input', () => { starterUtilise = true; });

  $('#ex-run').addEventListener('click', async () => {
    const r = await runPython(editeur.value);
    sortie.textContent = r.output;
    sortie.classList.toggle('err', !r.ok);
  });

  $('#ex-check').addEventListener('click', async () => {
    if (state.exerciseSolved[exKey]) {
      feedback.textContent = '✅ Déjà réussi ! (+15 XP déjà gagnés)';
      feedback.className = 'ex-feedback ok';
      return;
    }
    const r = await runPython(editeur.value);
    sortie.textContent = r.output;
    sortie.classList.toggle('err', !r.ok);
    if (!r.ok) {
      feedback.textContent = '❌ Ton code a levé une erreur. Relis le message, corrige, réessaie.';
      feedback.className = 'ex-feedback no';
      return;
    }
    let reussi = false;
    if (ex.check === 'randint') {
      const bornes = (ex.expected || '').match(/RANDINT:(\d+):(\d+)/);
      const valeur = parseInt(r.output.trim(), 10);
      reussi = bornes && !isNaN(valeur) && valeur >= parseInt(bornes[1], 10) && valeur <= parseInt(bornes[2], 10);
    } else if (ex.check === 'contains') {
      const cible = ex.contains.replace(/\s+/g, '');
      reussi = editeur.value.replace(/\s+/g, '').includes(cible);
    } else {
      reussi = r.output.trim() === (ex.expected || '').trim();
    }
    if (reussi) {
      state.exerciseSolved[exKey] = true;
      state.stats.exercices = (state.stats.exercices || 0) + 1;
      addXp(15);
      verifierBadges();
      feedback.textContent = '✅ Parfait, exercice réussi ! (+15 XP)';
      feedback.className = 'ex-feedback ok';
    } else {
      feedback.textContent = '❌ Pas tout à fait. Compare ta sortie avec la sortie attendue, puis réessaie.';
      feedback.className = 'ex-feedback no';
    }
  });

  $('#ex-solution').addEventListener('click', () => {
    const bloc = $('#ex-solution-block');
    bloc.classList.toggle('open');
  });
}

/* ---------- Quiz ---------- */
let quizEnCours = null;

function afficherQuiz(niveau) {
  $('#quiz-view').style.display = 'block';
  quizEnCours = {
    niveau,
    index: 0,
    score: 0,
    termine: false,
  };
  afficherQuestionQuiz();
}

function afficherQuestionQuiz() {
  const qz = quizEnCours;
  const questions = qz.niveau.quiz.questions;
  if (qz.termine) {
    const total = questions.length;
    const nouveauRecord = (state.quizBest[qz.niveau.id] == null || qz.score > state.quizBest[qz.niveau.id]);
    if (nouveauRecord) {
      const ancien = state.quizBest[qz.niveau.id] || 0;
      state.quizBest[qz.niveau.id] = qz.score;
      addXp((qz.score - ancien) * 10);
    }
    if (marquerTermine(qz.niveau.id, 'quiz') && qz.score > 0) {
      addXp(25);
    }
    if (qz.score === total) {
      state.quizParfait[qz.niveau.id] = true;
      saveState();
    }
    verifierBadges();
    const msg = qz.score === total ? '🏆 Score parfait ! Tu maîtrises ce niveau !' :
                qz.score >= total * 0.7 ? '🎉 Très bien ! Tu es prêt pour la suite.' :
                qz.score >= total * 0.5 ? '👍 Pas mal. Relis les leçons des questions ratées.' :
                '💪 Courage ! Revois les leçons et retente ta chance.';
    $('#quiz-view').innerHTML = `
      <div class="card quiz-result">
        <div class="qr-score" style="color:${qz.score === total ? 'var(--green)' : 'var(--yellow)'}">${qz.score} / ${total}</div>
        <div class="qr-msg">${msg}</div>
        ${nouveauRecord ? '<div class="pill" style="display:inline-block;margin-bottom:10px">⭐ Nouveau record !</div>' : ''}
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn-primary" data-retry>🔄 Recommencer le quiz</button>
          <button class="btn-ghost" data-nav="${qz.niveau.id}:dashboard">Retour au niveau</button>
        </div>
      </div>`;
    $('#quiz-view').querySelector('[data-retry]').addEventListener('click', () => afficherQuiz(qz.niveau));
    $('#quiz-view').querySelector('[data-nav]').addEventListener('click', e => naviguer(e.currentTarget.dataset.nav));
    renderSidebar();
    return;
  }

  const q = questions[qz.index];
  $('#quiz-view').innerHTML = `
    <div class="card">
      <div class="quiz-progress">Question ${qz.index + 1} / ${questions.length} — Score : ${qz.score}</div>
      <div class="quiz-q">${escapeHtml(q.q)}</div>
      ${q.options.map((opt, i) => `<button class="quiz-opt" data-opt="${i}">${escapeHtml(opt)}</button>`).join('')}
      <div class="quiz-explain" id="quiz-explain"></div>
      <div style="margin-top:14px"><button class="btn-primary" id="quiz-next" style="display:none">Question suivante →</button></div>
    </div>`;

  const expliquer = (choix) => {
    const boutons = $('#quiz-view').querySelectorAll('.quiz-opt');
    boutons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('correct');
      else if (i === choix) b.classList.add('wrong');
    });
    const ex = $('#quiz-explain');
    ex.innerHTML = (choix === q.correct ? '✅ Bonne réponse ! ' : '❌ Mauvaise réponse. ') + escapeHtml(q.explain);
    ex.classList.add('show');
    if (choix === q.correct) qz.score++;
    $('#quiz-next').style.display = 'inline-block';
  };

  $('#quiz-view').querySelectorAll('.quiz-opt').forEach(b => {
    b.addEventListener('click', () => {
      expliquer(parseInt(b.dataset.opt, 10));
    });
  });

  $('#quiz-next').addEventListener('click', () => {
    qz.index++;
    if (qz.index >= questions.length) qz.termine = true;
    afficherQuestionQuiz();
  });
}

/* ---------- Projet ---------- */
function afficherProjet(niveau) {
  const projet = niveau.project;
  const cle = niveau.id;
  if (!state.projectChecklist[cle]) state.projectChecklist[cle] = projet.checklist.map(() => false);
  const cases = state.projectChecklist[cle];
  const toutesFaites = cases.every(Boolean);

  $('#project-view').style.display = 'block';
  $('#project-view').innerHTML = `
    <div class="card project-head">
      <h2>${projet.emoji} ${escapeHtml(projet.title)}</h2>
      <p style="margin-top:8px">${escapeHtml(projet.summary)}</p>
      <div class="project-goals">
        ${projet.goals.map(g => `<span class="pill">🎯 ${escapeHtml(g)}</span>`).join('')}
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom:6px">🪜 Étapes de réalisation</h3>
      <p style="font-size:13.5px;color:var(--text-dim);margin-bottom:10px">Réalise le projet dans un fichier Python sur ton ordinateur (ou dans le Playground), étape par étape. Les blocs de code sont des points de départ — complète-les et teste.</p>
      ${projet.steps.map((s, i) => `
        <div class="step ${cases[i] ? 'done-step' : ''}">
          <h4><span class="n">${i + 1}.</span> ${escapeHtml(s.title)}</h4>
          <p>${escapeHtml(s.text)}</p>
          ${s.code ? codeBlock(s.code) : ''}
          ${s.note ? `<div class="note">💡 ${escapeHtml(s.note)}</div>` : ''}
        </div>`).join('')}
    </div>

    <div class="card">
      <h3 style="margin-bottom:10px">✅ Liste de validation</h3>
      <p style="font-size:13.5px;color:var(--text-dim);margin-bottom:12px">Coche chaque critère quand ton projet le remplit. La progression est sauvegardée.</p>
      <div class="checklist">
        ${cases.map((fait, i) => `
          <label class="${fait ? 'checked' : ''}">
            <input type="checkbox" data-case="${i}" ${fait ? 'checked' : ''}>
            <span>${escapeHtml(projet.checklist[i])}</span>
          </label>`).join('')}
      </div>
      <div style="margin-top:16px">
        <button class="btn-success" id="btn-valider-projet" ${toutesFaites ? '' : 'disabled'}>🏆 Valider le projet (+50 XP)</button>
        <span id="projet-feedback"></span>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom:8px">🚀 Pour aller plus loin</h3>
      <ul>${projet.goingFurther.map(g => `<li style="font-size:14px">${escapeHtml(g)}</li>`).join('')}</ul>
    </div>`;

  $('#project-view').querySelectorAll('input[data-case]').forEach(chk => {
    chk.addEventListener('change', () => {
      const i = parseInt(chk.dataset.case, 10);
      cases[i] = chk.checked;
      chk.closest('label').classList.toggle('checked', chk.checked);
      chk.closest('.step') && chk.closest('.step').classList.toggle('done-step', cases[i]);
      const toutes = cases.every(Boolean);
      $('#btn-valider-projet').disabled = !toutes;
      saveState();
    });
  });

  $('#btn-valider-projet').addEventListener('click', () => {
    if (marquerTermine(niveau.id, 'project')) {
      addXp(50);
      verifierBadges();
      $('#projet-feedback').textContent = ' 🎉 Projet validé ! +50 XP — Bravo, niveau suivant !';
      $('#projet-feedback').style.color = 'var(--green)';
      renderSidebar();
    } else {
      $('#projet-feedback').textContent = ' Projet déjà validé !';
    }
  });
}

/* ---------- Notification ---------- */
let notifTimer = null;
function afficherNotification(msg) {
  let el = $('#toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--bg-card);border:1px solid var(--green);color:var(--text);padding:12px 22px;border-radius:10px;font-size:14px;font-weight:600;z-index:100;box-shadow:0 8px 30px rgba(0,0,0,.5);transition:opacity .3s';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => { el.style.opacity = '0'; }, 2600);
}

/* ---------- Playground ---------- */
const SAMPLES = [
  { name: '👋 Bonjour le monde', code: 'print("Bonjour le monde !")' },
  { name: '🔁 Boucle & condition', code: String.raw`for i in range(1, 11):
    if i % 2 == 0:
        print(i, "est pair")
    else:
        print(i, "est impair")` },
  { name: '🧩 Fonctions', code: String.raw`def saluer(nom="monde"):
    return f"Salut {nom} !"

print(saluer())
print(saluer("Léa"))` },
  { name: '⚡ Liste en compréhension', code: String.raw`nombres = [n ** 2 for n in range(1, 11)]
print(nombres)` },
  { name: '🏗️ Classes', code: String.raw`class Compte:
    def __init__(self, nom, solde=0):
        self.nom = nom
        self.solde = solde

    def depot(self, montant):
        self.solde += montant
        return self.solde

c = Compte("Sofia")
print("Solde :", c.depot(100))` },
  { name: '🍕 FizzBuzz', code: String.raw`for i in range(1, 21):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)` },
  { name: '⚡ Async (asyncio)', code: String.raw`import asyncio

async def tache(nom, duree):
    print(f"Début {nom}")
    await asyncio.sleep(duree)
    print(f"Fin {nom}")

async def main():
    await asyncio.gather(tache("A", 1), tache("B", 1), tache("C", 1))

await main()
# Astuce : dans un fichier .py classique, écris asyncio.run(main())` },
  { name: '📁 Fichiers JSON', code: String.raw`import json

donnees = {"nom": "Sofia", "cours": ["python", "web"]}
texte = json.dumps(donnees, ensure_ascii=False, indent=2)
print(texte)
print("Nom :", json.loads(texte)["nom"])` },
];

function initPlayground() {
  const select = $('#pg-samples');
  select.innerHTML = SAMPLES.map((s, i) => `<option value="${i}">${s.name}</option>`).join('');
  const editeur = $('#pg-editor');
  editeur.value = localStorage.getItem(PLAYGROUND_KEY) || SAMPLES[0].code;
  const sortie = $('#pg-output');

  select.addEventListener('change', () => {
    editeur.value = SAMPLES[parseInt(select.value, 10)].code;
    sortie.textContent = '—';
    sortie.classList.remove('err');
  });

  $('#pg-run').addEventListener('click', async () => {
    state.stats.playgroundRuns = (state.stats.playgroundRuns || 0) + 1;
    const r = await runPython(editeur.value);
    sortie.textContent = r.output;
    sortie.classList.toggle('err', !r.ok);
    verifierBadges();
  });

  $('#pg-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(editeur.value).then(() => {
      const btn = $('#pg-copy');
      btn.textContent = '✅ Copié !';
      setTimeout(() => { btn.textContent = '📋 Copier'; }, 1500);
    }).catch(() => afficherNotification('Copie impossible'));
  });

  $('#pg-clear').addEventListener('click', () => {
    editeur.value = '';
    sortie.textContent = '—';
    sortie.classList.remove('err');
  });

  editeur.addEventListener('input', () => {
    localStorage.setItem(PLAYGROUND_KEY, editeur.value);
  });

  editeur.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const debut = editeur.selectionStart;
      const fin = editeur.selectionEnd;
      editeur.value = editeur.value.slice(0, debut) + '    ' + editeur.value.slice(fin);
      editeur.selectionStart = editeur.selectionEnd = debut + 4;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      $('#pg-run').click();
    }
  });
}

/* ---------- Compte & synchronisation cloud ---------- */
let modeCompte = 'login';   // 'login' ou 'signup'

function majIndicateurCloud(etat) {
  const dot = $('#cloud-dot');
  if (!dot) return;
  dot.dataset.etat = etat || 'off';
}

function majUICompte() {
  const conteneur = $('#compte');
  const btn = $('#btn-compte');
  const btnDeconnexion = $('#btn-deconnexion');
  if (!conteneur || !btn) return;
  if (typeof cloudConfiguré !== 'function' || !cloudConfiguré()) {
    conteneur.style.display = 'none';   // synchronisation non configurée : rien à afficher
    return;
  }
  conteneur.style.display = '';
  if (CLOUD.utilisateur) {
    btn.innerHTML = '👤 ' + escapeHtml(CLOUD.utilisateur.email);
    btn.disabled = true;
    btn.title = 'Connecté — ta progression est sauvegardée sur ton compte';
    btnDeconnexion.style.display = '';
    majIndicateurCloud('ok');
  } else {
    btn.textContent = '👤 Connexion';
    btn.disabled = false;
    btn.title = '';
    btnDeconnexion.style.display = 'none';
    majIndicateurCloud('off');
  }
}

/* À chaque changement de session (connexion, déconnexion, reconnexion auto). */
let premierEvenementSession = true;

async function appliquerSession(session) {
  const estArrivée = premierEvenementSession;
  premierEvenementSession = false;
  const utilisateur = session ? { id: session.user.id, email: session.user.email } : null;
  CLOUD.utilisateur = utilisateur;
  majUICompte();
  if (!utilisateur) {
    // À l'arrivée sur le site, sans session : on propose la connexion.
    if (estArrivée && CLOUD.prêt) ouvrirModalCompte();
    return;
  }
  majIndicateurCloud('sync');
  try {
    const distant = await cloudChargerProgression(utilisateur.id);
    const localDate = state.updatedAt ? new Date(state.updatedAt).getTime() : 0;
    const distDate = distant ? new Date(distant.updatedAt).getTime() : 0;
    if (!distant) {
      saveState();   // premier login : on pousse la progression locale
      afficherNotification('☁️ Connecté ! Ta progression est maintenant sauvegardée sur ton compte.');
    } else if (distDate > localDate) {
      // La copie en ligne est plus récente : on la restaure.
      state = Object.assign(stateParDefaut(), distant.progress);
      saveState();
      majHeader();
      renderSidebar();
      naviguer(navActuel);
      afficherNotification('☁️ Progression restaurée depuis ton compte.');
    } else {
      saveState();   // la locale est plus récente (ou égale) : on la pousse
      afficherNotification('☁️ Connecté ! Progression synchronisée avec ton compte.');
    }
    majIndicateurCloud('ok');
  } catch (e) {
    majIndicateurCloud('err');
  }
}

function majFormulaireCompte() {
  const titre = $('#auth-titre');
  const submit = $('#auth-submit');
  const bascule = $('#auth-toggle');
  const intro = $('#auth-intro');
  const erreur = $('#auth-error');
  if (!titre) return;
  erreur.hidden = true;
  if (modeCompte === 'login') {
    titre.textContent = 'Se connecter';
    intro.textContent = 'Retrouve ta progression en te connectant à ton compte.';
    submit.textContent = 'Se connecter';
    bascule.textContent = 'Pas encore de compte ? Crée-en un gratuitement';
  } else {
    titre.textContent = 'Créer un compte';
    intro.textContent = 'Crée un compte gratuit pour sauvegarder ta progression en ligne et la retrouver sur n\'importe quel appareil.';
    submit.textContent = 'Créer le compte';
    bascule.textContent = 'Déjà un compte ? Se connecter';
  }
}

function ouvrirModalCompte() {
  if (!CLOUD.prêt) {
    afficherNotification('☁️ La synchronisation n\'est pas configurée sur ce site.');
    return;
  }
  modeCompte = 'login';
  majFormulaireCompte();
  $('#auth-password').value = '';
  $('#auth-modal').hidden = false;
  $('#auth-email').focus();
}

function fermerModalCompte() {
  $('#auth-modal').hidden = true;
}

function cablerAuthUI() {
  $('#btn-compte').addEventListener('click', ouvrirModalCompte);
  $('#auth-close').addEventListener('click', fermerModalCompte);
  $('#auth-modal').addEventListener('click', (e) => {
    if (e.target === $('#auth-modal')) fermerModalCompte();
  });
  $('#auth-toggle').addEventListener('click', () => {
    modeCompte = modeCompte === 'login' ? 'signup' : 'login';
    majFormulaireCompte();
  });
  $('#auth-skip').addEventListener('click', fermerModalCompte);
  $('#auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#auth-email').value.trim();
    const mdp = $('#auth-password').value;
    const erreur = $('#auth-error');
    const submit = $('#auth-submit');
    erreur.hidden = true;
    submit.disabled = true;
    submit.textContent = '…';
    try {
      if (modeCompte === 'login') {
        await cloudSeConnecter(email, mdp);
        fermerModalCompte();
      } else {
        const data = await cloudCréerCompte(email, mdp);
        if (data.session) {
          fermerModalCompte();
        } else {
          // Confirmation par e-mail activée côté Supabase :
          erreur.textContent = 'Compte créé ! Vérifie ta boîte mail et clique sur le lien de confirmation, puis connecte-toi.';
          erreur.hidden = false;
        }
      }
    } catch (ex) {
      erreur.textContent = ex.message || 'Erreur inattendue.';
      erreur.hidden = false;
    }
    submit.disabled = false;
    submit.textContent = modeCompte === 'login' ? 'Se connecter' : 'Créer le compte';
  });
  $('#btn-deconnexion').addEventListener('click', async () => {
    try {
      await cloudSeDéconnecter();
      CLOUD.utilisateur = null;
      majUICompte();
      afficherNotification('Déconnecté. Ta progression reste enregistrée sur ton compte.');
    } catch (e) {
      afficherNotification('Impossible de se déconnecter.');
    }
  });
}

/* ---------- Événements globaux ---------- */
function init() {
  loadState();
  majSerie();
  majHeader();
  renderSidebar();
  naviguer('debutant:dashboard');
  initPlayground();

  // Compte & synchronisation (cloud.js) — fonctionne sans config : mode local seul
  cloudInit();
  majUICompte();
  cablerAuthUI();

  $('#badge-count').addEventListener('click', () => montrerVue('succes'));
  $('#brand').addEventListener('click', () => {
    montrerVue('parcours');
    naviguer('debutant:dashboard');
  });

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => montrerVue(btn.dataset.view));
  });

  // Délégation pour les boutons Exécuter / Copier générés dynamiquement
  document.body.addEventListener('click', async (e) => {
    const btnRun = e.target.closest('[data-block][data-run]');
    if (btnRun) {
      const code = blocsDeCode.get(btnRun.dataset.block);
      if (code == null) return;
      btnRun.textContent = '⏳ …';
      const r = await runPython(code);
      btnRun.textContent = '▶️ Exécuter';
      afficherNotification(r.ok ? '✅ Exécuté sans erreur' : '⚠️ ' + r.output.slice(0, 140));
      return;
    }
    const btnCopy = e.target.closest('[data-block][data-copy]');
    if (btnCopy) {
      const code = blocsDeCode.get(btnCopy.dataset.block);
      if (code == null) return;
      navigator.clipboard.writeText(code).then(() => {
        const original = btnCopy.textContent;
        btnCopy.textContent = '✅ Copié !';
        setTimeout(() => { btnCopy.textContent = original; }, 1500);
      }).catch(() => afficherNotification('Copie impossible'));
    }
  });

  $('#reset-progress').addEventListener('click', () => {
    if (confirm('Effacer toute ta progression (XP, leçons, quiz, projets) ?')) {
      state = stateParDefaut();
      saveState();
      // Efface aussi la copie en ligne, si connecté
      if (CLOUD.prêt && CLOUD.utilisateur) {
        cloudSupprimerProgression(CLOUD.utilisateur.id).catch(() => {});
      }
      majHeader();
      naviguer(navActuel.split(':')[0] + ':dashboard');
      renderSidebar();
      afficherNotification('Progression réinitialisée');
    }
  });

  verifierBadges();
  initPyodide();
}

document.addEventListener('DOMContentLoaded', init);