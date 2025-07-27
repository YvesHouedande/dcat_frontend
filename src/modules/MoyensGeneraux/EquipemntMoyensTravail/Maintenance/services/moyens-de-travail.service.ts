import { useApi } from "@/api/api";
import { Maintenance, MoyensFilters, PaginatedResponse, MaintenanceFormData } from "../types/maitenance.types";

const BASE_PATH = "/moyens-de-travail";

const Returnapi = () => {
  const api = useApi();
  return api;
};

export const MoyensDesTravailService = {
  getAll: async (filters: MoyensFilters): Promise<PaginatedResponse<Maintenance>> => {
    // const { data } = await api.get(BASE_PATH, { params: filters });
    // return data;
      //  const { data } = await api.get(BASE_PATH, { params: filters });
        const data:Maintenance[] = [
          {
            "id_maintenance": 154767,
            "recurrence": "mensuelle",
            "type_maintenance": "preventive",
            "operations": "Vérification des niveaux Vérification des niveaux Vérification des niveaux",
            "recommandations": "Ajouter liquide de frein",
            "autre_intervenant": "Marie Lemoine",
            "id_intervenants": "23",
            "id_partenaire": "5",
            "id_section": "informatique",
            "id_exemplaire_produit": 1,
            "date": "2025-05-01"
          },
          {
            "id_maintenance": 2,
            "recurrence": "trimestrielle",
            "type_maintenance": "curative",
            "operations": "Remplacement courroie",
            "recommandations": "Faire contrôle complet",
            "id_intervenants": 12,
            "id_partenaire": "8",
            "id_section": "B3",
            "id_exemplaire_produit": "202",
            "date": "2025-04-15"
          },
          {
            "id_maintenance": 3,
            "recurrence": "annuelle",
            "type_maintenance": "préventive",
            "operations": "Nettoyage filtre à air",
            "recommandations": "À renouveler l'année prochaine",
            "autre_intervenant": "Paul Martin",
            "id_section": "C2",
            "id_exemplaire_produit": 305,
            "date": "2025-01-10"
          },
          {
            "id_maintenance": 4,
            "recurrence": "mensuelle",
            "type_maintenance": "curative",
            "operations": "Remplacement de joint",
            "recommandations": "Surveiller consommation d'huile",
            "id_intervenants": 18,
            "id_section": "D5",
            "id_exemplaire_produit": 410,
            "date": "2025-05-10"
          },
          {
            "id_maintenance": 5,
            "recurrence": "hebdomadaire",
            "type_maintenance": "préventive",
            "operations": "Graissage",
            "recommandations": "RAS",
            "id_intervenants": "30",
            "id_partenaire": "15",
            "id_section": "Z9",
            "id_exemplaire_produit": "600",
            "date": "2025-05-05"
          },
          {
            "id_maintenance": 6,
            "recurrence": "ponctuelle",
            "type_maintenance": "curative",
            "operations": "Réparation fuite",
            "recommandations": "Réviser le circuit d'eau",
            "autre_intervenant": "Technicien externe",
            "id_intervenants": 27,
            "id_partenaire": "9",
            "id_section": "E3",
            "id_exemplaire_produit": 714,
            "date": "2025-03-22"
          },
          {
            "id_maintenance": 7,
            "recurrence": "bimensuelle",
            "type_maintenance": "préventive",
            "operations": "Contrôle visuel général",
            "recommandations": "Vérifier état des pneus",
            "id_section": 10,
            "id_exemplaire_produit": "808",
            "date": "2025-04-30"
          },
          {
            "id_maintenance": 8,
            "recurrence": "semestrielle",
            "type_maintenance": "curative",
            "operations": "Changement ampoule",
            "recommandations": "Prévoir ampoules en stock",
            "autre_intervenant": "Lucas Pereira",
            "id_intervenants": "21",
            "id_section": "F4",
            "id_exemplaire_produit": 909,
            "date": "2025-02-28"
          },
          {
            "id_maintenance": 9,
            "recurrence": "mensuelle",
            "type_maintenance": "préventive",
            "operations": "Calibration capteurs",
            "recommandations": "Revoir protocole d'étalonnage",
            "id_partenaire": "33",
            "id_section": "H1",
            "id_exemplaire_produit": 1100,
            "date": "2025-05-09"
          },
          {
            "id_maintenance": 10,
            "recurrence": "annuelle",
            "type_maintenance": "curative",
            "operations": "Révision complète moteur",
            "recommandations": "Remplacer courroie distribution",
            "id_intervenants": "40",
            "id_section": "J7",
            "id_exemplaire_produit": "1205",
            "date": "2025-01-05"
          }
        ]        
         console.log(filters) 
        return {
          data,
          total: data.length,
          page: 1,
          limit: data.length,
          totalPages: 1
        }
  },

  getById: async (id: number): Promise<Maintenance> => {
  const api = Returnapi();
    const { data } = await api.get(`${BASE_PATH}/${id}`);
    return data;
  },

  create: async (maintenance: MaintenanceFormData): Promise<Maintenance> => {
  const api = Returnapi();
    const { data } = await api.post(BASE_PATH, maintenance);
    return data;
  },

  update: async (id: number, maintenance: MaintenanceFormData): Promise<Maintenance> => {
  const api = Returnapi();
    const { data } = await api.put(`${BASE_PATH}/${id}`, maintenance);
    return data;
  },

  delete: async (id: number): Promise<void> => {
  const api = Returnapi();
    await api.delete(`${BASE_PATH}/${id}`);
  },

  getSections: async (): Promise<string[]> => {
    const data:string[] = ["informatique","bureautique","electrique","plomberie","menuiserie","autre"]
    return data;
  }
};
