/* ============ Niveau 1 — Débutant : Les fondations ============ */
const NIVEAU1 = {
  id: 'debutant',
  emoji: '🌱',
  title: 'Niveau 1 — Débutant',
  subtitle: 'Les fondations',
  color: '#4ade80',
  intro: `Bienvenue dans PythonQuest ! Dans ce premier niveau, tu vas poser les fondations du langage Python : afficher du texte, manipuler des variables, prendre des décisions, répéter des actions et structurer tes données. À la fin, tu réaliseras ton premier vrai projet : une calculatrice interactive en ligne de commande.`,
  skills: ['Syntaxe de base', 'Variables & types', 'Conditions', 'Boucles', 'Listes & dictionnaires'],
  lessons: [
    {
      id: 'l1',
      emoji: '👋',
      title: 'Premiers pas avec Python',
      duration: '15 min',
      objectives: [
        'Écrire et exécuter ton premier programme Python',
        'Afficher du texte avec print()',
        'Comprendre les commentaires et les erreurs'
      ],
      sections: [
        {
          heading: 'Ton tout premier programme',
          paragraphs: [
            'Python est un langage de programmation lisible, puissant et très utilisé : web, intelligence artificielle, données, automatisation… Pour afficher du texte à l\'écran, on utilise la fonction print().',
            'Ouvre le Playground (en haut à droite) et tape ceci, puis clique sur « ▶️ Exécuter » :'
          ],
          code: String.raw`print("Bonjour le monde !")`,
          note: 'Le programme s\'exécute de haut en bas, ligne par ligne.'
        },
        {
          heading: 'Afficher plusieurs valeurs',
          paragraphs: [
            'print() peut recevoir plusieurs valeurs séparées par des virgules. Elles sont affichées les unes à la suite des autres, séparées par un espace.'
          ],
          code: String.raw`print("Python", "est", "génial")
print("Le résultat de 2 + 3 est", 2 + 3)`,
          note: 'On peut mélanger du texte (entre guillemets) et des nombres dans un même print().'
        },
        {
          heading: 'Les commentaires',
          paragraphs: [
            'Un commentaire est du texte ignoré par Python. Il sert à expliquer ton code, à toi et aux autres. On le commence avec le caractère #.'
          ],
          code: String.raw`# Ceci est un commentaire : Python ne l'exécute pas
print("Ceci, par contre, est exécuté")  # on peut commenter en fin de ligne`
        },
        {
          heading: 'Les erreurs sont tes amies',
          paragraphs: [
            'Quand Python rencontre un problème, il affiche une « trace » (traceback) qui indique le fichier, la ligne et la nature de l\'erreur. Ne panique pas : lire une erreur fait partie du métier de programmeur !',
            'Exécute ce code volontairement cassé pour voir ce qui se passe :'
          ],
          code: String.raw`print("Je commence")
print(ma_variable_inexistante)`,
          note: 'Erreur NameError : Python ne connaît pas ma_variable_inexistante. Le message te dit exactement où chercher.'
        }
      ],
      tip: 'Règle d\'or : programme un peu chaque jour. 20 minutes par jour valent mieux que 3 heures le week-end.',
      exercise: {
        title: 'Exercice : ton premier affichage',
        instructions: 'Écris un programme qui affiche exactement le texte : Bienvenue dans PythonQuest !',
        starter: '# Écris ton code ici',
        expected: 'Bienvenue dans PythonQuest !',
        solution: 'print("Bienvenue dans PythonQuest !")'
      }
    },
    {
      id: 'l2',
      emoji: '📦',
      title: 'Variables & types de données',
      duration: '20 min',
      objectives: [
        'Créer des variables pour stocker des valeurs',
        'Connaître les types de base : int, float, str, bool',
        'Utiliser input() pour demander une saisie'
      ],
      sections: [
        {
          heading: 'Stocker une valeur',
          paragraphs: [
            'Une variable est une boîte nommée qui contient une valeur. On la crée avec le signe = (affectation). Le nom doit être explicite : nom, age, prix_total…'
          ],
          code: String.raw`prenom = "Léa"
age = 25
print(prenom)
print(age)`,
          note: 'Pas besoin de déclarer le type : Python le devine tout seul.'
        },
        {
          heading: 'Les types fondamentaux',
          paragraphs: [
            'Chaque valeur a un type. Voici les quatre types de base :'
          ],
          list: [
            'int — un nombre entier : 42, -7, 0',
            'float — un nombre à virgule : 3.14, -0.5 (on utilise le point, pas la virgule !)',
            'str — une chaîne de caractères : "Bonjour", \'Python\' (guillemets simples ou doubles)',
            'bool — un booléen : True ou False'
          ],
          code: String.raw`prix = 12.99          # float
quantite = 3          # int
nom = "Clavier"       # str
en_stock = True       # bool

print(type(prix), type(quantite), type(nom), type(en_stock))`,
          note: 'type() renvoie le type d\'une valeur — très pratique pour débugger.'
        },
        {
          heading: 'Demander une saisie avec input()',
          paragraphs: [
            'input() affiche un message et attend que l\'utilisateur tape quelque chose. Attention : input() renvoie toujours une chaîne de caractères (str).'
          ],
          code: String.raw`prenom = input("Comment t'appelles-tu ? ")
print("Salut", prenom, "!")`,
          note: 'Pour obtenir un nombre, il faut convertir : int(texte) ou float(texte).'
        }
      ],
      tip: 'Choisis des noms de variables explicites : age_utilisateur plutôt que a. Ton futur toi te remerciera.',
      exercise: {
        title: 'Exercice : afficher avec des variables',
        instructions: 'Complète le programme pour qu\'il affiche exactement : Léa a 25 ans (en utilisant les variables nom et age).',
        starter: String.raw`nom = "Léa"
age = 25
# Affiche "Léa a 25 ans" en utilisant les variables`,
        expected: 'Léa a 25 ans',
        solution: 'print(nom, "a", age, "ans")'
      }
    },
    {
      id: 'l3',
      emoji: '🧮',
      title: 'Opérateurs & f-strings',
      duration: '20 min',
      objectives: [
        'Calculer avec les opérateurs arithmétiques',
        'Construire des messages avec les f-strings',
        'Éviter les pièges de la division et des types'
      ],
      sections: [
        {
          heading: 'Les opérateurs arithmétiques',
          paragraphs: [
            'Python connaît les opérations classiques, et quelques autres :'
          ],
          list: [
            '+ addition, - soustraction, * multiplication',
            '/ division (renvoie toujours un float)',
            '// division entière (tronque la partie décimale)',
            '% modulo (le reste de la division)',
            '** puissance'
          ],
          code: String.raw`print(10 / 3)    # 3.3333333333333335
print(10 // 3)   # 3
print(10 % 3)    # 1  (car 10 = 3*3 + 1)
print(2 ** 10)   # 1024`,
          note: 'Le modulo % est très utile : n % 2 == 0 permet de savoir si n est pair.'
        },
        {
          heading: 'Les f-strings : du texte sur mesure',
          paragraphs: [
            'Une f-string (chaîne formatée) permet d\'insérer des valeurs directement dans du texte avec des accolades {}. Il suffit de préfixer la chaîne par f.'
          ],
          code: String.raw`nom = "Karim"
score = 92
print(f"{nom} a obtenu {score} points")
print(f"Score : {score} / 100 — soit {score / 100 * 100:.0f} %")`,
          note: 'On peut même formater les nombres : {valeur:.2f} affiche 2 décimales.'
        },
        {
          heading: 'Piège : mélanger les types',
          paragraphs: [
            '« 2 » + « 3 » donne « 23 » (concaténation de chaînes), pas 5 ! Si une valeur vient de input(), pense à la convertir.'
          ],
          code: String.raw`a = "5"
b = "3"
print(a + b)        # "53" : concaténation
print(int(a) + int(b))  # 8 : conversion puis addition`
        }
      ],
      tip: 'Les f-strings sont la manière moderne et préférée de formater du texte en Python. Utilise-les plutôt que + avec des str.',
      exercise: {
        title: 'Exercice : message formaté',
        instructions: 'Complète le programme pour afficher exactement : Karim a obtenu 92 points en utilisant une f-string.',
        starter: String.raw`nom = "Karim"
score = 92
# Utilise une f-string`,
        expected: 'Karim a obtenu 92 points',
        solution: 'print(f"{nom} a obtenu {score} points")'
      }
    },
    {
      id: 'l4',
      emoji: '🔀',
      title: 'Prendre des décisions : if / elif / else',
      duration: '20 min',
      objectives: [
        'Écrire des conditions avec if, elif et else',
        'Utiliser les opérateurs de comparaison et logiques',
        'Bien gérer l\'indentation'
      ],
      sections: [
        {
          heading: 'La structure if / else',
          paragraphs: [
            'Pour que ton programme réagisse selon une condition, on utilise if. En Python, l\'indentation (les espaces en début de ligne) est obligatoire : elle délimite les blocs.'
          ],
          code: String.raw`age = 17

if age >= 18:
    print("Tu es majeur")
else:
    print("Tu es mineur")`,
          note: 'Les deux points « : » terminent la ligne de la condition, et le bloc est indenté de 4 espaces.'
        },
        {
          heading: 'elif : plusieurs cas',
          paragraphs: [
            'Pour enchaîner plusieurs conditions, on utilise elif (contraction de « else if »). Seul le premier bloc dont la condition est vraie s\'exécute.'
          ],
          code: String.raw`note = 15

if note >= 16:
    print("Excellent")
elif note >= 12:
    print("Bien")
elif note >= 10:
    print("Passable")
else:
    print("Insuffisant")`
        },
        {
          heading: 'Comparaisons & opérateurs logiques',
          paragraphs: [
            'Les comparaisons classiques : == (égal), != (différent), <, >, <=, >=. Pour combiner des conditions : and, or, not.'
          ],
          code: String.raw`age = 25
argent = 30

if age >= 18 and argent >= 20:
    print("Tu peux entrer et t'acheter un soda")
elif age >= 18:
    print("Tu peux entrer, mais pas de soda")
else:
    print("Accès refusé")`
        }
      ],
      tip: 'Pour tester l\'égalité, c\'est == (deux signes). Un seul = affecte une valeur : c\'est l\'erreur la plus fréquente des débutants.',
      exercise: {
        title: 'Exercice : pair ou impair',
        instructions: 'Complète le programme pour qu\'il affiche « Pair » ou « Impair » selon le nombre (8 est pair).',
        starter: String.raw`nombre = 8

# Affiche "Pair" ou "Impair"
if nombre % 2 == 0:
    print("Pair")
else:
    print("Impair")`,
        expected: 'Pair',
        solution: String.raw`nombre = 8

if nombre % 2 == 0:
    print("Pair")
else:
    print("Impair")`
      }
    },
    {
      id: 'l5',
      emoji: '🔁',
      title: 'Répéter avec les boucles',
      duration: '25 min',
      objectives: [
        'Répéter des actions avec for et while',
        'Utiliser range() et break / continue',
        'Éviter les boucles infinies'
      ],
      sections: [
        {
          heading: 'La boucle for',
          paragraphs: [
            'for parcourt une séquence de valeurs. range(n) génère les nombres de 0 à n-1 ; range(a, b) de a à b-1.'
          ],
          code: String.raw`for i in range(1, 6):
    print(i)

# Affiche : 1 2 3 4 5 (un par ligne)`
        },
        {
          heading: 'La boucle while',
          paragraphs: [
            'while répète un bloc tant que sa condition est vraie. Attention à toujours modifier la variable de la condition, sinon la boucle ne s\'arrête jamais !'
          ],
          code: String.raw`compteur = 1
while compteur <= 5:
    print("Tour numéro", compteur)
    compteur = compteur + 1`,
          warn: 'Boucle infinie : oublier « compteur = compteur + 1 » → le programme tourne sans fin. Pour interrompre dans le Playground, recharge la page.'
        },
        {
          heading: 'break et continue',
          paragraphs: [
            'break arrête immédiatement la boucle. continue passe directement au tour suivant, sans exécuter la fin du bloc.'
          ],
          code: String.raw`for i in range(1, 11):
    if i == 3:
        continue   # saute le 3
    if i == 8:
        break      # s'arrête avant 8
    print(i)

# Affiche : 1 2 4 5 6 7`
        }
      ],
      tip: 'Boucle infinie ? Pense à la « variable compteur » : elle doit être créée avant la boucle et modifiée dans la boucle.',
      exercise: {
        title: 'Exercice : la somme des notes',
        instructions: 'Complète le programme pour afficher la somme des notes : 12 + 15 + 9 + 18 = 54.',
        starter: String.raw`notes = [12, 15, 9, 18]
total = 0

# Parcours la liste et additionne les notes
for note in notes:
    total = total + note

print(total)`,
        expected: '54',
        solution: String.raw`notes = [12, 15, 9, 18]
total = 0
for note in notes:
    total = total + note
print(total)`
      }
    },
    {
      id: 'l6',
      emoji: '📚',
      title: 'Listes & tuples',
      duration: '25 min',
      objectives: [
        'Créer et manipuler des listes',
        'Accéder aux éléments et les modifier',
        'Comprendre la différence avec les tuples'
      ],
      sections: [
        {
          heading: 'Créer une liste',
          paragraphs: [
            'Une liste est une collection ordonnée et modifiable, entre crochets []. Les éléments sont indexés à partir de 0.'
          ],
          code: String.raw`fruits = ["pomme", "banane", "kiwi"]
print(fruits[0])     # pomme  (l'index commence à 0 !)
print(fruits[-1])    # kiwi   (index négatif = depuis la fin)
fruits[1] = "mangue"
print(fruits)        # ['pomme', 'mangue', 'kiwi']`
        },
        {
          heading: 'Les méthodes utiles',
          paragraphs: [
            'Les listes ont des méthodes pour les faire évoluer : append() ajoute à la fin, remove() enlève un élément, len() donne la taille, sort() trie…'
          ],
          code: String.raw`taches = ["coder", "tester"]
taches.append("déployer")        # ajoute à la fin
print(len(taches))               # 3
print("tester" in taches)        # True : vérifie la présence

notes = [12, 15, 9]
notes.sort()
print(notes)                     # [9, 12, 15]`
        },
        {
          heading: 'Parcourir et découper',
          paragraphs: [
            'On parcourt une liste avec for. Le découpage (slicing) liste[a:b] extrait les éléments de l\'index a inclus à b exclu.'
          ],
          code: String.raw`fruits = ["pomme", "banane", "kiwi", "mangue"]

for fruit in fruits:
    print(fruit.upper())

print(fruits[1:3])   # ['banane', 'kiwi']`
        },
        {
          heading: 'Les tuples : des listes immuables',
          paragraphs: [
            'Un tuple est une liste qu\'on ne peut pas modifier, entre parenthèses (). Il sert à regrouper des valeurs qui vont ensemble (coordonnées, dates…).'
          ],
          code: String.raw`position = (45.76, 4.83)   # latitude, longitude
print(position[0])              # 45.76
# position[0] = 1  →  Erreur ! Un tuple ne se modifie pas

x, y = position                # déballage (unpacking)
print(x, y)`
        }
      ],
      tip: 'L\'index commence à 0 : fruits[1] est le DEUXIÈME élément. C\'est l\'erreur classique — entraîne-toi à compter à partir de 0 !',
      exercise: {
        title: 'Exercice : la liste à l\'envers',
        instructions: 'Complète le programme pour qu\'il affiche les fruits dans l\'ordre inverse, un par ligne.',
        starter: String.raw`fruits = ["pomme", "banane", "kiwi"]

# Affiche chaque fruit, du dernier au premier
for fruit in reversed(fruits):
    print(fruit)`,
        expected: 'kiwi\nbanane\npomme',
        solution: String.raw`fruits = ["pomme", "banane", "kiwi"]
for fruit in reversed(fruits):
    print(fruit)`
      }
    },
    {
      id: 'l7',
      emoji: '🗂️',
      title: 'Dictionnaires & ensembles',
      duration: '25 min',
      objectives: [
        'Stocker des données clé → valeur avec les dictionnaires',
        'Ajouter, modifier et parcourir un dictionnaire',
        'Utiliser les ensembles pour éliminer les doublons'
      ],
      sections: [
        {
          heading: 'Le dictionnaire : clé → valeur',
          paragraphs: [
            'Un dictionnaire associe une clé à une valeur, entre accolades {}. On accède à une valeur par sa clé, ce qui est très lisible et rapide.'
          ],
          code: String.raw`etudiant = {
    "nom": "Sofia",
    "age": 21,
    "ville": "Lyon"
}

print(etudiant["nom"])      # Sofia
etudiant["age"] = 22        # modification
etudiant["note"] = 16       # ajout d'une nouvelle clé
print(etudiant)`
        },
        {
          heading: 'Parcourir un dictionnaire',
          paragraphs: [
            'On peut itérer sur les clés, les valeurs, ou les deux à la fois.'
          ],
          code: String.raw`etudiant = {"nom": "Sofia", "age": 21, "ville": "Lyon"}

for cle, valeur in etudiant.items():
    print(f"{cle} : {valeur}")

# Affiche :
# nom : Sofia
# age : 21
# ville : Lyon`
        },
        {
          heading: 'Vérifier et récupérer sans erreur',
          paragraphs: [
            'Accéder à une clé inexistante provoque une erreur KeyError. On peut s\'en protéger avec in ou get().'
          ],
          code: String.raw`etudiant = {"nom": "Sofia"}

print("age" in etudiant)            # False
print(etudiant.get("age", 0))       # 0 : valeur par défaut
print(etudiant.get("nom", "?"))     # Sofia`
        },
        {
          heading: 'Les ensembles (set)',
          paragraphs: [
            'Un ensemble (set) est une collection sans doublon, entre accolades. Très pratique pour éliminer les répétitions ou tester l\'appartenance rapidement.'
          ],
          code: String.raw`langues = {"python", "javascript", "python", "ruby"}
print(langues)   # {'python', 'ruby', 'javascript'} — pas de doublon

a = {1, 2, 3}
b = {2, 3, 4}
print(a | b)   # union : {1, 2, 3, 4}
print(a & b)   # intersection : {2, 3}`,
          note: 'Attention : {} crée un dictionnaire vide, pas un set. Pour un set vide : set().'
        }
      ],
      tip: 'Les dictionnaires sont partout en Python : configuration, JSON, API… Si tu hésites entre liste et dictionnaire, demande-toi : « dois-je retrouver des valeurs par un nom ? » → dictionnaire.',
      exercise: {
        title: 'Exercice : présentation',
        instructions: 'Complète le programme pour afficher exactement : Sofia habite à Lyon en utilisant le dictionnaire.',
        starter: String.raw`etudiant = {"nom": "Sofia", "age": 21, "ville": "Lyon"}

# Affiche "Sofia habite à Lyon"`,
        expected: 'Sofia habite à Lyon',
        solution: 'print(f"{etudiant[\'nom\']} habite à {etudiant[\'ville\']}")'
      }
    }
  ],
  quiz: {
    title: 'Quiz du Niveau 1',
    questions: [
      {
        q: 'Qu\'affiche ce code ?  print(10 // 3)',
        options: ['3.3333333333333335', '3', '4', 'Une erreur'],
        correct: 1,
        explain: '// est la division entière : la partie décimale est tronquée. 10 // 3 donne 3.'
      },
      {
        q: 'Quel est l\'index du premier élément d\'une liste ?',
        options: ['1', '0', '-1', 'Ça dépend de la liste'],
        correct: 1,
        explain: 'En Python (comme dans la plupart des langages), l\'indexation commence à 0.'
      },
      {
        q: 'Que renvoie input("Ton âge ? ") ?',
        options: ['Un entier (int)', 'Un nombre à virgule (float)', 'Une chaîne de caractères (str)', 'Un booléen'],
        correct: 2,
        explain: 'input() renvoie toujours une str. Il faut int(texte) ou float(texte) pour convertir.'
      },
      {
        q: 'Quel symbole commence un commentaire en Python ?',
        options: ['//', '<!--', '#', '/*'],
        correct: 2,
        explain: 'Le # marque le début d\'un commentaire jusqu\'à la fin de la ligne.'
      },
      {
        q: 'Que vaut 7 % 3 ?',
        options: ['2.33', '2', '1', '0'],
        correct: 2,
        explain: 'Le modulo donne le reste de la division : 7 = 2*3 + 1, donc 7 % 3 vaut 1.'
      },
      {
        q: 'Comment savoir si le nombre n est pair ?',
        options: ['n / 2 == 0', 'n % 2 == 0', 'n // 2 == 1', 'n * 2 == 0'],
        correct: 1,
        explain: 'Si le reste de la division par 2 est nul, le nombre est pair.'
      },
      {
        q: 'Que fait break dans une boucle ?',
        options: ['Il saute au tour suivant', 'Il arrête la boucle immédiatement', 'Il recommence la boucle', 'Il affiche une erreur'],
        correct: 1,
        explain: 'break sort de la boucle. continue, lui, passe au tour suivant.'
      },
      {
        q: 'Quel type utilise-t-on pour une collection ordonnée et modifiable ?',
        options: ['Un tuple ()', 'Un set {}', 'Une liste []', 'Un dictionnaire {clé: valeur}'],
        correct: 2,
        explain: 'La liste est ordonnée et modifiable. Le tuple est ordonné mais immuable.'
      }
    ]
  },
  project: {
    id: 'p1',
    emoji: '🧮',
    title: 'Projet 1 : Calculatrice interactive',
    summary: 'Un vrai programme en ligne de commande : une calculatrice avec menu, boucle et gestion des erreurs. Tu l\'utiliseras vraiment, et il rassemble tout ce que tu as appris dans ce niveau.',
    goals: ['Utiliser input() et la conversion de types', 'Écrire des conditions if / elif', 'Faire tourner un programme en continu avec while', 'Éviter les plantages avec try / except'],
    steps: [
      {
        title: 'Affiche le menu de la calculatrice',
        text: 'Commence par afficher les opérations disponibles, puis demande le choix de l\'utilisateur.',
        code: String.raw`print("=== CALCULATRICE ===")
print("1. Addition")
print("2. Soustraction")
print("3. Multiplication")
print("4. Division")
choix = input("Ton choix (1-4) ou 'q' pour quitter : ")`
      },
      {
        title: 'Demande les deux nombres',
        text: 'input() renvoie du texte : convertis-le en float pour pouvoir calculer.',
        code: String.raw`a = float(input("Premier nombre : "))
b = float(input("Deuxième nombre : "))`
      },
      {
        title: 'Effectue l\'opération choisie',
        text: 'Avec if / elif, exécute l\'opération correspondant au choix. Le résultat s\'affiche avec une f-string.',
        code: String.raw`if choix == "1":
    print(f"Résultat : {a + b}")
elif choix == "2":
    print(f"Résultat : {a - b}")
elif choix == "3":
    print(f"Résultat : {a * b}")
elif choix == "4":
    print(f"Résultat : {a / b}")`
      },
      {
        title: 'Boucle le tout et gère la sortie',
        text: 'Enveloppe tout le programme dans while True, et quitte avec break si l\'utilisateur tape « q ». Ajoute aussi un else pour les choix invalides.'
      },
      {
        title: 'Sécurise la division par zéro',
        text: 'Diviser par zéro fait planter le programme. Protège-toi avec try / except (on verra les détails au niveau 2 !).',
        code: String.raw`elif choix == "4":
    try:
        print(f"Résultat : {a / b}")
    except ZeroDivisionError:
        print("Impossible de diviser par zéro !")`
      }
    ],
    checklist: [
      'Le menu s\'affiche et la boucle fonctionne',
      'Taper « q » quitte proprement le programme',
      'Les 4 opérations donnent le bon résultat',
      'Un choix invalide affiche un message, sans planter',
      'Diviser par zéro affiche un message d\'erreur au lieu de planter',
      'Le code est commenté et les noms de variables sont clairs'
    ],
    goingFurther: [
      'Ajoute une opération « puissance » (a ** b)',
      'Gère le cas où l\'utilisateur tape du texte au lieu d\'un nombre',
      'Propose de recommencer un calcul sans relancer le programme',
      'Ajoute un historique des 5 derniers résultats'
    ]
  }
};