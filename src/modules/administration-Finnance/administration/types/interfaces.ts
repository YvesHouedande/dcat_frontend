
  export interface Employe {// Table employes - version harmonisée avec le SQL
    id_employe: number;
    nom_employes: string;
    prenom_employes: string;
    email_employes?: string;
    contact_employes?: string;
    adresse_employes?: string;
    status?: "actif" | "absent" | "depart"; 
    date_embauche_employes?: string;
    password_employes?: string;
    date_de_naissance?: string;
    contrats?: string;
    id_fonction: number; // Clé étrangère vers la table fonction
  }

  export interface Fonction {// Table Fonction
    id_fonction: number;  
    nom_fonction: string;
  }


  export interface Interlocuteur {
    id_interlocuteur: number;
    nom_interlocuteur: string;
    prenom_interlocuteur: string;
    fonction_interlocuteur: string;
    contact_interlocuteur: string;
    mail_interlocuteur: string;
    id_partenaire?: number;
  }
  export interface Partenaires {
    id_partenaire: number;
    nom_partenaire: string;
    telephone_partenaire: string;
    email_partenaire: string;
    specialite: string;
    localisation: string;
    type_partenaire: string;
    id_entite: number; // Clé étrangère vers la table Entite
    interlocuteurs: Interlocuteur[]; // Liste des interlocuteurs associés
  }


  export interface Document {
   
    [x: string]: string | number | readonly string[] | undefined;// Table Document - harmonisée avec le SQL
    id_document: number;
    libele_document: string;
    classification_document?: string;
    date_document?: string;
    lien_document: string;
    etat_document?: string;
    id_livrable?: number;// Clé étrangère
    id_projet?: number;// Clé étrangère
    id_demandes?: number;// Clé étrangère
    id_contrat?: number;// Clé étrangère
    id_employes?: number;// Clé étrangère
    id_intervention?: number;// Clé étrangère
    id_nature_document?: number;// Clé étrangère
  }
  
  export interface Entite {// Table Entité
    id_entite: number;              // Renommé de Id_Entité pour cohérence
    denomination: string;
  }
  
   export interface NatureDocument {//Table nature_document  
    id_nature_document: number;
    libelle_td: string;
  }
  
//les demandes 
  export type Demande = {
    Id_demandes: number;
    type_demande: string;
    status: string;
    date_debut: Date;
    date_fin: Date;
    date_absence: Date;
    date_retour: Date;
    motif: string;
    duree: string;
    id_employe: number;
    documents: Document[];
  };

  //les contrats
  export interface Contrat {
    id_contrat: number; // Changed to number
    nom_contrat: string;
    duree_Contrat: string;
    date_debut: string;
    date_fin: string;
    Reference?: string;
    type_de_contrat: string;
    status: string;
    id_partenaire?: number;
  }