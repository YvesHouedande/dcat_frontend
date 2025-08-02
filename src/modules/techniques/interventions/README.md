# Module Interventions - Logique de Supervision

## Vue d'ensemble

Ce module gère les interventions techniques avec un système d'assignation d'employés et de supervision.

## Logique de Supervision (CORRIGÉE)

### Concept clé
- Le **superviseur est un employé** comme les autres
- Il est **assigné via le champ `superviseur`** de l'intervention (pas via la relation employé-intervention)
- Les **employés** sont assignés via la relation employé-intervention
- **Contrainte métier** : un seul superviseur par intervention

### Structure de données

```typescript
interface Intervention {
  id_intervention: number;
  // ... autres champs
  superviseur: number; // ID du superviseur (employé) - champ direct
  employes?: Employe[]; // Relation employés-intervention (via table de liaison)
}
```

### Différence entre superviseur et employés

**Le superviseur :**
- C'est un **champ direct** dans l'objet `Intervention` (`superviseur: number`)
- Représente l'ID de l'employé qui supervise l'intervention
- **Un seul superviseur** par intervention
- **Assigné via** `assignSuperviseurToIntervention()` qui met à jour le champ `superviseur`

**Les employés :**
- C'est une **relation** via une table de liaison employé-intervention
- **Plusieurs employés** peuvent être assignés à une intervention
- **Assignés via** `assignEmployeeToIntervention()` qui crée une relation

### API Functions

```typescript
// Pour assigner un superviseur (met à jour le champ superviseur)
assignSuperviseurToIntervention(interventionId: number, superviseurId: number)

// Pour assigner un employé (crée une relation employé-intervention)
assignEmployeeToIntervention(interventionId: number, employeeId: number)

// Pour retirer un superviseur (met à jour le champ superviseur à undefined)
updateIntervention(interventionId, { superviseur: undefined })

// Pour retirer un employé (supprime la relation employé-intervention)
removeEmployeeFromIntervention(interventionId: number, employeeId: number)
```

### Hooks TanStack Query

```typescript
// Hook pour assigner un superviseur
useAssignSuperviseurToIntervention()

// Hook pour assigner un employé
useAssignEmployeeToIntervention()

// Hook utilitaire pour assigner les employés ET le superviseur après création
useAssignEmployeesToIntervention()
```

### Workflow de création d'intervention

1. **Créer l'intervention** avec `createIntervention()` (sans le superviseur)
2. **Extraire l'ID** de la réponse avec `extractInterventionId()`
3. **Assigner les employés** avec `useAssignEmployeesToIntervention()` (sans superviseur)
4. **Assigner le superviseur** avec `assignSuperviseurToIntervention()` (séparément)

### Workflow de modification d'intervention

1. **Mettre à jour l'intervention** avec `updateIntervention()` (sans employés ni superviseur)
2. **Gérer les employés** : ajouter/supprimer via `assignEmployeeToIntervention()` et `removeEmployeeFromIntervention()`
3. **Gérer le superviseur** : assigner/retirer via `assignSuperviseurToIntervention()` et `updateIntervention({ superviseur: undefined })`

### Affichage dans les composants

**Dans InterventionDetails.tsx :**
- **Superviseur** : Chargé depuis `intervention.superviseur`
- **Employés** : Chargés via `getInterventionEmployees()`

**Séparation visuelle :**
- **Section "Superviseur"** : Affiche le superviseur assigné
- **Section "Intervenants"** : Affiche les employés assignés

### Avantages de cette approche

1. **Clarté conceptuelle** : Le superviseur a un rôle distinct des employés
2. **Contrainte métier** : Un seul superviseur par intervention
3. **Flexibilité** : Les employés peuvent être multiples
4. **Cohérence** : Le superviseur est toujours un employé existant
5. **Performance** : Pas besoin de filtrer les employés pour identifier le superviseur 