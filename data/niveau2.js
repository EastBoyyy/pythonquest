/* ============ Niveau 2 — Intermédiaire : Structure ton code ============ */
const NIVEAU2 = {
  id: 'intermediaire',
  emoji: '🚀',
  title: 'Niveau 2 — Intermédiaire',
  subtitle: 'Structure ton code',
  color: '#fbbf24',
  intro: `Tu maîtrises la syntaxe de base. Place à la vraie programmation : écrire des fonctions réutilisables, lire et écrire des fichiers, gérer les erreurs avec élégance et exploiter la bibliothèque standard. Ton projet : un gestionnaire de tâches qui sauvegarde ses données sur disque — un programme que tu utiliseras tous les jours.`,
  skills: ['Fonctions', 'Fichiers', 'Gestion d\'erreurs', 'Modules', 'Chaînes avancées'],
  lessons: [
    {
      id: 'l1',
      emoji: '🧩',
      title: 'Fonctions : écrire du code réutilisable',
      duration: '25 min',
      objectives: [
        'Définir tes propres fonctions avec def',
        'Retourner des valeurs avec return',
        'Donner des valeurs par défaut aux paramètres'
      ],
      sections: [
        {
          heading: 'Pourquoi des fonctions ?',
          paragraphs: [
            'Une fonction est un bloc de code nommé et réutilisable. Elle évite la duplication : si tu corriges un bug dans une fonction, la correction s\'applique partout où elle est appelée.'
          ],
          code: String.raw`def saluer(nom):
    print(f"Salut {nom} !")

saluer("Léa")
saluer("Karim")
# Affiche :
# Salut Léa !
# Salut Karim !`
        },
        {
          heading: 'return : faire remonter un résultat',
          paragraphs: [
            'Une fonction peut calculer un résultat et le rendre avec return. Le code après return n\'est jamais exécuté.'
          ],
          code: String.raw`def prix_ttc(prix_ht, tva=20):
    """Calcule le prix toutes taxes comprises."""
    return prix_ht * (1 + tva / 100)

total = prix_ttc(100)        # 120.0  (tva par défaut : 20)
total2 = prix_ttc(100, 5.5)  # 105.5  (tva réduite)
print(total, total2)`
        },
        {
          heading: 'Docstring : documenter la fonction',
          paragraphs: [
            'La chaîne entre triple guillemets juste après def est la docstring : la documentation de la fonction. On la lit avec help(ma_fonction).'
          ],
          code: String.raw`def aire_rectangle(longueur, largeur):
    """Renvoie l'aire d'un rectangle.

    longueur : float
    largeur : float
    """
    return longueur * largeur

print(aire_rectangle(5, 3))   # 15
print(aire_rectangle.__doc__) # affiche la docstring`
        }
      ],
      tip: 'Une fonction doit faire UNE seule chose, bien. Si son nom contient « et » (ex: calculer_et_afficher), découpe-la en deux.',
      exercise: {
        title: 'Exercice : la fonction double',
        instructions: 'Écris une fonction double(n) qui renvoie n * 2, puis affiche double(21). Résultat attendu : 42.',
        starter: String.raw`def double(n):
    # Complète ici

print(double(21))`,
        expected: '42',
        solution: String.raw`def double(n):
    return n * 2

print(double(21))`
      }
    },
    {
      id: 'l2',
      emoji: '🎯',
      title: 'Arguments : les super-pouvoirs des fonctions',
      duration: '25 min',
      objectives: [
        'Passer des arguments par position ou par nom',
        'Utiliser *args et **kwargs',
        'Comprendre la portée des variables'
      ],
      sections: [
        {
          heading: 'Arguments par position et par nom',
          paragraphs: [
            'On peut appeler une fonction en donnant les arguments dans l\'ordre (par position) ou en précisant leur nom (mots-clés). Le nom est plus lisible.'
          ],
          code: String.raw`def profil(nom, age, ville):
    return f"{nom}, {age} ans, habite à {ville}"

print(profil("Léa", 25, "Lyon"))        # par position
print(profil(ville="Lyon", nom="Léa", age=25))  # par nom
# Attention : les arguments par nom viennent TOUJOURS après les positionnels`
        },
        {
          heading: '*args : un nombre variable d\'arguments',
          paragraphs: [
            'L\'étoile devant args collecte tous les arguments positionnels dans un tuple. Pratique quand on ne sait pas à l\'avance combien il y en aura.'
          ],
          code: String.raw`def somme(*nombres):
    total = 0
    for n in nombres:
        total += n
    return total

print(somme(1, 2, 3))        # 6
print(somme(10, 20, 30, 40)) # 100`
        },
        {
          heading: '**kwargs : des arguments nommés dynamiques',
          paragraphs: [
            'Deux étoiles collectent les arguments nommés dans un dictionnaire. Utile pour des options de configuration.'
          ],
          code: String.raw`def configurer(**options):
    for cle, valeur in options.items():
        print(f"{cle} = {valeur}")

configurer(theme="sombre", langue="fr", notifications=True)`
        },
        {
          heading: 'La portée des variables',
          paragraphs: [
            'Une variable créée dans une fonction est locale : elle n\'existe que dans la fonction. Une variable créée au niveau du fichier est globale. Pour modifier une variable globale dans une fonction, il faut le mot-clé global (à éviter si possible).'
          ],
          code: String.raw`def essai():
    x = 10        # variable locale
    return x

x = 5             # variable globale
print(essai())    # 10
print(x)          # 5 : la globale n'a pas changé`
        }
      ],
      tip: 'Règle pratique : une fonction ne devrait pas dépasser ~20 lignes et ne devrait jamais modifier des variables globales. Elle prend des entrées, renvoie un résultat.',
      exercise: {
        title: 'Exercice : bonjour à tous',
        instructions: 'Complète la fonction bonjour(*noms) pour qu\'elle salue chaque nom. Appel attendu : bonjour("Léa", "Karim") doit afficher deux salutations.',
        starter: String.raw`def bonjour(*noms):
    # Complète ici : salue chaque nom

bonjour("Léa", "Karim")`,
        expected: 'Salut Léa !\nSalut Karim !',
        solution: String.raw`def bonjour(*noms):
    for nom in noms:
        print(f"Salut {nom} !")

bonjour("Léa", "Karim")`
      }
    },
    {
      id: 'l3',
      emoji: '📁',
      title: 'Travailler avec les fichiers',
      duration: '25 min',
      objectives: [
        'Lire un fichier texte',
        'Écrire et ajouter du contenu',
        'Utiliser le format JSON pour structurer les données'
      ],
      sections: [
        {
          heading: 'Lire un fichier',
          paragraphs: [
            'On ouvre un fichier avec open() et on le ferme avec close(). Le « with » gère la fermeture automatiquement, même en cas d\'erreur : c\'est la méthode à utiliser.'
          ],
          code: String.raw`with open("journal.txt", "r", encoding="utf-8") as fichier:
    contenu = fichier.read()

print(contenu)`,
          note: 'encoding="utf-8" est indispensable en français pour bien lire les accents.'
        },
        {
          heading: 'Écrire et ajouter',
          paragraphs: [
            'Le mode "w" écrase le fichier, le mode "a" ajoute à la fin. Lire ligne par ligne avec une boucle est idéal pour les gros fichiers.'
          ],
          code: String.raw`with open("journal.txt", "a", encoding="utf-8") as f:
    f.write("Aujourd'hui j'ai appris les fichiers en Python.\n")

with open("journal.txt", "r", encoding="utf-8") as f:
    for ligne in f:
        print(ligne.strip())   # strip() retire le saut de ligne`
        },
        {
          heading: 'JSON : le format d\'échange universel',
          paragraphs: [
            'JSON est le format de données le plus utilisé (web, API, configuration). En Python, le module json transforme un dictionnaire en texte et inversement.'
          ],
          code: String.raw`import json

donnees = {"nom": "Sofia", "age": 21, "cours": ["python", "web"]}

# dict → texte JSON
texte = json.dumps(donnees, ensure_ascii=False, indent=2)
print(texte)

# texte JSON → dict
recupere = json.loads(texte)
print(recupere["nom"])   # Sofia`,
          note: 'ensure_ascii=False garde les accents lisibles dans le fichier.'
        },
        {
          heading: 'Sauvegarder un dictionnaire dans un fichier',
          paragraphs: [
            'Combiner open() et json permet de sauvegarder des données entre deux lancements du programme — la base de tout logiciel qui persiste.'
          ],
          code: String.raw`import json

profil = {"nom": "Sofia", "age": 21}

with open("profil.json", "w", encoding="utf-8") as f:
    json.dump(profil, f, ensure_ascii=False, indent=2)

with open("profil.json", "r", encoding="utf-8") as f:
    profil_charge = json.load(f)

print(profil_charge)`
        }
      ],
      tip: 'Toujours « with open(...) as f: » — jamais open() sans with. La fermeture automatique évite des bugs sournois.',
      exercise: {
        title: 'Exercice : JSON aller-retour',
        instructions: 'Complète le programme pour afficher la valeur de la clé "ville" chargée depuis le fichier JSON.',
        starter: String.raw`import json

donnees = {"nom": "Karim", "ville": "Paris"}

with open("test.json", "w", encoding="utf-8") as f:
    json.dump(donnees, f, ensure_ascii=False)

with open("test.json", "r", encoding="utf-8") as f:
    charge = json.load(f)

# Affiche "Paris" depuis le dictionnaire chargé`,
        expected: 'Paris',
        solution: String.raw`import json

donnees = {"nom": "Karim", "ville": "Paris"}

with open("test.json", "w", encoding="utf-8") as f:
    json.dump(donnees, f, ensure_ascii=False)

with open("test.json", "r", encoding="utf-8") as f:
    charge = json.load(f)

print(charge["ville"])`
      }
    },
    {
      id: 'l4',
      emoji: '🛡️',
      title: 'Gérer les erreurs comme un pro',
      duration: '25 min',
      objectives: [
        'Intercepter les erreurs avec try / except',
        'Utiliser else et finally',
        'Lever ses propres erreurs avec raise'
      ],
      sections: [
        {
          heading: 'try / except : intercepter sans planter',
          paragraphs: [
            'Plutôt que de laisser le programme planter, on peut intercepter une erreur et réagir proprement.'
          ],
          code: String.raw`try:
    nombre = int(input("Donne un nombre : "))
    print(f"Le double est {nombre * 2}")
except ValueError:
    print("Ce n'est pas un nombre valide !")

# Si l'utilisateur tape "abc", pas de plantage : on affiche un message.`
        },
        {
          heading: 'Intercepter des types d\'erreurs précis',
          paragraphs: [
            'Chaque erreur a un type : ValueError (valeur invalide), ZeroDivisionError, FileNotFoundError, KeyError… On peut enchaîner plusieurs except.'
          ],
          code: String.raw`try:
    with open("fichier_inexistant.txt", "r") as f:
        print(f.read())
except FileNotFoundError:
    print("Le fichier n'existe pas.")
except PermissionError:
    print("Pas la permission de lire ce fichier.")`
        },
        {
          heading: 'else et finally',
          paragraphs: [
            'else s\'exécute si aucune erreur n\'est survenue. finally s\'exécute TOUJOURS, erreur ou non (idéal pour le nettoyage).'
          ],
          code: String.raw`try:
    fichier = open("journal.txt", "r", encoding="utf-8")
except FileNotFoundError:
    print("Fichier introuvable, création d'un vide.")
    fichier = open("journal.txt", "w", encoding="utf-8")
else:
    print("Ouverture réussie !")
finally:
    fichier.close()
    print("Fichier fermé.")`
        },
        {
          heading: 'raise : lever ses propres erreurs',
          paragraphs: [
            'Parfois, ton code doit refuser une valeur invalide. On lève alors une exception avec raise. Le programme s\'arrête avec un message clair.'
          ],
          code: String.raw`def calculer_salaire(heures, tarif):
    if heures < 0 or tarif < 0:
        raise ValueError("Les heures et le tarif doivent être positifs")
    return heures * tarif

print(calculer_salaire(35, 15))   # 525
# calculer_salaire(-5, 15) → ValueError : message clair`
        }
      ],
      tip: 'N\'attrape jamais une erreur en silence (except: pass). Soit tu gères, soit tu laisses remonter — mais ne fais jamais comme si rien ne s\'était passé.',
      exercise: {
        title: 'Exercice : division sécurisée',
        instructions: 'Complète le programme pour qu\'il affiche « Division par zéro interdite ! » au lieu de planter quand b vaut 0.',
        starter: String.raw`a = 10
b = 0

try:
    print(a / b)
except ZeroDivisionError:
    # Affiche le message d'erreur`,
        expected: 'Division par zéro interdite !',
        solution: String.raw`a = 10
b = 0

try:
    print(a / b)
except ZeroDivisionError:
    print("Division par zéro interdite !")`
      }
    },
    {
      id: 'l5',
      emoji: '📦',
      title: 'Modules & bibliothèque standard',
      duration: '25 min',
      objectives: [
        'Importer des modules avec import',
        'Exploiter math, random et datetime',
        'Créer et réutiliser tes propres modules'
      ],
      sections: [
        {
          heading: 'Importer un module',
          paragraphs: [
            'Un module est un fichier Python contenant du code réutilisable. La bibliothèque standard en fournit des centaines : on les importe pour étendre les capacités de Python.'
          ],
          code: String.raw`import math

print(math.sqrt(144))      # 12.0
print(math.pi)             # 3.141592653589793
print(math.floor(3.7))     # 3
print(math.ceil(3.2))      # 4`
        },
        {
          heading: 'random : le hasard',
          paragraphs: [
            'random permet de générer des nombres aléatoires ou de tirer un élément au sort.'
          ],
          code: String.raw`import random

print(random.randint(1, 6))        # un dé à 6 faces
print(random.choice(["pierre", "feuille", "ciseaux"]))

couleurs = ["rouge", "vert", "bleu"]
random.shuffle(couleurs)
print(couleurs)                    # ordre mélangé`
        },
        {
          heading: 'datetime : les dates et heures',
          paragraphs: [
            'datetime manipule les dates proprement — beaucoup plus fiable que de stocker des chaînes de caractères.'
          ],
          code: String.raw`from datetime import datetime, date

maintenant = datetime.now()
print(maintenant.strftime("%d/%m/%Y %H:%M"))

aujourd_hui = date.today()
naissance = date(1999, 5, 17)
print((aujourd_hui - naissance).days // 365, "ans environ")`
        },
        {
          heading: 'Créer ton propre module',
          paragraphs: [
            'N\'importe quel fichier .py peut être importé : mets des fonctions dans outils.py, puis importe-les depuis un autre fichier. C\'est ainsi qu\'on structure un vrai projet.'
          ],
          code: String.raw`# --- fichier outils.py ---
def saluer(nom):
    return f"Salut {nom} !"

# --- fichier principal.py (même dossier) ---
import outils

print(outils.saluer("Sofia"))`,
          note: 'Quand on exécute principal.py directement, la ligne « import outils » charge outils.py au même endroit.'
        }
      ],
      tip: 'Avant de réinventer la roue, demande-toi si la bibliothèque standard ne fait pas déjà le travail : os, pathlib, json, csv, re, collections, itertools…',
      exercise: {
        title: 'Exercice : tirer au sort',
        instructions: 'Complète le programme pour afficher un nombre aléatoire entier entre 1 et 10 inclus.',
        starter: String.raw`import random

# Affiche un entier aléatoire entre 1 et 10`,
        expected: 'RANDINT:1:10',
        expectedLabel: 'un nombre entier entre 1 et 10 (aléatoire)',
        check: 'randint',
        solution: 'print(random.randint(1, 10))'
      }
    },
    {
      id: 'l6',
      emoji: '🧵',
      title: 'Chaînes de caractères avancées',
      duration: '25 min',
      objectives: [
        'Découper et extraire des sous-chaînes',
        'Utiliser les méthodes split / join / replace',
        'Maîtriser le slicing'
      ],
      sections: [
        {
          heading: 'Slicing : découper une chaîne',
          paragraphs: [
            'Comme les listes, les chaînes se découpent avec [début:fin:pas]. Le fin est exclu.'
          ],
          code: String.raw`mot = "programmation"

print(mot[0:4])     # prog
print(mot[4:])      # rammation  (de l'index 4 à la fin)
print(mot[::-1])    # noitammargorp  (à l'envers !)
print(mot[::2])     # pgamn (un caractère sur deux)`
        },
        {
          heading: 'Les méthodes essentielles',
          paragraphs: [
            'split() découpe une chaîne en liste, join() fait l\'inverse, replace() remplace du texte. lower()/upper() normalisent la casse.'
          ],
          code: String.raw`phrase = "Python est un super langage"

mots = phrase.split()           # ['Python', 'est', 'un', 'super', 'langage']
print(mots)
print(" | ".join(mots))         # Python | est | un | super | langage
print(phrase.replace("super", "excellent"))
print(phrase.upper())`
        },
        {
          heading: 'Tester et nettoyer le texte',
          paragraphs: [
            'Des méthodes booléennes testent le contenu : startswith, endswith, isdigit… et strip() nettoie les espaces en trop (très utile avec input()).'
          ],
          code: String.raw`email = "  Sofia.DUPONT@exemple.fr  "

email = email.strip().lower()
print(email)                     # sofia.dupont@exemple.fr
print(email.endswith(".fr"))     # True
print("123".isdigit())           # True
print("abc".isdigit())           # False`
        }
      ],
      tip: 'Les chaînes sont immuables : replace(), upper()… renvoient une NOUVELLE chaîne, elles ne modifient pas l\'originale. Pense à réassigner le résultat.',
      exercise: {
        title: 'Exercice : mots en majuscules',
        instructions: 'Complète le programme pour afficher chaque mot de la phrase en majuscules, un par ligne.',
        starter: String.raw`phrase = "Python est génial"

# Découpe la phrase et affiche chaque mot en majuscules
for mot in phrase.split():
    # Complète ici`,
        expected: 'PYTHON\nEST\nGÉNIAL',
        solution: String.raw`phrase = "Python est génial"
for mot in phrase.split():
    print(mot.upper())`
      }
    }
  ],
  quiz: {
    title: 'Quiz du Niveau 2',
    questions: [
      {
        q: 'Que renvoie une fonction qui n\'a pas de return ?',
        options: ['0', 'None', 'Une erreur', 'Une chaîne vide'],
        correct: 1,
        explain: 'Sans return, une fonction renvoie implicitement None.'
      },
      {
        q: 'Que fait *args dans def f(*args): ?',
        options: ['Il force le passage par nom', 'Il collecte les arguments positionnels dans un tuple', 'Il autorise un seul argument', 'Il rend la fonction infinie'],
        correct: 1,
        explain: '*args rassemble tous les arguments positionnels dans un tuple.'
      },
      {
        q: 'Quel mode d\'ouverture AJOUTE du contenu à la fin d\'un fichier ?',
        options: ['"w"', '"r"', '"a"', '"x"'],
        correct: 2,
        explain: '"a" (append) ajoute à la fin. "w" écrase entièrement le fichier.'
      },
      {
        q: 'Pourquoi utiliser « with open(...) as f: » ?',
        options: ['C\'est plus rapide', 'Le fichier est fermé automatiquement', 'Ça compresse le fichier', 'Ça évite d\'écrire le nom du fichier'],
        correct: 1,
        explain: 'with garantit la fermeture du fichier même si une erreur survient.'
      },
      {
        q: 'Quel module de la bibliothèque standard permet de sauvegarder des dictionnaires en JSON ?',
        options: ['json', 'csv', 'sys', 'fichier'],
        correct: 0,
        explain: 'Le module json : json.dump pour écrire, json.load pour lire.'
      },
      {
        q: 'Que se passe-t-il si aucune erreur n\'est levée dans un bloc try / except / else ?',
        options: ['Rien de plus', 'Le bloc else s\'exécute', 'Le bloc except s\'exécute', 'Le programme se termine'],
        correct: 1,
        explain: 'else s\'exécute uniquement quand aucune exception n\'a été levée.'
      },
      {
        q: 'Que fait mot[::-1] ?',
        options: ['Il supprime la dernière lettre', 'Il inverse la chaîne', 'Il double la chaîne', 'Il renvoie la première lettre'],
        correct: 1,
        explain: 'Le pas -1 parcourt la chaîne à l\'envers : résultat inversé.'
      },
      {
        q: 'Comment obtenir un nombre entier aléatoire entre 1 et 6 ?',
        options: ['random.random(1, 6)', 'random.randint(1, 6)', 'random.choose(1, 6)', 'random.int(6)'],
        correct: 1,
        explain: 'random.randint(a, b) renvoie un entier aléatoire entre a et b inclus.'
      }
    ]
  },
  project: {
    id: 'p2',
    emoji: '✅',
    title: 'Projet 2 : Gestionnaire de tâches',
    summary: 'Un vrai outil du quotidien : ajoute, liste, termine et supprime des tâches… et surtout, sauvegarde-les dans un fichier JSON pour les retrouver au prochain lancement.',
    goals: ['Structurer un programme autour d\'un menu', 'Utiliser des fonctions pour chaque action', 'Sauvegarder et charger des données JSON', 'Gérer proprement les erreurs de saisie'],
    steps: [
      {
        title: 'Structure générale et menu',
        text: 'Chaque action (ajouter, lister, terminer, supprimer) sera une fonction. Le menu principal boucle en attendant les commandes.',
        code: String.raw`import json

def afficher_menu():
    print("\n=== GESTIONNAIRE DE TÂCHES ===")
    print("1. Ajouter une tâche")
    print("2. Lister les tâches")
    print("3. Terminer une tâche")
    print("4. Supprimer une tâche")
    print("q. Quitter")

def main():
    taches = charger_taches()
    while True:
        afficher_menu()
        choix = input("Ton choix : ").strip().lower()
        if choix == "q":
            sauvegarder_taches(taches)
            print("À bientôt !")
            break
        # ... selon le choix, appelle la bonne fonction

if __name__ == "__main__":
    main()`
      },
      {
        title: 'Les fonctions de sauvegarde',
        text: 'charger_taches() lit le fichier JSON s\'il existe, et renvoie une liste vide sinon. sauvegarder_taches() écrit la liste sur disque.',
        code: String.raw`def charger_taches():
    try:
        with open("taches.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def sauvegarder_taches(taches):
    with open("taches.json", "w", encoding="utf-8") as f:
        json.dump(taches, f, ensure_ascii=False, indent=2)`
      },
      {
        title: 'Ajouter et lister',
        text: 'Une tâche sera un dictionnaire : {"titre": "...", "faite": False}. Ajouter la pousse dans la liste ; lister l\'affiche avec un état.',
        code: String.raw`def ajouter(taches):
    titre = input("Titre de la tâche : ").strip()
    if titre:
        taches.append({"titre": titre, "faite": False})
        print("Tâche ajoutée ✓")

def lister(taches):
    if not taches:
        print("Aucune tâche. Profites-en !")
        return
    for i, t in enumerate(taches, start=1):
        etat = "✓" if t["faite"] else "○"
        print(f"{i}. {etat} {t['titre']}")`
      },
      {
        title: 'Terminer et supprimer',
        text: 'On choisit une tâche par son numéro. Pense à vérifier que le numéro existe bien, et à convertir la saisie.',
        code: String.raw`def terminer(taches):
    lister(taches)
    try:
        index = int(input("Numéro de la tâche à terminer : ")) - 1
        taches[index]["faite"] = True
        print("Tâche terminée ✓")
    except (ValueError, IndexError):
        print("Numéro invalide.")

def supprimer(taches):
    lister(taches)
    try:
        index = int(input("Numéro de la tâche à supprimer : ")) - 1
        taches.pop(index)
        print("Tâche supprimée.")
    except (ValueError, IndexError):
        print("Numéro invalide.")`
      },
      {
        title: 'Assembler le tout',
        text: 'Dans la boucle main(), relie chaque choix à sa fonction, puis sauvegarde à chaque modification (ou à la sortie). Teste le programme de bout en bout.'
      }
    ],
    checklist: [
      'Le menu s\'affiche et la boucle fonctionne',
      'Ajouter une tâche fonctionne',
      'Lister affiche les tâches avec leur état (✓ ou ○)',
      'Terminer passe une tâche à l\'état « faite »',
      'Supprimer enlève la bonne tâche',
      'Un numéro invalide affiche un message, sans planter',
      'Les tâches sont retrouvées après avoir relancé le programme (JSON)',
      'Chaque action est une fonction propre'
    ],
    goingFurther: [
      'Ajoute une priorité (haute / normale / basse) à chaque tâche',
      'Affiche les tâches non terminées en premier',
      'Ajoute une date d\'échéance et alerte les tâches en retard',
      'Ajoute une commande « sauvegarder » explicite'
    ]
  }
};