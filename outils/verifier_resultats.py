#!/usr/bin/env python3
"""Vérifie que les solutions d'exercices produisent bien la sortie attendue."""
import io
import sys
from contextlib import redirect_stdout

CASES = [
    # (nom, code, sortie attendue)
    ("N1 l1 print", 'print("Bienvenue dans PythonQuest !")', "Bienvenue dans PythonQuest !"),
    ("N1 l2 variables", 'nom = "Léa"\nage = 25\nprint(nom, "a", age, "ans")', "Léa a 25 ans"),
    ("N1 l3 f-string", 'nom = "Karim"\nscore = 92\nprint(f"{nom} a obtenu {score} points")', "Karim a obtenu 92 points"),
    ("N1 l4 pair", 'nombre = 8\nif nombre % 2 == 0:\n    print("Pair")\nelse:\n    print("Impair")', "Pair"),
    ("N1 l5 somme", 'notes = [12, 15, 9, 18]\ntotal = 0\nfor note in notes:\n    total = total + note\nprint(total)', "54"),
    ("N1 l6 inverse", 'fruits = ["pomme", "banane", "kiwi"]\nfor fruit in reversed(fruits):\n    print(fruit)', "kiwi\nbanane\npomme"),
    ("N1 l7 dict", 'etudiant = {"nom": "Sofia", "age": 21, "ville": "Lyon"}\nprint(f"{etudiant[\'nom\']} habite à {etudiant[\'ville\']}")', "Sofia habite à Lyon"),
    ("N2 l1 double", 'def double(n):\n    return n * 2\nprint(double(21))', "42"),
    ("N2 l2 bonjour", 'def bonjour(*noms):\n    for nom in noms:\n        print(f"Salut {nom} !")\nbonjour("Léa", "Karim")', "Salut Léa !\nSalut Karim !"),
    ("N2 l3 json", 'import json\ndonnees = {"nom": "Karim", "ville": "Paris"}\nwith open("/tmp/pq_test.json", "w", encoding="utf-8") as f:\n    json.dump(donnees, f, ensure_ascii=False)\nwith open("/tmp/pq_test.json", "r", encoding="utf-8") as f:\n    charge = json.load(f)\nprint(charge["ville"])', "Paris"),
    ("N2 l4 division", 'a = 10\nb = 0\ntry:\n    print(a / b)\nexcept ZeroDivisionError:\n    print("Division par zéro interdite !")', "Division par zéro interdite !"),
    ("N2 l6 majuscules", 'phrase = "Python est génial"\nfor mot in phrase.split():\n    print(mot.upper())', "PYTHON\nEST\nGÉNIAL"),
    ("N3 l1 aire", 'class Rectangle:\n    def __init__(self, largeur, hauteur):\n        self.largeur = largeur\n        self.hauteur = hauteur\n    def aire(self):\n        return self.largeur * self.hauteur\nr = Rectangle(10, 5)\nprint(r.aire())', "50"),
    ("N3 l2 etudiant", 'class Personne:\n    def __init__(self, nom):\n        self.nom = nom\nclass Etudiant(Personne):\n    def __init__(self, nom, ecole):\n        super().__init__(nom)\n        self.ecole = ecole\n    def etudier(self):\n        print(f"{self.nom} étudie à {self.ecole}")\ne = Etudiant("Karim", "PythonUniv")\ne.etudier()', "Karim étudie à PythonUniv"),
    ("N3 l3 compréhension", 'resultat = [n ** 2 for n in range(10) if n % 2 == 0]\nprint(resultat)', "[0, 4, 16, 36, 64]"),
    ("N3 l4 décorateur", 'def deux_fois(fonction):\n    def enveloppe(*args, **kwargs):\n        fonction(*args, **kwargs)\n        fonction(*args, **kwargs)\n    return enveloppe\n@deux_fois\ndef dire_bonjour():\n    print("Bonjour !")\ndire_bonjour()', "Bonjour !\nBonjour !"),
    ("N4 l1 json id", 'import json\nreponse_json = \'{"id": 42, "nom": "pythonquest"}\'\ndonnees = json.loads(reponse_json)\nprint(donnees["id"])', "42"),
    ("N4 l2 sqlite", 'import sqlite3\nconn = sqlite3.connect(":memory:")\nc = conn.cursor()\nc.execute("CREATE TABLE users (nom TEXT, age INTEGER)")\nc.executemany("INSERT INTO users VALUES (?, ?)", [("Léa", 25), ("Karim", 30), ("Sofia", 21)])\nage_min = 25\nc.execute("SELECT nom FROM users WHERE age > ?", (age_min,))\nprint(c.fetchall())', "[('Karim',)]"),
    ("N4 l3 async", 'import asyncio\nasync def un():\n    return 1\nasync def deux():\n    return 2\nasync def main():\n    resultats = await asyncio.gather(un(), deux())\n    print(sum(resultats))\nasyncio.run(main())', "3"),
    ("N4 l4 env", 'import os\nmode = os.environ.get("MODE", "dev")\nprint(mode)', "dev"),
    ("N4 l5 type", 'def longueur(texte: str) -> int:\n    return len(texte)\nprint(longueur("hello"))', "5"),
]

nb_ok = 0
nb_err = 0
for nom, code, attendu in CASES:
    buf = io.StringIO()
    try:
        with redirect_stdout(buf):
            exec(code, {"__name__": "__main__"})
        obtenu = buf.getvalue()
        if obtenu.rstrip("\n") == attendu:
            nb_ok += 1
        else:
            nb_err += 1
            print(f"❌ {nom}\n   attendu : {attendu!r}\n   obtenu  : {obtenu!r}")
    except Exception as e:
        nb_err += 1
        print(f"💥 {nom} a levé une erreur : {e}")

print(f"\n{nb_ok} résultats conformes, {nb_err} en échec")
sys.exit(1 if nb_err else 0)