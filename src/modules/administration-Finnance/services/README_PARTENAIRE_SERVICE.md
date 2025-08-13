# Service Partenaire - Guide d'utilisation

## Problème résolu : ERR_INSUFFICIENT_RESOURCES

Les erreurs `ERR_INSUFFICIENT_RESOURCES` se produisent lorsque trop de requêtes sont faites simultanément pour récupérer les interlocuteurs des partenaires.

## Solutions disponibles

### 1. Version optimisée avec délais (recommandée)
```typescript
const { fetchPartners } = usePartenaireApi();

// Utilise des délais progressifs entre les requêtes
const { data } = useInfiniteQuery({
  queryKey: ["partenaires"],
  queryFn: ({ pageParam = 1 }) => fetchPartners(pageParam, 16),
});
```

### 2. Version sans interlocuteurs (pour les performances)
```typescript
const { fetchPartnersWithoutInterlocuteurs } = usePartenaireApi();

// Récupère uniquement les partenaires sans les interlocuteurs
const { data } = useInfiniteQuery({
  queryKey: ["partenaires"],
  queryFn: ({ pageParam = 1 }) => fetchPartnersWithoutInterlocuteurs(pageParam, 16),
});
```

### 3. Récupération des interlocuteurs en batch (sur demande)
```typescript
const { fetchInterlocuteursBatch } = usePartenaireApi();

// Récupère les interlocuteurs pour des partenaires spécifiques
const interlocuteursMap = await fetchInterlocuteursBatch([1, 2, 3, 4, 5]);
// Retourne: { 1: [...], 2: [...], 3: [...], 4: [...], 5: [...] }
```

## Améliorations apportées

### Délais progressifs
- Délai de base : 50ms
- Délai augmenté : 200ms (toutes les 5 requêtes)
- Évite la surcharge du serveur

### Gestion d'erreur robuste
- Continue même si une requête échoue
- Logs détaillés des erreurs
- Fallback vers tableau vide

### Compatibilité
- Toutes les fonctions maintiennent la même interface
- Pas de breaking changes
- Migration facile

## Recommandations d'utilisation

1. **Pour les listes principales** : Utilisez `fetchPartners` (version optimisée)
2. **Pour les performances critiques** : Utilisez `fetchPartnersWithoutInterlocuteurs`
3. **Pour les détails sur demande** : Utilisez `fetchInterlocuteursBatch`

## Migration

Si vous rencontrez des erreurs `ERR_INSUFFICIENT_RESOURCES`, remplacez :

```typescript
// Avant (peut causer des erreurs)
queryFn: ({ pageParam = 1 }) => fetchPartners(pageParam, 16),

// Après (version optimisée)
queryFn: ({ pageParam = 1 }) => fetchPartners(pageParam, 16), // Maintenant optimisée

// Ou pour les performances maximales
queryFn: ({ pageParam = 1 }) => fetchPartnersWithoutInterlocuteurs(pageParam, 16),
```
