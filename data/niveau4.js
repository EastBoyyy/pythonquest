/* ============ Niveau 4 — Pro : Vrais projets ============ */
const NIVEAU4 = {
  id: 'pro',
  emoji: '🏆',
  title: 'Niveau 4 — Pro',
  subtitle: 'De vrais projets, de bout en bout',
  color: '#f87171',
  intro: `Dernier niveau : tu construis des choses que les professionnels construisent. Consommer des API réelles, manipuler des bases de données, écrire du code asynchrone et préparer un déploiement. Ton chef-d'œuvre : une application web complète (Flask + SQLite + tests) prête à être déployée.`,
  skills: ['API REST', 'SQLite', 'Async', 'Déploiement', 'Typage'],
  lessons: [
    {
      id: 'l1',
      emoji: '🌐',
      title: 'Consommer des API REST',
      duration: '30 min',
      objectives: [
        'Comprendre HTTP : méthodes, statuts, en-têtes',
        'Interroger une API réelle avec requests',
        'Analyser les réponses JSON'
      ],
      sections: [
        {
          heading: 'HTTP en pratique',
          paragraphs: [
            'Quand ton programme « parle » à un serveur, il envoie une requête HTTP avec une méthode (GET pour lire, POST pour créer, PUT pour modifier, DELETE pour supprimer) et reçoit une réponse avec un code de statut et un corps (souvent du JSON).'
          ],
          list: [
            '200 OK — la requête a réussi',
            '201 Created — une ressource a été créée',
            '400 Bad Request — la requête est invalide',
            '404 Not Found — la ressource n\'existe pas',
            '500 Internal Server Error — problème côté serveur'
          ],
          code: String.raw`import requests

reponse = requests.get("https://api.github.com/users/python")
print(reponse.status_code)          # 200
donnees = reponse.json()            # dict Python
print(donnees["name"])
print(donnees["public_repos"], "repos publics")`
        },
        {
          heading: 'Le module requests',
          paragraphs: [
            'requests est LE standard pour le HTTP en Python. Installe-le avec pip install requests. Les paramètres d\'URL passent par params=, les données JSON par json=.'
          ],
          code: String.raw`import requests

# Paramètres dans l'URL (recherche sur GitHub)
reponse = requests.get(
    "https://api.github.com/search/repositories",
    params={"q": "language:python", "sort": "stars", "per_page": 3},
)
print(reponse.status_code)

for repo in reponse.json()["items"]:
    print(f"⭐ {repo['full_name']} — {repo['stargazers_count']} étoiles")`,
          note: 'Quand une API te demande une clé (token), on l\'envoie dans l\'en-tête : headers={"Authorization": "Bearer TON_TOKEN"}. Jamais de clé en dur dans le code !'
        },
        {
          heading: 'Gérer les erreurs réseau proprement',
          paragraphs: [
            'Le réseau tombe, les serveurs répondent mal. Un vrai programme prévoit tout :'
          ],
          code: String.raw`import requests

try:
    reponse = requests.get(
        "https://api.github.com/users/python",
        timeout=10,          # ne jamais attendre indéfiniment
    )
    reponse.raise_for_status()   # lève une erreur si statut >= 400
    print(reponse.json()["name"])
except requests.exceptions.Timeout:
    print("Le serveur met trop de temps à répondre.")
except requests.exceptions.RequestException as erreur:
    print(f"Erreur réseau : {erreur}")`
        }
      ],
      tip: 'Ton code doit supporter le pire cas : serveur injoignable, données manquantes, format inattendu. Les API publiques changent — teste toujours tes hypothèses.',
      exercise: {
        title: 'Exercice : préparer la requête',
        instructions: 'Complète le programme pour afficher la clé "id" du dictionnaire renvoyé par la fausse API (ici simulée localement).',
        starter: String.raw`# Simule une réponse d'API (pas besoin de réseau ici)
reponse_json = '{"id": 42, "nom": "pythonquest"}'

import json
donnees = json.loads(reponse_json)

# Affiche la valeur de la clé "id"`,
        expected: '42',
        solution: String.raw`import json
reponse_json = '{"id": 42, "nom": "pythonquest"}'
donnees = json.loads(reponse_json)
print(donnees["id"])`
      }
    },
    {
      id: 'l2',
      emoji: '🗄️',
      title: 'Bases de données avec SQLite',
      duration: '35 min',
      objectives: [
        'Créer une base SQLite avec le module sqlite3',
        'Écrire des requêtes : CREATE, INSERT, SELECT, UPDATE, DELETE',
        'Protéger ses requêtes avec des paramètres'
      ],
      sections: [
        {
          heading: 'SQLite : une base de données dans un fichier',
          paragraphs: [
            'SQLite est une vraie base de données SQL, sans serveur : tout tient dans un fichier. Elle est intégrée à Python (module sqlite3) — parfait pour apprendre le SQL et pour des applications légères.'
          ],
          code: String.raw`import sqlite3

connexion = sqlite3.connect("bibliotheque.db")
curseur = connexion.cursor()

curseur.execute("""
    CREATE TABLE IF NOT EXISTS livres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        auteur TEXT NOT NULL,
        annee INTEGER
    )
""")
connexion.commit()
connexion.close()`,
          note: 'Une fois le script lancé, le fichier bibliotheque.db existe sur le disque. On le rouvre à chaque fois.'
        },
        {
          heading: 'Insérer et lire des données',
          paragraphs: [
            'Le point d\'interrogation ? est un paramètre : il protège ta requête contre l\'injection SQL et gère les guillemets. On passe toujours les valeurs en second argument de execute().'
          ],
          code: String.raw`import sqlite3

connexion = sqlite3.connect("bibliotheque.db")
curseur = connexion.cursor()

# Insérer (avec paramètres : JAMAIS de f-string dans du SQL !)
curseur.execute(
    "INSERT INTO livres (titre, auteur, annee) VALUES (?, ?, ?)",
    ("Fondation", "Isaac Asimov", 1951),
)
connexion.commit()

# Lire
curseur.execute("SELECT titre, auteur FROM livres")
for titre, auteur in curseur.fetchall():
    print(f"{titre} — {auteur}")

connexion.close()`,
          warn: 'N\'utilise JAMAIS de f-string pour construire une requête SQL : c\'est la porte ouverte à l\'injection SQL. Toujours les paramètres ?.'
        },
        {
          heading: 'Filtrer, modifier, supprimer',
          paragraphs: [
            'WHERE filtre, ORDER BY trie, UPDATE modifie, DELETE supprime. La combinaison de ces briques fait 99 % du travail avec une base.'
          ],
          code: String.raw`import sqlite3

connexion = sqlite3.connect("bibliotheque.db")
curseur = connexion.cursor()

# Filtrer et trier
curseur.execute(
    "SELECT titre FROM livres WHERE annee > ? ORDER BY annee DESC",
    (1950,),
)
print(curseur.fetchall())

# Modifier
curseur.execute(
    "UPDATE livres SET annee = ? WHERE titre = ?",
    (1952, "Fondation"),
)

# Supprimer
curseur.execute("DELETE FROM livres WHERE auteur = ?", ("Inconnu",))
connexion.commit()
connexion.close()`
        }
      ],
      tip: 'Pense au SQL comme à des questions posées à la base : « donne-moi les livres publiés après 1950, triés par année décroissante ». La syntaxe suit la phrase.',
      exercise: {
        title: 'Exercice : sélection sécurisée',
        instructions: 'Complète la requête pour sélectionner les utilisateurs âgés de plus de 25 ans, en utilisant un paramètre ?.',
        starter: String.raw`import sqlite3

connexion = sqlite3.connect(":memory:")
curseur = connexion.cursor()
curseur.execute("CREATE TABLE users (nom TEXT, age INTEGER)")
curseur.executemany(
    "INSERT INTO users VALUES (?, ?)",
    [("Léa", 25), ("Karim", 30), ("Sofia", 21)],
)

age_min = 25
# Sélectionne les noms des users avec age > age_min (paramètre ?)
curseur.execute("SELECT nom FROM users WHERE age > ?", (age_min,))
print(curseur.fetchall())`,
        expected: "[('Karim',)]",
        solution: String.raw`import sqlite3

connexion = sqlite3.connect(":memory:")
curseur = connexion.cursor()
curseur.execute("CREATE TABLE users (nom TEXT, age INTEGER)")
curseur.executemany(
    "INSERT INTO users VALUES (?, ?)",
    [("Léa", 25), ("Karim", 30), ("Sofia", 21)],
)

age_min = 25
curseur.execute("SELECT nom FROM users WHERE age > ?", (age_min,))
print(curseur.fetchall())`
      }
    },
    {
      id: 'l3',
      emoji: '⚡',
      title: 'Programmation asynchrone',
      duration: '30 min',
      objectives: [
        'Comprendre async / await',
        'Lancer plusieurs tâches en parallèle avec asyncio',
        'Savoir quand (ne pas) utiliser l\'asynchrone'
      ],
      sections: [
        {
          heading: 'Le problème : attendre, c\'est perdre du temps',
          paragraphs: [
            'Quand ton programme attend une réponse réseau, il ne fait rien d\'utile. L\'asynchrone permet de lancer plusieurs opérations « en attente » et de continuer les autres pendant ce temps.'
          ],
          code: String.raw`import asyncio

async def telecharger(nom, duree):
    print(f"Début : {nom}")
    await asyncio.sleep(duree)   # simule une attente réseau
    print(f"Fin : {nom}")

async def main():
    # Les 3 téléchargements s'exécutent EN MÊME TEMPS
    await asyncio.gather(
        telecharger("fichier A", 2),
        telecharger("fichier B", 1),
        telecharger("fichier C", 3),
    )
    # Total : ~3 s au lieu de 6 s

await main()
# Dans un fichier .py classique : asyncio.run(main())`,
          note: 'await = « je me suspends ici, en attendant, fais autre chose ». C\'est la clé de l\'asynchrone.'
        },
        {
          heading: 'async def et await',
          paragraphs: [
            'Une fonction async def devient une « coroutine » : elle ne s\'exécute pas directement, elle est lancée par la boucle d\'événements (asyncio.run). await attend le résultat d\'une autre coroutine.'
          ],
          code: String.raw`import asyncio

async def recuperer_prix(produit):
    await asyncio.sleep(1)   # appel réseau simulé
    return {produit: 42}

async def main():
    prix = await recuperer_prix("clavier")
    print(prix)

await main()   # {'clavier': 42}`
        },
        {
          heading: 'Quand utiliser l\'asynchrone ?',
          paragraphs: [
            'Asynchrone = génial pour l\'I/O (réseau, fichiers, bases). Inutile et contre-productif pour du calcul pur (le CPU reste occupé). Pour du vrai réseau asynchrone, la bibliothèque aiohttp est le standard.'
          ],
          code: String.raw`import asyncio
import aiohttp

async def recuperer(session, url):
    async with session.get(url) as reponse:
        return await reponse.json()

async def main():
    urls = [
        "https://api.github.com/users/python",
        "https://api.github.com/users/psf",
        "https://api.github.com/users/django",
    ]
    async with aiohttp.ClientSession() as session:
        resultats = await asyncio.gather(*(recuperer(session, u) for u in urls))
    for r in resultats:
        print(r["login"], "—", r["public_repos"], "repos")

await main()
# Dans un fichier .py classique : asyncio.run(main())`,
          note: 'pip install aiohttp — même principe que requests, mais asynchrone.'
        }
      ],
      tip: 'Règle pratique : si ton programme passe son temps à attendre (réseau, fichiers, API), l\'asynchrone le rend plusieurs fois plus rapide. Sinon, reste synchrone : plus simple = plus maintenable.',
      exercise: {
        title: 'Exercice : deux tâches',
        instructions: 'Complète le programme pour lancer les deux coroutines en parallèle avec asyncio.gather. Résultat attendu : 3.',
        starter: String.raw`import asyncio

async def un():
    return 1

async def deux():
    return 2

async def main():
    # Complète : lance un() et deux() en parallèle et affiche la somme
    resultats = await asyncio.gather(un(), deux())
    print(sum(resultats))

await main()`,
        expected: '3',
        solution: String.raw`import asyncio

async def un():
    return 1

async def deux():
    return 2

async def main():
    resultats = await asyncio.gather(un(), deux())
    print(sum(resultats))

await main()`
      }
    },
    {
      id: 'l4',
      emoji: '🚀',
      title: 'Environnements & déploiement',
      duration: '30 min',
      objectives: [
        'Gérer les dépendances comme un pro',
        'Utiliser les variables d\'environnement',
        'Préparer une application au déploiement'
      ],
      sections: [
        {
          heading: 'Reproduire un environnement',
          paragraphs: [
            'Un projet « pro » s\'installe n\'importe où en deux commandes. Le secret : l\'environnement virtuel + le fichier de dépendances.'
          ],
          code: String.raw`# Créer l'environnement et l'activer
python3 -m venv .venv
source .venv/bin/activate        # Windows : .venv\Scripts\activate

# Installer les dépendances du projet
pip install -r requirements.txt

# Générer requirements.txt (à faire quand on ajoute une dépendance)
pip freeze > requirements.txt`,
          note: 'Le dossier .venv ne se versionne jamais : il est listé dans .gitignore. Tout se reconstruit avec requirements.txt.'
        },
        {
          heading: 'Les variables d\'environnement',
          paragraphs: [
            'Clés d\'API, mots de passe, ports… ne doivent JAMAIS être en dur dans le code. On les lit depuis l\'environnement (os.environ) ou un fichier .env.'
          ],
          code: String.raw`import os
from dotenv import load_dotenv   # pip install python-dotenv

load_dotenv()   # charge les variables depuis le fichier .env

# Fichier .env (jamais commité !) :
# API_KEY=secret123
# PORT=5000

cle = os.environ.get("API_KEY")
port = int(os.environ.get("PORT", 5000))

print(f"Port utilisé : {port}")`,
          note: 'Le fichier .env contient des secrets : il doit être dans .gitignore. Le projet versionne un .env.example avec les NOMS des variables, sans les valeurs.'
        },
        {
          heading: 'Du local au déploiement',
          paragraphs: [
            'Déployer, c\'est faire tourner ton application sur un serveur accessible à tous. Les étapes :'
          ],
          list: [
            '1. Tests verts en local (pytest)',
            '2. requirements.txt à jour et .env.example documenté',
            '3. README avec les commandes d\'installation et de lancement',
            '4. Choisir une plateforme : Render, Railway, Fly.io (simples), ou Docker + VPS (puissants)',
            '5. Déployer, vérifier, surveiller les logs'
          ],
          code: String.raw`# Exemple Dockerfile minimal pour une app Flask
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]`,
          note: 'gunicorn est un serveur HTTP de production pour les applications Python — Flask ne sert pas à ça tout seul. En local, app.run() suffit.'
        }
      ],
      tip: 'La différence entre « ça marche sur ma machine » et « c\'est déployé » : documentation, dépendances verrouillées, secrets hors du code, et une procédure de lancement en 2 commandes.',
      exercise: {
        title: 'Exercice : lire l\'environnement',
        instructions: 'Complète le programme pour afficher la valeur de la variable MODE avec la valeur par défaut "dev" si elle n\'existe pas.',
        starter: String.raw`import os

# Affiche la valeur de MODE, ou "dev" si elle n'existe pas
mode = os.environ.get("MODE", "dev")
print(mode)`,
        expected: 'dev',
        solution: String.raw`import os
mode = os.environ.get("MODE", "dev")
print(mode)`
      }
    },
    {
      id: 'l5',
      emoji: '🧠',
      title: 'Typage & architecture propre',
      duration: '30 min',
      objectives: [
        'Annoter les types avec mypy',
        'Séparer les responsabilités de son code',
        'Écrire un code lisible et maintenable'
      ],
      sections: [
        {
          heading: 'Les annotations de type',
          paragraphs: [
            'Python est dynamique, mais on peut documenter les types attendus. mypy vérifie que tu respectes tes propres annotations : des bugs en moins, une documentation en plus.'
          ],
          code: String.raw`def prix_ttc(prix_ht: float, tva: float = 20.0) -> float:
    """Calcule le prix TTC."""
    return prix_ht * (1 + tva / 100)

def saluer(nom: str) -> str:
    return f"Salut {nom} !"

total: float = prix_ttc(100)      # ✅ ok
# total = "texte"                  # ❌ mypy le signale`,
          note: 'Installe mypy (pip install mypy), lance mypy mon_fichier.py : il vérifie la cohérence des types sans exécuter le code.'
        },
        {
          heading: 'Séparer les responsabilités',
          paragraphs: [
            'Un projet devient vite ingérable si tout est mélangé. Sépare : la logique métier (calculs, règles), l\'accès aux données (fichiers, base), et la présentation (interface, API).'
          ],
          code: String.raw`# Structure d'un petit projet bien organisé :
mon_app/
├── app.py              # entrée : crée l'application, les routes
├── services/
│   └── commandes.py    # logique métier (créer une commande…)
├── database/
│   └── connexion.py    # accès aux données (SQL)
├── tests/
│   └── test_commandes.py
├── requirements.txt
└── README.md`,
          note: 'Règle simple : chaque fichier a UN rôle. Si tu ne sais pas résumer le rôle d\'un fichier en une phrase, il fait trop de choses.'
        },
        {
          heading: 'Le code lisible est un code maintenable',
          paragraphs: [
            'Tu écris le code une fois, mais tu le relis dix fois. Quelques réflexes professionnels :'
          ],
          list: [
            'Des noms qui racontent l\'histoire (est_pret_eligible plutôt que p)',
            'Des fonctions courtes qui font UNE chose',
            'Des docstrings sur les fonctions publiques',
            'Des tests qui documentent le comportement attendu',
            'Pas de commentaires qui répètent le code — des commentaires qui expliquent le POURQUOI'
          ],
          code: String.raw`# 👎 Difficile à lire
def f(a, b):
    t = a + b
    if t > 100:
        return "cher"
    return "ok"

# 👍 Raconte une histoire
def categoriser_commande(total: float) -> str:
    """Renvoie la catégorie d'une commande selon son montant."""
    SEUIL_GROSSE_COMMANDE = 100
    if total > SEUIL_GROSSE_COMMANDE:
        return "cher"
    return "ok"`
        }
      ],
      tip: 'Lis ton code à voix haute : si tu butes, tes lecteurs buteront aussi. Le code doit se lire comme une histoire, pas comme une énigme.',
      exercise: {
        title: 'Exercice : documenter',
        instructions: 'Ajoute une annotation de type à la fonction pour dire qu\'elle reçoit un str et renvoie un int. Résultat attendu : 5.',
        starter: String.raw`def longueur(texte):
    return len(texte)

print(longueur("hello"))`,
        expected: '5',
        expectedLabel: '5',
        check: 'contains',
        contains: 'def longueur(texte: str) -> int:',
        solution: String.raw`def longueur(texte: str) -> int:
    return len(texte)

print(longueur("hello"))`
      }
    }
  ],
  quiz: {
    title: 'Quiz du Niveau 4',
    questions: [
      {
        q: 'Que signifie le code de statut HTTP 404 ?',
        options: ['La requête a réussi', 'La ressource n\'existe pas', 'Erreur côté serveur', 'Accès non autorisé'],
        correct: 1,
        explain: '404 = Not Found : la ressource demandée est introuvable.'
      },
      {
        q: 'Comment passer des valeurs à une requête SQL en Python ?',
        options: ['Avec des f-strings', 'Avec des paramètres ? et un tuple', 'En les concaténant', 'Avec des variables globales'],
        correct: 1,
        explain: 'Les paramètres ? protègent contre l\'injection SQL : curseur.execute(sql, (valeur,)).'
      },
      {
        q: 'Que fait await dans une coroutine ?',
        options: ['Il bloque tout le programme', 'Il suspend la coroutine et laisse les autres tourner', 'Il relance la coroutine', 'Il termine le programme'],
        correct: 1,
        explain: 'await suspend uniquement la coroutine courante : la boucle d\'événements exécute les autres en attendant.'
      },
      {
        q: 'Où stocker une clé d\'API secrète ?',
        options: ['En dur dans le code', 'Dans le fichier .env, lu via os.environ', 'Dans le README', 'Dans le nom de fichier'],
        correct: 1,
        explain: 'Les secrets vont dans l\'environnement (.env), jamais dans le code versionné.'
      },
      {
        q: 'À quoi sert mypy ?',
        options: ['À formater le code', 'À vérifier statiquement les types', 'À créer des bases de données', 'À déployer l\'application'],
        correct: 1,
        explain: 'mypy analyse le code sans l\'exécuter et signale les incohérences de types.'
      },
      {
        q: 'Quel serveur utiliser pour la production d\'une app Flask ?',
        options: ['app.run() de Flask', 'gunicorn', 'La bibliothèque standard', 'SQLite'],
        correct: 1,
        explain: 'Le serveur intégré de Flask est prévu pour le développement. En production : gunicorn (ou uvicorn).'
      },
      {
        q: 'Quelle requête SQL lit des données ?',
        options: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'],
        correct: 1,
        explain: 'SELECT interroge la base. Les trois autres modifient les données.'
      },
      {
        q: 'Quel est l\'avantage de découper son code en couches (métier / données / présentation) ?',
        options: ['C\'est plus lent mais plus sûr', 'Chaque partie est testable et modifiable indépendamment', 'Ça évite d\'écrire des tests', 'Ça rend le code plus court'],
        correct: 1,
        explain: 'La séparation des responsabilités rend le code testable, lisible et évolutif.'
      }
    ]
  },
  project: {
    id: 'p4',
    emoji: '📚',
    title: 'Projet 4 (Capstone) : « Ma Bibliothèque » — application web complète',
    summary: 'Ton chef-d\'œuvre : une application web Flask complète, branchée sur une base SQLite, avec recherche, ajout de livres et tests. Elle rassemble TOUT le parcours : Python, fichiers, bases de données, web, environnement et tests. À la fin, tu la déploies en ligne.',
    goals: ['Construire une application Flask complète', 'Persister les données dans SQLite', 'Écrire des tests pour la logique métier', 'Préparer le déploiement (README, requirements, secrets)'],
    steps: [
      {
        title: 'Planifie l\'architecture',
        text: 'Sépare les responsabilités : un module pour la base de données, un pour la logique métier, un pour les routes. Structure :',
        code: String.raw`ma_bibliotheque/
├── app.py              # routes Flask (présentation)
├── database.py         # accès SQLite (données)
├── tests/
│   └── test_bibliotheque.py
├── .env.example        # variables d'environnement documentées
├── requirements.txt
├── .gitignore
└── README.md`
      },
      {
        title: 'Le module base de données',
        text: 'Crée la table livres et les fonctions d\'accès. Chaque fonction ouvre la connexion, exécute, commit et ferme.',
        code: String.raw`import sqlite3

CHEMIN_BDD = "bibliotheque.db"

def get_connexion():
    return sqlite3.connect(CHEMIN_BDD)

def init_bdd():
    with get_connexion() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS livres (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titre TEXT NOT NULL,
                auteur TEXT NOT NULL,
                annee INTEGER
            )
        """)

def ajouter_livre(titre, auteur, annee):
    with get_connexion() as conn:
        conn.execute(
            "INSERT INTO livres (titre, auteur, annee) VALUES (?, ?, ?)",
            (titre, auteur, annee),
        )

def lister_livres():
    with get_connexion() as conn:
        return conn.execute(
            "SELECT * FROM livres ORDER BY titre"
        ).fetchall()`,
        note: 'Le context manager « with get_connexion() as conn: » valide (commit) automatiquement les modifications.'
      },
      {
        title: 'Les routes Flask',
        text: 'La page d\'accueil affiche les livres (en HTML), et un formulaire permet d\'en ajouter. Ajoute la recherche par titre.',
        code: String.raw`from flask import Flask, request, render_template_string, redirect, url_for
import database

app = Flask(__name__)

PAGE = """
<!doctype html>
<html lang="fr">
<body style="font-family: sans-serif; max-width: 700px; margin: 40px auto;">
  <h1>📚 Ma Bibliothèque</h1>
  <form method="post" action="/ajouter">
    <input name="titre" placeholder="Titre" required>
    <input name="auteur" placeholder="Auteur" required>
    <input name="annee" type="number" placeholder="Année">
    <button type="submit">Ajouter</button>
  </form>
  <form method="get" action="/">
    <input name="q" placeholder="Rechercher un titre…">
    <button type="submit">🔍</button>
  </form>
  <ul>{% for l in livres %}<li>{{ l[1] }} — {{ l[2] }} ({{ l[3] }})</li>{% endfor %}</ul>
</body>
</html>
"""

@app.route("/")
def accueil():
    q = request.args.get("q", "")
    livres = database.rechercher_livres(q) if q else database.lister_livres()
    return render_template_string(PAGE, livres=livres)

@app.route("/ajouter", methods=["POST"])
def ajouter():
    database.ajouter_livre(
        request.form["titre"],
        request.form["auteur"],
        request.form.get("annee", type=int),
    )
    return redirect(url_for("accueil"))

if __name__ == "__main__":
    database.init_bdd()
    app.run(debug=True)`
      },
      {
        title: 'La recherche dans la base',
        text: 'Retourne dans database.py : une fonction qui filtre avec LIKE et un paramètre.',
        code: String.raw`def rechercher_livres(terme):
    with get_connexion() as conn:
        return conn.execute(
            "SELECT * FROM livres WHERE titre LIKE ? ORDER BY titre",
            (f"%{terme}%",),
        ).fetchall()`
      },
      {
        title: 'Écris les tests',
        text: 'Les fonctions de database.py se testent très bien : elles ne dépendent que de SQLite. Utilise une base temporaire pour ne pas polluer la vraie.',
        code: String.raw`import os
import tempfile
import pytest
import database

@pytest.fixture
def bdd_temp(monkeypatch, tmp_path):
    """Remplace la base par un fichier temporaire."""
    chemin = str(tmp_path / "test.db")
    monkeypatch.setattr(database, "CHEMIN_BDD", chemin)
    database.init_bdd()
    return chemin

def test_ajouter_et_lister(bdd_temp):
    database.ajouter_livre("1984", "George Orwell", 1949)
    livres = database.lister_livres()
    assert len(livres) == 1
    assert livres[0][1] == "1984"

def test_recherche(bdd_temp):
    database.ajouter_livre("Dune", "Frank Herbert", 1965)
    resultats = database.rechercher_livres("dun")
    assert len(resultats) == 1`,
        note: 'monkeypatch et tmp_path sont des fonctionnalités intégrées de pytest : pas besoin d\'installer autre chose.'
      },
      {
        title: 'Prépare le déploiement',
        text: 'Génère requirements.txt, écris un README (présentation + commandes), ajoute .gitignore (.venv, *.db, .env) et fais le premier commit Git. Ton application est prête à être déployée sur Render ou Railway !'
      }
    ],
    checklist: [
      'La table livres est créée automatiquement au lancement',
      'Ajouter un livre via le formulaire fonctionne et persiste après redémarrage',
      'La page d\'accueil liste les livres triés par titre',
      'La recherche par titre fonctionne',
      'Les tests passent (pytest)',
      'requirements.txt existe et permet de réinstaller l\'environnement',
      '.gitignore exclut .venv, *.db et .env',
      '.env.example documente les variables d\'environnement',
      'Le README explique l\'installation et le lancement',
      'Git contient au moins un commit propre'
    ],
    goingFurther: [
      'Déploie l\'application sur Render (gratuit) et partage ton lien',
      'Ajoute la suppression d\'un livre (bouton + route DELETE)',
      'Ajoute une API JSON : GET /api/livres en plus des pages HTML',
      'Ajoute une colonne « lu / à lire » et un compteur de statistiques'
    ]
  }
};