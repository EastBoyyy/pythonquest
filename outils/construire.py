#!/usr/bin/env python3
"""Construit pythonquest.html : une version autonome (un seul fichier) de
PythonQuest, avec le CSS, le JS et les données incorporés.

Usage : python3 outils/construire.py
Le fichier pythonquest.html généré s'ouvre en double-cliquant dessus.
"""
import re
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
INDEX = RACINE / "index.html"
SORTIE = RACINE / "pythonquest.html"

html = INDEX.read_text(encoding="utf-8")

# Incorpore le CSS
css = (RACINE / "style.css").read_text(encoding="utf-8")
html = html.replace(
    '<link rel="stylesheet" href="style.css">',
    f"<style>\n{css}\n</style>",
)

# Incorpore la configuration, le cloud, les données puis l'application JS
blocs_js = "\n" + (RACINE / "data" / "config.js").read_text(encoding="utf-8")
blocs_js += "\n" + (RACINE / "cloud.js").read_text(encoding="utf-8")
for nom in ("niveau1.js", "niveau2.js", "niveau3.js", "niveau4.js", "index.js"):
    blocs_js += "\n" + (RACINE / "data" / nom).read_text(encoding="utf-8")
blocs_js += "\n" + (RACINE / "app.js").read_text(encoding="utf-8")

# Supprime les balises <script src="fichiers_locaux"> et les commentaires associés
fichiers_locaux = (
    r"data/config\.js|cloud\.js|data/niveau[1-4]\.js|data/index\.js|app\.js"
)
html = re.sub(
    rf'<script src="(?:{fichiers_locaux})"></script>\s*', "", html
)
for commentaire in (
    "<!-- Configuration & synchronisation cloud -->",
    "<!-- Contenu du parcours -->",
    "<!-- Logique de l'application -->",
):
    html = html.replace(commentaire, "")

html = html.replace("</body>", f"<script>\n{blocs_js}\n</script>\n</body>")

SORTIE.write_text(html, encoding="utf-8")
print(f"✅ {SORTIE.name} généré ({SORTIE.stat().st_size // 1024} Ko)")

# Vérifie la syntaxe du JS inliné avant de considérer le build valide
import shutil
import subprocess
import sys

if shutil.which("node") or Path("/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc").exists():
    r = subprocess.run([sys.executable, "outils/verifier_js.py"])
    if r.returncode != 0:
        sys.exit(r.returncode)