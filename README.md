# 🐍 PythonQuest — Apprends Python de débutant à pro par de vrais projets

**PythonQuest** est une application web (100 % hors ligne une fois chargée) qui t'accompagne
de **débutant à pro** en Python, en réalisant **de vrais projets** à chaque niveau.

## 🎮 Ce que tu trouves dedans

- **4 niveaux progressifs** : Débutant 🌱 → Intermédiaire 🚀 → Avancé ⚙️ → Pro 🏆
- **24 leçons** avec théorie, exemples exécutables et astuces
- **Exercices interactifs** corrigés automatiquement (comparaison de sortie)
- **Quiz** avec feedback immédiat et explications
- **4 projets réels**, étape par étape, avec liste de validation :
  1. 🧮 Calculatrice interactive (ligne de commande)
  2. ✅ Gestionnaire de tâches avec sauvegarde JSON
  3. 🌐 API REST « Bibliothèque » avec Flask
  4. 📚 Application web complète Flask + SQLite + tests
- **🖥️ Playground** : un vrai interpréteur Python (Pyodide) dans le navigateur
- **🏅 20 succès (badges)** : première leçon, quiz parfait, série de jours, XP, projets… consultables
  sur la page « Succès » avec statistiques (série, exercices, programmes exécutés)
- **👤 Comptes & synchronisation** : connexion par e-mail et sauvegarde de la progression
  sur le compte (via Supabase, gratuit) — voir [SETUP_SUPABASE.md](SETUP_SUPABASE.md)
- **Gamification** : XP, progression et succès sauvegardés localement (localStorage) et
  en ligne quand on est connecté

## 🚀 Lancer l'application

Ouvre simplement `index.html` dans ton navigateur.

Pour une expérience plus propre (optionnel) :

```bash
python3 -m http.server 8000
# puis ouvre http://localhost:8000
```

> ℹ️ Le Playground charge l'interpréteur Python (Pyodide) depuis un CDN :
> une connexion internet est nécessaire au **premier** chargement (ensuite, il est
> mis en cache par le navigateur). Les leçons, quiz et projets restent
> consultables même hors ligne.

## 🗂️ Structure du projet

```
├── index.html              # page principale
├── style.css               # styles (thème sombre)
├── app.js                  # logique : navigation, progression, quiz, Playground
├── data/
│   ├── niveau1.js          # Débutant : 7 leçons + quiz + calculatrice
│   ├── niveau2.js          # Intermédiaire : 6 leçons + quiz + gestionnaire de tâches
│   ├── niveau3.js          # Avancé : 6 leçons + quiz + API Flask
│   ├── niveau4.js          # Pro : 5 leçons + quiz + app web complète
│   └── index.js            # regroupe les 4 niveaux
└── outils/
    ├── valider_snippets.py # vérifie la syntaxe des exemples Python
    └── verifier_resultats.py # vérifie les sorties attendues des exercices
```

## ✅ Vérifier le contenu pédagogique

Les exemples de code sont testés automatiquement :

```bash
python3 outils/valider_snippets.py      # syntaxe de tous les exemples
python3 outils/verifier_resultats.py    # sorties des exercices
```

## 📚 Le parcours en un coup d'œil

| Niveau | Thèmes | Projet |
|--------|--------|--------|
| 🌱 Débutant | print, variables, opérateurs, conditions, boucles, listes, dicts | Calculatrice |
| 🚀 Intermédiaire | fonctions, fichiers, JSON, exceptions, modules, chaînes | Gestionnaire de tâches |
| ⚙️ Avancé | POO, héritage, compréhensions, décorateurs, tests, Git | API REST Flask |
| 🏆 Pro | API, SQLite, async, déploiement, typage | App web complète |