/* ============ Niveau 3 — Avancé : Code professionnel ============ */
const NIVEAU3 = {
  id: 'avance',
  emoji: '⚙️',
  title: 'Niveau 3 — Avancé',
  subtitle: 'Écris du code professionnel',
  color: '#9d7bff',
  intro: `Tu passes au niveau supérieur : programmation orientée objet, code expressif (compréhensions, générateurs, décorateurs), tests unitaires et bonnes pratiques. Ton projet : ta première vraie API web avec Flask — un serveur HTTP que d\'autres programmes peuvent utiliser.`,
  skills: ['POO', 'Héritage', 'Compréhensions', 'Décorateurs', 'Tests', 'Git'],
  lessons: [
    {
      id: 'l1',
      emoji: '🏗️',
      title: 'Classes & objets (POO)',
      duration: '30 min',
      objectives: [
        'Créer des classes avec __init__ et self',
        'Définir des méthodes et des propriétés',
        'Comprendre l\'intérêt du modèle objet'
      ],
      sections: [
        {
          heading: 'Une classe = un plan, un objet = une réalisation',
          paragraphs: [
            'La programmation orientée objet (POO) regroupe des données (attributs) et des fonctions (méthodes) dans une même structure : la classe. On crée ensuite des objets à partir de ce plan.'
          ],
          code: String.raw`class Chien:
    def __init__(self, nom, age):
        self.nom = nom      # attribut d'instance
        self.age = age

    def aboyer(self):       # méthode
        print(f"{self.nom} : Wouf !")

rex = Chien("Rex", 3)       # création d'un objet
rex.aboyer()                # Rex : Wouf !
print(rex.nom, rex.age)     # Rex 3`
        },
        {
          heading: '__init__ : le constructeur',
          paragraphs: [
            '__init__ est appelé automatiquement à la création de l\'objet. self représente l\'objet lui-même et doit être le premier paramètre de chaque méthode.'
          ],
          code: String.raw`class CompteBancaire:
    def __init__(self, titulaire, solde=0):
        self.titulaire = titulaire
        self.solde = solde

    def deposer(self, montant):
        self.solde += montant

    def retirer(self, montant):
        if montant > self.solde:
            print("Solde insuffisant !")
        else:
            self.solde -= montant

    def afficher(self):
        print(f"{self.titulaire} : {self.solde} €")

compte = CompteBancaire("Léa", 100)
compte.deposer(50)
compte.retirer(30)
compte.afficher()   # Léa : 120 €`
        },
        {
          heading: '__str__ : afficher joliment un objet',
          paragraphs: [
            'Définir __str__ (le « double underscore » : dunder) permet à print() d\'afficher ton objet proprement au lieu d\'une adresse mémoire.'
          ],
          code: String.raw`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Point({self.x}, {self.y})"

    def distance_origine(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

p = Point(3, 4)
print(p)                       # Point(3, 4)
print(p.distance_origine())    # 5.0`
        }
      ],
      tip: 'Demande-toi toujours : « cette classe regroupe-t-elle des données ET des comportements qui vont ensemble ? » Si non, une simple fonction suffit.',
      exercise: {
        title: 'Exercice : le rectangle',
        instructions: 'Complète la classe Rectangle pour que r.aire() renvoie 50 (10 × 5).',
        starter: String.raw`class Rectangle:
    def __init__(self, largeur, hauteur):
        self.largeur = largeur
        self.hauteur = hauteur

    def aire(self):
        # Complète ici

r = Rectangle(10, 5)
print(r.aire())`,
        expected: '50',
        solution: String.raw`class Rectangle:
    def __init__(self, largeur, hauteur):
        self.largeur = largeur
        self.hauteur = hauteur

    def aire(self):
        return self.largeur * self.hauteur

r = Rectangle(10, 5)
print(r.aire())`
      }
    },
    {
      id: 'l2',
      emoji: '👨‍👩‍👧',
      title: 'Héritage & polymorphisme',
      duration: '30 min',
      objectives: [
        'Réutiliser du code avec l\'héritage',
        'Redéfinir des méthodes dans une sous-classe',
        'Comprendre le polymorphisme'
      ],
      sections: [
        {
          heading: 'Hériter d\'une classe',
          paragraphs: [
            'Une sous-classe reprend automatiquement tout le comportement de sa classe parente, et peut y ajouter le sien.'
          ],
          code: String.raw`class Animal:
    def __init__(self, nom):
        self.nom = nom

    def parler(self):
        print("...")

class Chat(Animal):          # Chat hérite de Animal
    def parler(self):
        print(f"{self.nom} : Miaou !")

class Chien(Animal):
    def parler(self):
        print(f"{self.nom} : Wouf !")

chat = Chat("Minou")
chien = Chien("Rex")
chat.parler()   # Minou : Miaou !
chien.parler()  # Rex : Wouf !`
        },
        {
          heading: 'super() : appeler la classe parente',
          paragraphs: [
            'super() appelle une méthode de la classe parente — très utile pour étendre __init__ sans tout réécrire.'
          ],
          code: String.raw`class Vehicule:
    def __init__(self, marque, vitesse_max):
        self.marque = marque
        self.vitesse_max = vitesse_max

    def description(self):
        return f"{self.marque} ({self.vitesse_max} km/h)"

class Voiture(Vehicule):
    def __init__(self, marque, vitesse_max, portes):
        super().__init__(marque, vitesse_max)   # appelle Vehicule.__init__
        self.portes = portes

    def description(self):
        return super().description() + f", {self.portes} portes"

v = Voiture("Renault", 180, 5)
print(v.description())   # Renault (180 km/h), 5 portes`
        },
        {
          heading: 'Le polymorphisme : un code, plusieurs comportements',
          paragraphs: [
            'Le polymorphisme permet de traiter des objets de classes différentes de la même façon : chaque objet sait « parler » à sa manière.'
          ],
          code: String.raw`animaux = [Chat("Minou"), Chien("Rex"), Chat("Félix")]

for animal in animaux:
    animal.parler()    # chaque objet utilise SA méthode

# Minou : Miaou !
# Rex : Wouf !
# Félix : Miaou !`
        }
      ],
      tip: 'Héritage ne veut pas dire « tout mettre dans une classe géante ». Si une sous-classe n\'utilise presque rien du parent, c\'est souvent que la modélisation est fausse.',
      exercise: {
        title: 'Exercice : l\'étudiant',
        instructions: 'Complète la classe Etudiant qui hérite de Personne et ajoute un attribut ecole. Le print doit afficher : Karim étudie à PythonUniv.',
        starter: String.raw`class Personne:
    def __init__(self, nom):
        self.nom = nom

class Etudiant(Personne):
    def __init__(self, nom, ecole):
        super().__init__(nom)
        self.ecole = ecole

    def etudier(self):
        # Affiche "{nom} étudie à {ecole}"

e = Etudiant("Karim", "PythonUniv")
e.etudier()`,
        expected: 'Karim étudie à PythonUniv',
        solution: String.raw`class Personne:
    def __init__(self, nom):
        self.nom = nom

class Etudiant(Personne):
    def __init__(self, nom, ecole):
        super().__init__(nom)
        self.ecole = ecole

    def etudier(self):
        print(f"{self.nom} étudie à {self.ecole}")

e = Etudiant("Karim", "PythonUniv")
e.etudier()`
      }
    },
    {
      id: 'l3',
      emoji: '⚡',
      title: 'Compréhensions & générateurs',
      duration: '25 min',
      objectives: [
        'Écrire des listes en compréhension',
        'Créer des dictionnaires et sets en compréhension',
        'Utiliser les générateurs pour économiser la mémoire'
      ],
      sections: [
        {
          heading: 'La liste en compréhension',
          paragraphs: [
            'Une compréhension construit une liste en une seule ligne : [expression for élément in séquence if condition]. Plus lisible, plus rapide.'
          ],
          code: String.raw`nombres = [1, 2, 3, 4, 5, 6]

carres = [n ** 2 for n in nombres]
print(carres)   # [1, 4, 9, 16, 25, 36]

pairs = [n for n in nombres if n % 2 == 0]
print(pairs)    # [2, 4, 6]`
        },
        {
          heading: 'Compréhension de dictionnaires et de sets',
          paragraphs: [
            'Le même principe s\'applique aux dictionnaires et aux ensembles.'
          ],
          code: String.raw`mots = ["python", "code", "python", "api"]

longueurs = {mot: len(mot) for mot in mots}
print(longueurs)   # {'python': 6, 'code': 4, 'api': 3}

uniques = {mot for mot in mots}
print(uniques)     # {'code', 'api', 'python'} (sans doublon)`
        },
        {
          heading: 'Les générateurs : des séquences paresseuses',
          paragraphs: [
            'Un générateur (fonction avec yield, ou expression entre parenthèses) produit les valeurs une à une, à la demande. Pour de gros volumes de données, il ne stocke rien en mémoire.'
          ],
          code: String.raw`def compter(n):
    for i in range(n):
        yield i * 10      # yield = "produit une valeur, on reprendra ensuite"

for valeur in compter(3):
    print(valeur)         # 0, 10, 20

# Version générateur "inline" :
carres_paresseux = (n ** 2 for n in range(1_000_000))
print(sum(carres_paresseux))   # calcule sans stocker un million de valeurs`
        }
      ],
      tip: 'Une compréhension reste LISIBLE : si elle devient trop longue ou imbriquée, reviens à une boucle classique avec des noms clairs.',
      exercise: {
        title: 'Exercice : les nombres pairs au carré',
        instructions: 'Complète le programme pour afficher [0, 4, 16, 36, 64] : les carrés des nombres pairs de 0 à 8.',
        starter: String.raw`resultat = [n ** 2 for n in range(10) if n % 2 == 0]
print(resultat)`,
        expected: '[0, 4, 16, 36, 64]',
        solution: String.raw`resultat = [n ** 2 for n in range(10) if n % 2 == 0]
print(resultat)`
      }
    },
    {
      id: 'l4',
      emoji: '✨',
      title: 'Décorateurs & context managers',
      duration: '30 min',
      objectives: [
        'Comprendre le principe d\'un décorateur',
        'Écrire et utiliser @staticmethod et @classmethod',
        'Créer son propre context manager'
      ],
      sections: [
        {
          heading: 'Qu\'est-ce qu\'un décorateur ?',
          paragraphs: [
            'Un décorateur « enveloppe » une fonction pour ajouter du comportement avant/après son exécution. On l\'applique avec le symbole @ au-dessus de la fonction.'
          ],
          code: String.raw`def chronometre(fonction):
    def enveloppe(*args, **kwargs):
        import time
        debut = time.time()
        resultat = fonction(*args, **kwargs)
        duree = time.time() - debut
        print(f"{fonction.__name__} a pris {duree:.4f} s")
        return resultat
    return enveloppe

@chronometre
def calcul_long():
    total = 0
    for i in range(1_000_000):
        total += i
    return total

print(calcul_long())   # affiche aussi la durée`
        },
        {
          heading: '@staticmethod et @classmethod',
          paragraphs: [
            'staticmethod : une fonction dans la classe qui n\'a pas besoin de self. classmethod : reçoit la classe (cls) au lieu de l\'objet — utile pour des constructeurs alternatifs.'
          ],
          code: String.raw`class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @staticmethod
    def vers_fahrenheit(celsius):
        return celsius * 9 / 5 + 32

    @classmethod
    def depuis_fahrenheit(cls, fahrenheit):
        return cls((fahrenheit - 32) * 5 / 9)

print(Temperature.vers_fahrenheit(0))        # 32.0
t = Temperature.depuis_fahrenheit(212)
print(t.celsius)                             # 100.0`
        },
        {
          heading: 'Écrire son propre context manager',
          paragraphs: [
            'Un context manager contrôle l\'entrée et la sortie d\'un bloc with. Le plus simple : le module contextlib avec yield.'
          ],
          code: String.raw`from contextlib import contextmanager

@contextmanager
def journal(action):
    print(f"Début : {action}")
    yield                  # le bloc with s'exécute ici
    print(f"Fin : {action}")

with journal("sauvegarde"):
    print("... traitement ...")

# Début : sauvegarde
# ... traitement ...
# Fin : sauvegarde`
        }
      ],
      tip: 'Tu utilises déjà des context managers sans le savoir : with open(...) as f: et with lock: en sont. Comprendre le mécanisme te donne le contrôle total.',
      exercise: {
        title: 'Exercice : double appel',
        instructions: 'Complète le décorateur pour que l\'appel à dire_bonjour() exécute la fonction DEUX fois (deux affichages).',
        starter: String.raw`def deux_fois(fonction):
    def enveloppe(*args, **kwargs):
        # Complète : appelle fonction deux fois
    return enveloppe

@deux_fois
def dire_bonjour():
    print("Bonjour !")

dire_bonjour()`,
        expected: 'Bonjour !\nBonjour !',
        solution: String.raw`def deux_fois(fonction):
    def enveloppe(*args, **kwargs):
        fonction(*args, **kwargs)
        fonction(*args, **kwargs)
    return enveloppe

@deux_fois
def dire_bonjour():
    print("Bonjour !")

dire_bonjour()`
      }
    },
    {
      id: 'l5',
      emoji: '🧪',
      title: 'Tests unitaires avec pytest',
      duration: '30 min',
      objectives: [
        'Écrire des tests avec pytest',
        'Tester les cas normaux ET les cas limites',
        'Installer et utiliser pytest'
      ],
      sections: [
        {
          heading: 'Pourquoi tester ?',
          paragraphs: [
            'Un test unitaire vérifie qu\'une fonction se comporte comme prévu. Tester, c\'est : refactoriser sans casser, documenter le comportement attendu, et dormir tranquille.'
          ],
          code: String.raw`# fichier : calculs.py
def prix_ttc(prix_ht, tva=20):
    return prix_ht * (1 + tva / 100)`,
          note: 'Teste d\'abord le comportement normal, puis les cas limites : zéro, négatif, valeurs vides…'
        },
        {
          heading: 'Écrire son premier test',
          paragraphs: [
            'Installe pytest (pip install pytest), crée un fichier test_calculs.py, puis lance « pytest » dans le terminal. Les fonctions de test commencent par test_.'
          ],
          code: String.raw`# fichier : test_calculs.py
from calculs import prix_ttc

def test_prix_ttc_classique():
    assert prix_ttc(100) == 120

def test_prix_ttc_tva_reduite():
    assert prix_ttc(100, 5.5) == 105.5

def test_prix_ttc_zero():
    assert prix_ttc(0) == 0`,
          note: 'assert vérifie une condition. Si elle est fausse, le test échoue — et tu sais exactement quoi corriger.'
        },
        {
          heading: 'Tester les erreurs attendues',
          paragraphs: [
            'Certaines fonctions sont censées lever des exceptions. pytest permet de le vérifier explicitement.'
          ],
          code: String.raw`# calculs.py
def diviser(a, b):
    if b == 0:
        raise ValueError("Division par zéro")
    return a / b

# test_calculs.py
import pytest
from calculs import diviser

def test_division_par_zero():
    with pytest.raises(ValueError):
        diviser(10, 0)`,
          note: 'Le test passe si l\'exception est levée — c\'est le comportement attendu.'
        }
      ],
      tip: 'La règle des tests : « test d\'abord ou code d\'abord, mais jamais zéro test ». Même un petit test vaut mieux que pas de test du tout.',
      exercise: {
        title: 'Exercice : tester la fonction',
        instructions: 'Complète le test pour vérifier que triple(4) renvoie 12. Utilise assert.',
        starter: String.raw`def triple(n):
    return n * 3

def test_triple():
    # Complète ici`,
        expected: 'RANDINT:0:0',
        expectedLabel: 'Le test passe (assert triple(4) == 12)',
        check: 'contains',
        contains: 'assert triple(4) == 12',
        solution: String.raw`def triple(n):
    return n * 3

def test_triple():
    assert triple(4) == 12`
      }
    },
    {
      id: 'l6',
      emoji: '🌿',
      title: 'Git & bonnes pratiques',
      duration: '25 min',
      objectives: [
        'Versionner son code avec Git',
        'Respecter la PEP 8 et les conventions',
        'Structurer un projet proprement'
      ],
      sections: [
        {
          heading: 'Git : la machine à remonter le temps',
          paragraphs: [
            'Git garde l\'historique de ton code : tu peux revenir en arrière, tester des idées sur des branches, et collaborer sans écraser le travail des autres. Quelques commandes suffisent pour commencer.'
          ],
          code: String.raw`# Dans le terminal, dans le dossier du projet :
git init                # initialise le dépôt (une seule fois)
git add .               # prépare les fichiers
git commit -m "Première version de mon projet"
git log                 # historique des commits`,
          note: 'Fais un commit petit et fréquent, avec un message qui explique le POURQUOI, pas le quoi.'
        },
        {
          heading: 'PEP 8 : le style officiel',
          paragraphs: [
            'La PEP 8 définit les conventions de style Python. Les plus importantes :'
          ],
          list: [
            '4 espaces d\'indentation (pas de tabulation)',
            '79 caractères maximum par ligne',
            'snake_case pour les variables et fonctions, CamelCase pour les classes',
            'Une ligne vide entre deux fonctions, deux entre deux classes',
            'Des espaces autour des opérateurs : a = b + 1, pas a=b+1'
          ],
          note: 'L\'outil black formate ton code automatiquement ; flake8 signale les écarts.'
        },
        {
          heading: 'Structurer un projet',
          paragraphs: [
            'Un projet Python standard ressemble à ceci :'
          ],
          code: String.raw`mon_projet/
├── mon_projet/          # le code (nom = dossier du projet)
│   ├── __init__.py
│   ├── calculs.py
│   └── outils.py
├── tests/
│   └── test_calculs.py
├── README.md            # présentation du projet
├── requirements.txt     # dépendances
└── .gitignore           # fichiers à ne pas versionner`,
          note: '__init__.py marque un dossier comme « package » importable. .gitignore exclut par exemple le dossier .venv ou les fichiers .json générés.'
        }
      ],
      tip: 'Commit = « sauvegarde logique » : après une fonction qui marche, après un bug corrigé, jamais « wip » à la va-vite à la fin de la journée.',
      exercise: {
        title: 'Exercice : nommer correctement',
        instructions: 'Corrige ce code pour respecter les conventions : les noms et l\'espacement.',
        starter: String.raw`MaVariable=42
def MaFonction(x):
    return x*2
print(MaFonction(MaVariable))`,
        expected: '84',
        solution: String.raw`ma_variable = 42

def ma_fonction(x):
    return x * 2

print(ma_fonction(ma_variable))`
      }
    }
  ],
  quiz: {
    title: 'Quiz du Niveau 3',
    questions: [
      {
        q: 'Que représente self dans une méthode ?',
        options: ['La classe elle-même', 'L\'objet courant', 'Le module courant', 'Le premier argument de la fonction'],
        correct: 1,
        explain: 'self représente l\'instance (l\'objet) sur laquelle la méthode est appelée.'
      },
      {
        q: 'Quelle méthode est appelée automatiquement à la création d\'un objet ?',
        options: ['__str__', '__init__', '__main__', '__new__ (mais ce n\'est pas celle qu\'on utilise en pratique)'],
        correct: 1,
        explain: '__init__ est le constructeur : il initialise l\'objet à sa création.'
      },
      {
        q: 'Que fait une sous-classe quand elle définit une méthode du même nom que son parent ?',
        options: ['Elle plante', 'Elle la redéfinit (override)', 'Elle la copie dans le parent', 'Rien'],
        correct: 1,
        explain: 'La sous-classe remplace la méthode parente : c\'est le polymorphisme.'
      },
      {
        q: 'Que renvoie [n for n in range(5) if n % 2 == 1] ?',
        options: ['[0, 2, 4]', '[1, 3]', '[1, 3, 5]', '[0, 1, 2, 3, 4]'],
        correct: 1,
        explain: 'Les nombres impairs de 0 à 4 : 1 et 3. (5 est exclu car range(5) s\'arrête à 4.)'
      },
      {
        q: 'Quel est l\'intérêt d\'un générateur (yield) ?',
        options: ['Il est plus rapide qu\'une fonction', 'Il ne stocke pas toute la séquence en mémoire', 'Il remplace les classes', 'Il force le typage'],
        correct: 1,
        explain: 'Le générateur produit les valeurs à la demande : mémoire constante, même pour un milliard d\'éléments.'
      },
      {
        q: 'Comment appliquer un décorateur à une fonction ?',
        options: ['Avec le mot-clé decor', 'Avec le symbole @ au-dessus de la fonction', 'Avec une indentation spéciale', 'Avec le module sys'],
        correct: 1,
        explain: '@nom_du_decorateur juste au-dessus de la définition de la fonction.'
      },
      {
        q: 'Quel outil exécute les fonctions de test commençant par test_ ?',
        options: ['PEP 8', 'pytest', 'pip', 'black'],
        correct: 1,
        explain: 'pytest découvre et exécute automatiquement les tests. black formate, PEP 8 est la convention.'
      },
      {
        q: 'Quelle est la bonne convention pour nommer une classe ?',
        options: ['snake_case', 'CamelCase', 'UPPER_CASE', 'kebab-case'],
        correct: 1,
        explain: 'CamelCase pour les classes (Exemple: CompteBancaire), snake_case pour les fonctions et variables.'
      }
    ]
  },
  project: {
    id: 'p3',
    emoji: '🌐',
    title: 'Projet 3 : API REST « Bibliothèque » avec Flask',
    summary: 'Ta première application web : un serveur HTTP qui expose une API REST pour gérer une bibliothèque de livres (créer, lister, consulter, supprimer). D\'autres programmes — et toi — pourront l\'interroger avec des requêtes HTTP.',
    goals: ['Installer Flask dans un environnement virtuel', 'Créer des routes HTTP (GET, POST, DELETE)', 'Travailler avec du JSON', 'Comprendre l\'architecture client / serveur'],
    steps: [
      {
        title: 'Crée l\'environnement et installe Flask',
        text: 'Un environnement virtuel isole les dépendances de ton projet. Dans le terminal :',
        code: String.raw`# dans le dossier du projet
python3 -m venv .venv
source .venv/bin/activate        # Windows : .venv\Scripts\activate
pip install flask
pip freeze > requirements.txt    # sauvegarde les dépendances`,
        note: 'Le fichier requirements.txt permet de réinstaller l\'environnement en une commande : pip install -r requirements.txt'
      },
      {
        title: 'Le serveur minimal',
        text: 'Crée app.py avec une route racine. Lance python app.py puis ouvre http://127.0.0.1:5000 dans ton navigateur.',
        code: String.raw`from flask import Flask, jsonify, request

app = Flask(__name__)

livres = [
    {"id": 1, "titre": "1984", "auteur": "George Orwell"},
    {"id": 2, "titre": "Dune", "auteur": "Frank Herbert"},
]

@app.route("/")
def accueil():
    return "Bienvenue sur l'API Bibliothèque !"

if __name__ == "__main__":
    app.run(debug=True)`
      },
      {
        title: 'Lister et consulter les livres',
        text: 'Une API REST expose des routes. GET /livres renvoie la liste, GET /livres/<id> renvoie un livre précis.',
        code: String.raw`@app.route("/livres", methods=["GET"])
def lister_livres():
    return jsonify(livres)

@app.route("/livres/<int:livre_id>", methods=["GET"])
def detail_livre(livre_id):
    livre = next((l for l in livres if l["id"] == livre_id), None)
    if livre is None:
        return jsonify({"erreur": "Livre introuvable"}), 404
    return jsonify(livre)`,
        note: 'Le « 404 » est un code de statut HTTP : il dit au client que la ressource n\'existe pas. Les codes de statut font partie du contrat d\'une API.'
      },
      {
        title: 'Ajouter et supprimer',
        text: 'POST ajoute une ressource (les données arrivent en JSON dans le corps de la requête), DELETE la supprime.',
        code: String.raw`@app.route("/livres", methods=["POST"])
def ajouter_livre():
    donnees = request.get_json()
    if not donnees or "titre" not in donnees or "auteur" not in donnees:
        return jsonify({"erreur": "Il faut un titre et un auteur"}), 400
    nouveau = {
        "id": max(l["id"] for l in livres) + 1,
        "titre": donnees["titre"],
        "auteur": donnees["auteur"],
    }
    livres.append(nouveau)
    return jsonify(nouveau), 201   # 201 = créé

@app.route("/livres/<int:livre_id>", methods=["DELETE"])
def supprimer_livre(livre_id):
    global livres
    livres = [l for l in livres if l["id"] != livre_id]
    return jsonify({"message": "Livre supprimé"})`
      },
      {
        title: 'Teste ton API',
        text: 'Avec le serveur qui tourne, teste depuis un autre terminal avec curl (ou l\'extension REST de ton éditeur) :',
        code: String.raw`curl http://127.0.0.1:5000/livres
curl -X POST http://127.0.0.1:5000/livres \
  -H "Content-Type: application/json" \
  -d '{"titre": "Fondation", "auteur": "Isaac Asimov"}'
curl http://127.0.0.1:5000/livres/1
curl -X DELETE http://127.0.0.1:5000/livres/2`
      },
      {
        title: 'Bonnes pratiques finales',
        text: 'Ajoute un README.md (présentation + commandes de lancement), un .gitignore avec .venv, initialise Git et fais ton premier commit. Ton projet est propre et versionné.'
      }
    ],
    checklist: [
      'L\'environnement virtuel est créé et Flask est installé',
      'Le serveur démarre et la route / répond',
      'GET /livres renvoie la liste en JSON',
      'GET /livres/1 renvoie le bon livre',
      'Un livre inconnu renvoie un 404 avec un message clair',
      'POST /livres ajoute un livre (code 201)',
      'POST sans données valides renvoie un 400',
      'DELETE /livres/<id> supprime le bon livre',
      'requirements.txt et .gitignore existent',
      'Git est initialisé avec au moins un commit'
    ],
    goingFurther: [
      'Ajoute une route PUT /livres/<id> pour modifier un livre',
      'Ajoute une recherche : GET /livres?titre=dune',
      'Stocke les livres dans un fichier JSON persistant',
      'Affiche une page HTML simple à la racine'
    ]
  }
};