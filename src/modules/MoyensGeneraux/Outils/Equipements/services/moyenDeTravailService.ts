import { MoyenDeTravail, MoyenDeTravailCreateInput, MoyenDeTravailUpdateInput } from '../types/moyenDeTravail';
import { api } from '@/api/api';

export const moyenDeTravailService = {
  async getAll(): Promise<MoyenDeTravail[]> {
    // const response = await api.get("");
    // return response.data;
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
    return data;
  },

  async getById(id: number): Promise<MoyenDeTravail> {
    // const response = await api.get(`${id}`);
    
    // return response.data;
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
    const moyen = data.find(item => item.id_moyens_de_travail === id);
    if (!moyen) {
      throw new Error(`MoyenDeTravail with id ${id} not found`);
    }
    return moyen;
  },

  async create(data: MoyenDeTravailCreateInput): Promise<MoyenDeTravail> {
    const response = await api.post(`${data}`)
    return response.data;
  },

  async update(id: number, data: MoyenDeTravailUpdateInput): Promise<MoyenDeTravail> {
    const response = await api.put(`${id}`,`${data}`)
    
    return response.data;
  },

  async delete(id: number): Promise<void> {
    const response = await api.delete(`${id}`)
    return response.data
  },
};
