# import random
# import string

# def demander_longueur():
#     while True:
#         reponse = input("Quelle est la longueur du mot de passe souhaitée ? ")
#         if reponse.isdigit() and int(reponse) > 0:
#             return int(reponse)
#         print("Veuillez entrer un nombre entier positif.")

# def demander_choix_caractere(texte):
#     while True:
#         rep = input(texte + " (o/n) : ").strip().lower()
#         if rep in ("o", "n"):
#             return rep == "o"
#         print("Répondez par 'o' (oui) ou 'n' (non).")

# def generer_mot_de_passe(longueur, use_upper, use_lower, use_digits, use_special):
#     chars = ""
#     if use_upper:
#         chars += string.ascii_uppercase
#     if use_lower:
#         chars += string.ascii_lowercase
#     if use_digits:
#         chars += string.digits
#     if use_special:
#         chars += string.punctuation

#     if not chars:
#         raise ValueError("Aucun type de caractère sélectionné.")
    
#     if not chars:
#         return "Aucun type de caractère sélectionné."
    
    
#     password = []
#     if use_upper:
#         password.append(random.choice(string.ascii_uppercase))
#     if use_lower:
#         password.append(random.choice(string.ascii_lowercase))
#     if use_digits:
#         password.append(random.choice(string.digits))
#     if use_special:
#         password.append(random.choice(string.punctuation))

#     while len(password) < longueur:
#         password.append(random.choice(chars))

#     random.shuffle(password)
#     return ''.join(password[:longueur])




# def generMotdePasse():
#     longueur = demander_longueur()
#     GrandCaractere = demander_choix_caractere("Inclure des lettres majuscules ?")
#     Minuscule = demander_choix_caractere("Inclure des lettres minuscules ?")
#     Chiffre = demander_choix_caractere("Inclure des chiffres ?")
#     caracterespeciaux = demander_choix_caractere("Inclure des caractères spéciaux ?")
#     mot_de_passe = generer_mot_de_passe(longueur, GrandCaractere, Minuscule, Chiffre, caracterespeciaux)
#     print(f"\nMot de passe généré : {mot_de_passe}")


# if __name__ == "__main__":
#     generMotdePasse()


# # import random
# # import string

# # def demander_longueur():
# #     """Demander à l'utilisateur la longueur souhaitée du mot de passe."""
# #     while True:
# #         reponse = input("Entrez la longueur souhaitée du mot de passe : ")
# #         if reponse.isdigit() and int(reponse) > 0:
# #             return int(reponse)
# #         print("Veuillez entrer un nombre entier positif.")

# # def demander_choix(message):
# #     """Demander à l'utilisateur un choix oui/non."""
# #     while True:
# #         reponse = input(message + " (o/n) : ").strip().lower()
# #         if reponse in ("o", "n"):
# #             return reponse == "o"
# #         print("Répondez par 'o' (oui) ou 'n' (non).")

# # def generer_mot_de_passe(longueur, utiliser_majuscules, utiliser_minuscules, utiliser_chiffres, utiliser_speciaux):
# #     """Générer un mot de passe en fonction des critères sélectionnés."""
# #     pool_caracteres = ""
# #     if utiliser_majuscules:
# #         pool_caracteres += string.ascii_uppercase
# #     if utiliser_minuscules:
# #         pool_caracteres += string.ascii_lowercase
# #     if utiliser_chiffres:
# #         pool_caracteres += string.digits
# #     if utiliser_speciaux:
# #         pool_caracteres += string.punctuation

# #     if not pool_caracteres:
# #         raise ValueError("Au moins un type de caractère doit être sélectionné.")

# #     mot_de_passe = []

# #     # Ajouter au moins un caractère de chaque type sélectionné
# #     if utiliser_majuscules:
# #         mot_de_passe.append(random.choice(string.ascii_uppercase))
# #     if utiliser_minuscules:
# #         mot_de_passe.append(random.choice(string.ascii_lowercase))
# #     if utiliser_chiffres:
# #         mot_de_passe.append(random.choice(string.digits))
# #     if utiliser_speciaux:
# #         mot_de_passe.append(random.choice(string.punctuation))

# #     # Compléter le mot de passe
# #     mot_de_passe += random.choices(pool_caracteres, k=longueur - len(mot_de_passe))

# #     random.shuffle(mot_de_passe)
# #     return ''.join(mot_de_passe)

# # def programme_principal():
# #     print("Bienvenue dans le générateur de mot de passe !\n")
# #     longueur = demander_longueur()
# #     utiliser_majuscules = demander_choix("Inclure des lettres majuscules ?")
# #     utiliser_minuscules = demander_choix("Inclure des lettres minuscules ?")
# #     utiliser_chiffres = demander_choix("Inclure des chiffres ?")
# #     utiliser_speciaux = demander_choix("Inclure des caractères spéciaux ?")

# #     try:
# #         mot_de_passe = generer_mot_de_passe(longueur, utiliser_majuscules, utiliser_minuscules, utiliser_chiffres, utiliser_speciaux)
# #         print(f"\nMot de passe généré : {mot_de_passe}")
# #     except ValueError as erreur:
# #         print(f"Erreur : {erreur}")


# # if __name__ == "__main__":
# #     programme_principal()

import random
import string
import sys

def demander_longueur():
    """Demande la longueur souhaitée du mot de passe."""
    while True:
        try:
            reponse = input("Entrez la longueur souhaitée du mot de passe (minimum 6) : ")
            if reponse.isdigit():
                longueur = int(reponse)
                if longueur >= 6:
                    return longueur
                else:
                    print("La longueur minimale recommandée est de 6 caractères pour la sécurité.")
            else:
                print("Veuillez entrer un nombre entier valide.")
        except KeyboardInterrupt:
            print("\nOpération annulée par l'utilisateur.")
            sys.exit()

def demander_choix(message):
    """Demande à l'utilisateur de choisir oui ou non."""
    while True:
        try:
            reponse = input(message + " (o/n) : ").strip().lower()
            if reponse in ("o", "n"):
                return reponse == "o"
            else:
                print("Répondez par 'o' (oui) ou 'n' (non).")
        except KeyboardInterrupt:
            print("\nOpération annulée par l'utilisateur.")
            sys.exit()

def filtrer_caracteres_speciaux(autoriser_tout=True):
    """Permet de filtrer les caractères spéciaux si besoin."""
    if autoriser_tout:
        return string.punctuation
    else:
        # Caractères spéciaux sans caractères ambigus
        return "!@#$%^&*()-_=+"

def generer_mot_de_passe(longueur, utiliser_majuscules, utiliser_minuscules, utiliser_chiffres, utiliser_speciaux, filtrer_speciaux):
    """Génère un mot de passe sécurisé en respectant les critères sélectionnés."""
    pool_caracteres = ""

    if utiliser_majuscules:
        pool_caracteres += string.ascii_uppercase
    if utiliser_minuscules:
        pool_caracteres += string.ascii_lowercase
    if utiliser_chiffres:
        pool_caracteres += string.digits
    if utiliser_speciaux:
        pool_caracteres += filtrer_caracteres_speciaux(autoriser_tout=filtrer_speciaux)

    if not pool_caracteres:
        raise ValueError("Vous devez sélectionner au moins un type de caractère.")

    types_choisis = sum([utiliser_majuscules, utiliser_minuscules, utiliser_chiffres, utiliser_speciaux])
    if longueur < types_choisis:
        raise ValueError(f"La longueur doit être au minimum égale au nombre de types choisis ({types_choisis}).")

    mot_de_passe = []

    if utiliser_majuscules:
        mot_de_passe.append(random.choice(string.ascii_uppercase))
    if utiliser_minuscules:
        mot_de_passe.append(random.choice(string.ascii_lowercase))
    if utiliser_chiffres:
        mot_de_passe.append(random.choice(string.digits))
    if utiliser_speciaux:
        mot_de_passe.append(random.choice(filtrer_caracteres_speciaux(autoriser_tout=filtrer_speciaux)))

    mot_de_passe += random.choices(pool_caracteres, k=longueur - len(mot_de_passe))
    random.shuffle(mot_de_passe)
    return ''.join(mot_de_passe)

def programme_principal():
    print("\nBienvenue dans le générateur de mot de passe sécurisé ! 🔒\n")

    longueur = demander_longueur()
    utiliser_majuscules = demander_choix("Inclure des lettres majuscules ?")
    utiliser_minuscules = demander_choix("Inclure des lettres minuscules ?")
    utiliser_chiffres = demander_choix("Inclure des chiffres ?")
    utiliser_speciaux = demander_choix("Inclure des caractères spéciaux ?")

    if utiliser_speciaux:
        filtrer_speciaux = demander_choix("Voulez-vous autoriser TOUS les caractères spéciaux (y compris les très étranges) ?")
    else:
        filtrer_speciaux = True  # Sans impact si on n'utilise pas de spéciaux

    try:
        mot_de_passe = generer_mot_de_passe(longueur, utiliser_majuscules, utiliser_minuscules, utiliser_chiffres, utiliser_speciaux, filtrer_speciaux)
        print(f"\nMot de passe généré : {mot_de_passe}\n")
    except ValueError as erreur:
        print(f"\nErreur : {erreur}")
        sys.exit()

if __name__ == "__main__":
    programme_principal()