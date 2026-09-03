#!/usr/bin/env python3
"""Vérifie la syntaxe du JavaScript généré dans pythonquest.html.

Utilise `node --check` si disponible (Linux/CI), sinon `jsc` (macOS).
Attrape les erreurs de syntaxe dans le code inliné (app.js, cloud.js…)
avant qu'une version cassée ne soit publiée.
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
FICHIER = RACINE / "pythonquest.html"


def extraire_js():
    html = FICHIER.read_text(encoding="utf-8")
    blocs = re.findall(r"<script>(.*?)</script>", html, re.S)
    return "\n;\n".join(blocs)


def verifier():
    if not FICHIER.exists():
        print("⚠️  pythonquest.html absent — lance d'abord : python3 outils/construire.py")
        return 1
    js = extraire_js()
    if not js:
        print("⚠️  aucun bloc JavaScript inliné trouvé")
        return 1
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(js)
        tmp = f.name
    try:
        node = shutil.which("node")
        jsc = shutil.which("jsc") or "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"
        if node:
            r = subprocess.run([node, "--check", tmp], capture_output=True, text=True)
            if r.returncode != 0:
                print("❌ Erreur de syntaxe JavaScript (node --check) :")
                print(r.stderr)
                return 1
            print(f"✅ JS valide ({len(js)} caractères, via node --check)")
            return 0
        if Path(jsc).exists():
            r = subprocess.run([jsc, tmp], capture_output=True, text=True)
            if "SyntaxError" in (r.stderr or "") or "SyntaxError" in (r.stdout or ""):
                print("❌ Erreur de syntaxe JavaScript (jsc) :")
                print(r.stderr or r.stdout)
                return 1
            print(f"✅ JS valide ({len(js)} caractères, via jsc)")
            return 0
        print("⚠️  ni node ni jsc disponibles : vérification de syntaxe ignorée")
        return 0
    finally:
        Path(tmp).unlink(missing_ok=True)


if __name__ == "__main__":
    sys.exit(verifier())