# Gestion des Entités

Ce dossier contient tous les composants nécessaires pour la gestion des entités dans l'application DCAT.

## Structure des fichiers

```
entites/
├── entites.tsx              # Liste des entités avec filtres et pagination
├── ajouter_entite.tsx       # Formulaire d'ajout d'une nouvelle entité
├── editer_entite.tsx        # Formulaire de modification d'une entité
├── EntiteProfile.tsx        # Profil détaillé d'une entité
├── EntitesRoutes.tsx        # Configuration des routes pour les entités
├── menu.ts                  # Configuration du menu de navigation
├── index.ts                 # Exports des composants
└── README.md               # Documentation (ce fichier)
```

## Composants

### 1. EntitesList (`entites.tsx`)
- **Fonction** : Affiche la liste de toutes les entités
- **Fonctionnalités** :
  - Recherche par nom, abréviation, localisation
  - Filtres par statut
  - Pagination
  - Actions rapides (voir, modifier, supprimer)
  - Statistiques (total, localisations, contacts)

### 2. AddEntiteForm (`ajouter_entite.tsx`)
- **Fonction** : Formulaire pour créer une nouvelle entité
- **Champs** :
  - Dénomination (obligatoire)
  - Abréviation (optionnel)
  - Contact (optionnel)
  - Localisation (optionnel)
  - Adresse postale (optionnel)
- **Validation** : Vérification des champs obligatoires et format des données

### 3. EditEntiteForm (`editer_entite.tsx`)
- **Fonction** : Formulaire pour modifier une entité existante
- **Fonctionnalités** :
  - Chargement automatique des données existantes
  - Validation des modifications
  - Mise à jour en temps réel

### 4. EntiteProfile (`EntiteProfile.tsx`)
- **Fonction** : Affichage détaillé du profil d'une entité
- **Sections** :
  - Informations générales
  - Relations (partenaires associés)
  - Actions rapides
  - Statistiques
  - Informations système

## Service API

Les composants utilisent le service `useEntiteApi` qui fournit les méthodes suivantes :

```typescript
const {
  fetchEntites,              // Récupérer toutes les entités
  fetchEntiteById,           // Récupérer une entité par ID
  addEntite,                 // Créer une nouvelle entité
  updateEntite,              // Mettre à jour une entité
  deleteEntite,              // Supprimer une entité
  fetchEntitesByPartenaire,  // Récupérer les entités d'un partenaire
} = useEntiteApi();
```

## Interface Entite

```typescript
interface Entite {
  id_entite: number;           // Identifiant unique
  denomination: string;        // Nom complet de l'entité
  abreviation_nom: string;     // Abréviation (optionnel)
  contact: string;             // Contact (optionnel)
  adresse_postal: string;      // Adresse postale (optionnel)
  localisation: string;        // Localisation (optionnel)
  id_partenaire: number;       // ID du partenaire associé (optionnel)
}
```

## Routes

Les routes sont configurées dans `EntitesRoutes.tsx` :

- `/gestion-administrative/entites` - Liste des entités
- `/gestion-administrative/entites/ajouter` - Ajouter une entité
- `/gestion-administrative/entites/:id` - Profil d'une entité
- `/gestion-administrative/entites/:id/editer` - Modifier une entité

## Utilisation

### Intégration dans l'application

1. **Importer les routes** :
```typescript
import EntitesRoutes from './entites/EntitesRoutes';
```

2. **Ajouter au menu** :
```typescript
import { entitesMenu } from './entites/menu';
```

3. **Utiliser les composants** :
```typescript
import { EntitesList, AddEntiteForm } from './entites';
```

### Exemple d'utilisation

```typescript
// Dans un composant parent
import { useEntiteApi } from '@/modules/administration-Finnance/services/entiteService';

const MyComponent = () => {
  const { fetchEntites, addEntite } = useEntiteApi();
  
  // Utiliser les méthodes du service
  const handleAddEntite = async (data) => {
    try {
      const newEntite = await addEntite(data);
      console.log('Entité créée:', newEntite);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  return (
    // Votre JSX
  );
};
```

## Fonctionnalités avancées

### Filtres et recherche
- Recherche textuelle dans la dénomination, abréviation et localisation
- Filtres par statut (à implémenter selon les besoins)
- Tri par colonnes

### Pagination
- Affichage par pages de 10 entités
- Navigation entre les pages
- Indicateur de progression

### Gestion des erreurs
- Messages d'erreur contextuels
- Validation des formulaires
- Gestion des états de chargement

### Responsive Design
- Interface adaptée aux mobiles
- Grilles flexibles
- Composants UI cohérents

## Dépendances

- **React Query** : Gestion du cache et des requêtes API
- **React Router** : Navigation entre les pages
- **Lucide React** : Icônes
- **Sonner** : Notifications toast
- **Tailwind CSS** : Styles

## Maintenance

### Ajout de nouvelles fonctionnalités
1. Créer le composant dans le dossier approprié
2. Ajouter la route dans `EntitesRoutes.tsx`
3. Mettre à jour le menu si nécessaire
4. Tester la fonctionnalité

### Modification d'une entité existante
1. Identifier le composant à modifier
2. Mettre à jour la logique métier
3. Tester les changements
4. Mettre à jour la documentation si nécessaire 