import { api } from "@/api/api";
import { MoyenDeTravail, MoyensFilters, PaginatedResponse, MoyenDeTravailFormData } from "../types/moyens-de-travail.types";

const BASE_PATH = "/moyens-de-travail";

export const MoyensDesTravailService = {
  getAll: async (filters: MoyensFilters): Promise<PaginatedResponse<MoyenDeTravail>> => {
    // const { data } = await api.get(BASE_PATH, { params: filters });
    // return data;
        console.log(filters)
        const data:MoyenDeTravail[] = [
          {
            "id_moyens_de_travail": 1,
            "denomination": "Ordinateur portable",
            "date_acquisition": "2023-08-15",
            "section": "Informatique",
            "created_at": "2023-08-15T10:30:00Z",
            "updated_at": "2023-08-15T10:30:00Z"
          },
          {
            "id_moyens_de_travail": 2,
            "denomination": "Imprimante laser",
            "date_acquisition": "2022-05-10",
            "section": "Bureau",
            "created_at": "2022-05-10T09:00:00Z",
            "updated_at": "2022-05-10T09:00:00Z"
          },
          {
            "id_moyens_de_travail": 3,
            "denomination": "Camionnette de service",
            "date_acquisition": "2021-11-01",
            "section": "Logistique",
            "created_at": "2021-11-01T08:45:00Z",
            "updated_at": "2021-11-01T08:45:00Z"
          },
          {
            "id_moyens_de_travail": 4,
            "denomination": "Projecteur",
            "date_acquisition": "2020-02-20",
            "section": "Formation",
            "created_at": "2020-02-20T14:00:00Z",
            "updated_at": "2020-02-20T14:00:00Z"
          },
          {
            "id_moyens_de_travail": 5,
            "denomination": "Scanner à plat",
            "date_acquisition": "2022-07-12",
            "section": "Bureau",
            "created_at": "2022-07-12T11:20:00Z",
            "updated_at": "2022-07-12T11:20:00Z"
          },
          {
            "id_moyens_de_travail": 6,
            "denomination": "Tablette graphique",
            "date_acquisition": "2023-01-05",
            "section": "Design",
            "created_at": "2023-01-05T13:15:00Z",
            "updated_at": "2023-01-05T13:15:00Z"
          },
          {
            "id_moyens_de_travail": 7,
            "denomination": "Appareil photo numérique",
            "date_acquisition": "2019-09-23",
            "section": "Communication",
            "created_at": "2019-09-23T10:00:00Z",
            "updated_at": "2019-09-23T10:00:00Z"
          },
          {
            "id_moyens_de_travail": 8,
            "denomination": "Serveur NAS",
            "date_acquisition": "2022-11-30",
            "section": "Informatique",
            "created_at": "2022-11-30T16:45:00Z",
            "updated_at": "2022-11-30T16:45:00Z"
          },
          {
            "id_moyens_de_travail": 9,
            "denomination": "Fauteuil ergonomique",
            "date_acquisition": "2021-04-18",
            "section": "Ressources humaines",
            "created_at": "2021-04-18T09:30:00Z",
            "updated_at": "2021-04-18T09:30:00Z"
          },
          {
            "id_moyens_de_travail": 10,
            "denomination": "Routeur professionnel",
            "date_acquisition": "2023-06-01",
            "section": "Réseaux",
            "created_at": "2023-06-01T08:00:00Z",
            "updated_at": "2023-06-01T08:00:00Z"
          }
        ]

        return {
          data,
          total: data.length,
          page: 1,
          limit: data.length,
          totalPages: 1
        }
  },

  getById: async (id: number): Promise<MoyenDeTravail> => {
    const { data } = await api.get(`${BASE_PATH}/${id}`);
    return data;
  },

  create: async (moyenDeTravail: MoyenDeTravailFormData): Promise<MoyenDeTravail> => {
    const { data } = await api.post(BASE_PATH, moyenDeTravail);
    return data;
  },

  update: async (id: number, moyenDeTravail: MoyenDeTravailFormData): Promise<MoyenDeTravail> => {
    const { data } = await api.put(`${BASE_PATH}/${id}`, moyenDeTravail);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  getSections: async (): Promise<string[]> => {
    const data:string[] = ["informatique","bureautique","electrique","plomberie","menuiserie","autre"]
    return data;
  }
};
