#!/usr/bin/env python3
"""Valide la syntaxe de tous les blocs de code Python présents dans les
fichiers JS (String.raw`...` des leçons, exercices, projets).

Catégories attendues et acceptées malgré un échec de compilation :
- starters d'exercices volontairement incomplets (contiennent « Complète ici »)
- contenu non-Python : commandes shell, Dockerfile, arborescences de dossiers
"""
import re
import sys
from pathlib import Path

FICHIERS = [
    "data/niveau1.js",
    "data/niveau2.js",
    "data/niveau3.js",
    "data/niveau4.js",
    "app.js",
]

pattern = re.compile(r"String\.raw`([^`]*)`")

MARQUEURS_INCOMPLET = ("complète", "affiche le message", "affiche \"{nom}")
MARQUEURS_NON_PYTHON = (
    "pip install", "pip freeze", "python3 -m venv", "source .venv",
    "git init", "git add", "git commit", "git log", "curl http",
    "FROM python", "EXPOSE ", "CMD [", "├──", "│", "└──", "┌",
    "elif choix",  # fragment partiel d'une étape de projet
    "await main()",  # `await` de haut niveau : valide dans Pyodide (runPythonAsync)
)

nb_ok = 0
nb_attendu = 0
nb_err = 0
for fichier in FICHIERS:
    texte = Path(fichier).read_text(encoding="utf-8")
    for i, bloc in enumerate(pattern.findall(texte)):
        try:
            compile(bloc, f"<{fichier}:{i}>", "exec")
            nb_ok += 1
            continue
        except SyntaxError:
            pass
        bas = bloc.lower()
        if any(m in bas for m in MARQUEURS_INCOMPLET):
            nb_attendu += 1
            continue
        if any(m in bas for m in MARQUEURS_NON_PYTHON):
            nb_attendu += 1
            continue
        nb_err += 1
        print(f"⚠️  À VÉRIFIER dans {fichier} bloc #{i}")
        print("-" * 60)
        print(bloc)
        print("-" * 60)

print(f"\n{len(FICHIERS)} fichiers analysés")
print(f"{nb_ok} blocs Python valides, {nb_attendu} blocs attendus "
      f"(exercices incomplets / non-Python), {nb_err} à vérifier")
sys.exit(1 if nb_err else 0)