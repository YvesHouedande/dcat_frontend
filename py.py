import random
import string

def ask_yes_no(prompt):
    while True:
        resp = input(prompt + " (o/n) : ").strip().lower()
        if resp in ("o", "n"):
            return resp == "o"
        print("Réponse attendue : o (oui) ou n (non)")

def generate_password(length, use_upper, use_lower, use_digits, use_special):
    chars = ""
    if use_upper:
        chars += string.ascii_uppercase
    if use_lower:
        chars += string.ascii_lowercase
    if use_digits:
        chars += string.digits
    if use_special:
        chars += string.punctuation

    if not chars:
        raise ValueError("Aucun type de caractère sélectionné.")

    # S'assurer qu'au moins un caractère de chaque type choisi est présent
    password = []
    if use_upper:
        password.append(random.choice(string.ascii_uppercase))
    if use_lower:
        password.append(random.choice(string.ascii_lowercase))
    if use_digits:
        password.append(random.choice(string.digits))
    if use_special:
        password.append(random.choice(string.punctuation))

    while len(password) < length:
        password.append(random.choice(chars))

    random.shuffle(password)
    return ''.join(password[:length])

def main():
    print("=== Générateur de mot de passe sécurisé ===")
    while True:
        try:
            length = int(input("Longueur du mot de passe souhaitée : "))
            if length < 4:
                print("La longueur doit être d'au moins 4.")
                continue
            break
        except ValueError:
            print("Veuillez entrer un nombre valide.")

    use_upper = ask_yes_no("Inclure des lettres majuscules ?")
    use_lower = ask_yes_no("Inclure des lettres minuscules ?")
    use_digits = ask_yes_no("Inclure des chiffres ?")
    use_special = ask_yes_no("Inclure des caractères spéciaux ?")

    try:
        password = generate_password(length, use_upper, use_lower, use_digits, use_special)
        print(f"\nMot de passe généré : {password}")
    except ValueError as e:
        print(e)

if __name__ == "__main__":
    main()