// import Layout from "@/components/Layout";

// import React, { useState, useEffect } from "react";

// // Composant enfant
// const Enfant = ({ valeur }) => {
//   console.log("Rendu de l'enfant:", valeur);

//   return <div>Enfant: {valeur}</div>;
// };

// const Enfants = React.memo(Enfant);

// // Composant parent
// const Parent = () => {
//   const [compteur, setCompteur] = useState(0);
//   const [compteur1, setCompteur1] = useState(0);

//   useEffect(() => {
//     // Mettre à jour 'compteur' toutes les secondes
//     const interval = setInterval(() => {
//       setCompteur((prevCompteur) => prevCompteur + 1);
//       setCompteur1((prevCompteur) => prevCompteur);
//     }, 1000);

//     // Nettoyage du setInterval au démontage du composant
//     return () => clearInterval(interval);
//   }, []); // Le useEffect s'exécute une seule fois lors du montage du parent

//   console.log("Rendu du parent:", compteur);

//   return (
//     <div>
//       <h1>Parent: {compteur}</h1>
//       <Enfants valeur={compteur1} /> {/* Passer la valeur au composant enfant */}
//     </div>
//   );
// };

// export default Parent;






// import { signal, effect } from "@preact/signals-react";

// import React from "react";

// // Composant enfant
// const Enfant = ({ valeur }) => {
//   console.log("Rendu de l'enfant:", valeur);
//   return <div>Enfant: {valeur}</div>;
// };

// // Version corrigée - utilise le signal directement
// const EnfantAvecSignal = ({ compteur }) => {
//   console.log("Rendu de l'enfant avec signal:", compteur);
//   return <div>Enfant: {compteur}</div>;
// };

// // Composant parent
// const Parent = () => {
//   // Déclarer des signaux
//   const compteur = signal(0);
//   const compteur1 = signal(0);



//   console.log("Rendu du parent:", compteur.value);

//   return (
//     <div>
//       <h1 onClick={() => compteur.value++}>Parent: {compteur.value}</h1>
      
//       {/* Passer le signal complet plutôt que juste sa valeur */}
//       <EnfantAvecSignal compteur={compteur1} />
//     </div>
//   );
// };

// export default Parent;



import { useMemo, useState } from "react";

function ExpensiveComponent({ num }) {
  // Calcule un carré uniquement si `num` change
  const squared = useMemo(() => {
    console.log("Calcul en cours...");
    return num * num;
  }, [num]);

  return <p>Résultat : {squared}</p>;
}

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Incrementer</button>
      <ExpensiveComponent num={5} />
    </div>
  );
}

