import { Demande, Employe, NatureDocument } from "../../types/interfaces";

export const employes: Employe[] = [
  { id_employe: 101, nom_employes: "Dubois", prenom_employes: "Thomas" },
  { id_employe: 102, nom_employes: "Dupont", prenom_employes: "Marie" },
  { id_employe: 103, nom_employes: "Martin", prenom_employes: "Sophie" },
  { id_employe: 104, nom_employes: "Bernard", prenom_employes: "Lucas" },
  { id_employe: 105, nom_employes: "Petit", prenom_employes: "Emma" },
];

// Exemple de données pour les natures de documents
export const naturesDocuments: NatureDocument[] = [
  { id_nature_document: 1, libelle_td: "Contrat" },
  { id_nature_document: 2, libelle_td: "Facture" },
  { id_nature_document: 3, libelle_td: "Certificat" },
  { id_nature_document: 4, libelle_td: "Autre" },
];

// Exemple de données pour les demandes
export const demandes: Demande[] = [
  {
    Id_demandes: 1,
    type_demande: "Congé",
    status: "Approuvé",
    date_debut: new Date("2025-05-01"),
    date_fin: new Date("2025-05-10"),
    date_absence: new Date("2025-05-01"),
    date_retour: new Date("2025-05-11"),
    motif: "Vacances annuelles",
    duree: "10",
    id_employe: 101,
    documents: [
      {
        id_document: 1,
        libele_document: "Demande_conge.pdf",
        id_nature_document: 3,
        lien_document: "/documents/demande_conge_101.pdf",
      },
    ],
  },
  {
    Id_demandes: 2,
    type_demande: "Formation",
    status: "En attente",
    date_debut: new Date("2025-05-15"),
    date_fin: new Date("2025-05-17"),
    date_absence: new Date("2025-05-15"),
    date_retour: new Date("2025-05-18"),
    motif: "Formation professionnelle en développement web avancé",
    duree: "3",
    id_employe: 102,
    documents: [
      {
        id_document: 2,
        libele_document: "Descriptif_formation.pdf",
        id_nature_document: 3,
        lien_document: "/documents/formation_102.pdf",
      },
    ],
  },
  {
    Id_demandes: 3,
    type_demande: "Matériel",
    status: "Approuvé",
    date_debut: new Date("2025-05-20"),
    date_fin: new Date("2025-05-20"),
    date_absence: new Date("2025-05-20"),
    date_retour: new Date("2025-05-21"),
    motif: "Achat d'un nouvel ordinateur portable",
    duree: "1",
    id_employe: 103,
    documents: [
      {
        id_document: 3,
        libele_document: "Devis_ordinateur.pdf",
        id_nature_document: 2,
        lien_document: "/documents/devis_103.pdf",
      },
    ],
  },
  {
    Id_demandes: 4,
    type_demande: "Télétravail",
    status: "En cours",
    date_debut: new Date("2025-05-25"),
    date_fin: new Date("2025-05-29"),
    date_absence: new Date("2025-05-25"),
    date_retour: new Date("2025-05-30"),
    motif: "Télétravail pour projet spécial",
    duree: "5",
    id_employe: 104,
    documents: [
      {
        id_document: 4,
        libele_document: "Autorisation_teletravail.pdf",
        id_nature_document: 3,
        lien_document: "/documents/teletravail_104.pdf",
      },
    ],
  },
  {
    Id_demandes: 5,
    type_demande: "Remboursement",
    status: "Refusé",
    date_debut: new Date("2025-06-01"),
    date_fin: new Date("2025-06-01"),
    date_absence: new Date("2025-06-01"),
    date_retour: new Date("2025-06-02"),
    motif: "Remboursement des frais de transport",
    duree: "1",
    id_employe: 105,
    documents: [
      {
        id_document: 5,
        libele_document: "Facture_transport.pdf",
        id_nature_document: 2,
        lien_document: "/documents/facture_105.pdf",
      },
    ],
  },
];
