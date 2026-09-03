# ☁️ Activer la connexion et la sauvegarde en ligne (Supabase — gratuit)

PythonQuest peut sauvegarder ta progression **sur ton compte** (et la retrouver sur
n'importe quel appareil). Pour ça, le site utilise **Supabase** : un service gratuit
qui gère la connexion (e-mail + mot de passe) et la base de données.

Sans cette configuration, l'application fonctionne exactement comme avant
(progression sauvegardée dans le navigateur uniquement).

## Étapes (environ 10 minutes)

### 1. Crée un projet Supabase (gratuit)
1. Va sur https://supabase.com et clique **« Start your project »** → **« Sign in with GitHub »**
   (tu peux utiliser ton compte GitHub EastBoyyy).
2. Clique **« New project »** :
   - *Name* : `pythonquest`
   - *Database Password* : choisis-en un (note-le quelque part, il ne sert qu'à la base)
   - *Region* : choisis l'Europe (ou la plus proche de toi)
3. Clique **« Create new project »** et attends ~2 minutes que le projet soit prêt.

### 2. Crée la table de progression
1. Dans le menu de gauche, clique **« SQL Editor »** → **« New query »**.
2. Colle ce script, puis clique **« Run »** :

```sql
create table if not exists public.profils (
  id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profils enable row level security;

create policy "lecture_son_profil" on public.profils
  for select using (auth.uid() = id);
create policy "creation_son_profil" on public.profils
  for insert with check (auth.uid() = id);
create policy "modification_son_profil" on public.profils
  for update using (auth.uid() = id);
```

### 3. (Optionnel mais conseillé) Connexion immédiate sans e-mail de confirmation
1. Menu de gauche → **« Authentication »** → **« Providers »** → **« Email »**.
2. Désactive **« Confirm email »** et clique **« Save »**.
   (Sinon, à la création du compte, un e-mail de confirmation sera envoyé.)

### 4. Récupère les clés du projet
1. Menu de gauche → **« Project Settings »** → **« API »**.
2. Copie :
   - **Project URL** (ex : `https://abcdefgh.supabase.co`)
   - **anon public key** (une longue chaîne qui commence par `eyJ...`)

### 5. Branche le site
Ouvre `data/config.js` et colle les deux valeurs :

```js
const CONFIG = {
  SUPABASE_URL: 'https://XXXXX.supabase.co',   // ← ta Project URL
  SUPABASE_ANON_KEY: 'eyJ...',                 // ← ta clé anon
};
```

Puis régénère la version autonome et publie :

```bash
python3 outils/construire.py
git add -A && git commit -m "Activation de la connexion et de la synchro cloud" && git push origin main
```

## 🎉 Résultat
Le bouton **« 👤 Connexion »** apparaît en haut à droite. Les visiteurs peuvent
créer un compte gratuit, se connecter, et leur progression (XP, leçons, quiz,
projets, succès) est sauvegardée en ligne à chaque modification, puis restaurée
automatiquement à la prochaine connexion.

> 🔒 **Sécurité** : seule la clé « anon » (publique) est embarquée dans le site.
> La base est protégée par des règles (RLS) : chaque utilisateur ne peut lire
> et modifier que sa propre ligne.