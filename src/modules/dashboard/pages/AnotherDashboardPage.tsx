import Layout from '@/components/Layout';
import { useState } from 'react';

const DCATInterface = () => {
  const [activeSection, setActiveSection] = useState('');
  
  const handleSectionClick = (section:any) => {
    setActiveSection(section);
    alert(`Section sélectionnée: ${section}`);
  };
  
  return (
    <Layout>
    <div className="flex flex-col w-full h-full mx-auto border-4 border-gray-700 bg-white">
      {/* Header */}
      <div className="flex items-center bg-blue-600 text-white p-2">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center relative">
            <span className="text-white font-bold text-xl">DCAT</span>
            <div className="absolute top-1 right-1 w-3 h-3 bg-gray-200"></div>
          </div>
        </div>
        <div className="ml-6 text-xl italic">
          Bienvenue sur le site de gestion de DCAT...
        </div>
      </div>
      
      {/* Direction Générale */}
      <div className="bg-blue-200 p-4 text-center font-bold text-2xl border-t-2 border-b-2 border-gray-400">
        DIRECTION GENERALE
      </div>
      
      {/* Main Content - 3 columns */}
      <div className="flex flex-col md:flex-row">
        {/* DAF Section */}
        <div className="flex-1 flex flex-col border-r border-gray-400">
          <div className="bg-gray-500 p-3 text-center font-bold text-xl text-white">
            DAF
          </div>
          
          <div className="flex flex-col h-full">
            <div className="flex flex-row">
              <div className="w-1/2 bg-yellow-600 p-2 text-center font-semibold text-white border border-black">
                GESTION DES RESSOURCES
              </div>
              <div className="w-1/2 bg-green-200 p-2 text-center font-semibold border border-black">
                OPERATIONS ADMISTRATIVES
              </div>
            </div>
            
            <div className="flex flex-row">
              <div className="w-1/3 bg-orange-400 p-2 text-center font-semibold border border-black">
                RH
              </div>
              <div className="w-1/3 bg-green-600 p-2 text-center font-semibold border border-black">
                RM
              </div>
              <div className="w-1/3 bg-purple-500 p-2 text-center font-semibold border border-black">
                RF
              </div>
            </div>
            
            <div className="bg-red-600 p-2 text-center font-semibold text-white border border-black">
              OPERATIONS FINANCIERES
            </div>
            
            <div className="bg-green-500 p-2 text-center font-semibold mt-auto border border-black">
              PLANNING - DAF
            </div>
          </div>
        </div>
        
        {/* DMC Section */}
        <div className="flex-1 flex flex-col border-r border-gray-400">
          <div className="bg-orange-500 p-3 text-center font-bold text-xl">
            DMC
          </div>
          
          <div className="flex flex-col h-full">
            <div className="flex">
              <div className="w-1/2">
                <div className="bg-yellow-100 p-2 text-center font-semibold border border-black" 
                     onClick={() => handleSectionClick('PRODUITS')}>
                  PRODUITS
                </div>
                <div className="bg-yellow-700 p-2 text-center font-semibold border border-black" 
                     onClick={() => handleSectionClick('PRIX')}>
                  PRIX
                </div>
                <div className="bg-orange-600 p-2 text-center font-semibold border border-black" 
                     onClick={() => handleSectionClick('PROMOTIONS')}>
                  PROMOTIONS
                </div>
                <div className="bg-yellow-800 p-2 text-center font-semibold border border-black" 
                     onClick={() => handleSectionClick('DISTRIBUTION / VENTE')}>
                  DISTRIBUTION / VENTE
                </div>
              </div>
              <div className="w-1/2 flex flex-col">
                <div className="bg-amber-700 p-2 h-24 text-center font-semibold flex items-center justify-center border border-black" 
                     onClick={() => handleSectionClick('TABLEAU DE BORD')}>
                  <span>TABLEAU DE BORD/Performances équipe</span>
                </div>
                <div className="bg-pink-700 p-2 h-24 text-center font-semibold flex items-center justify-center text-white border border-black" 
                     onClick={() => handleSectionClick('DOSSIERS DMC')}>
                  DOSSIERS DMC
                </div>
              </div>
            </div>
            
            <div className="bg-green-500 p-2 text-center font-semibold mt-auto border border-black">
              PLANNING - DCM
            </div>
          </div>
        </div>
        
        {/* DSEI Section */}
        <div className="flex-1 flex flex-col">
          <div className="bg-blue-500 p-3 text-center font-bold text-xl text-white">
            DSEI
          </div>
          
          <div className="flex flex-col h-full">
            <div className="flex">
              <div className="w-1/2">
                <div className="bg-yellow-300 p-2 h-14 text-center font-semibold flex items-center justify-center border border-black" 
                     onClick={() => handleSectionClick('INTERVENTION TECHNIQUES')}>
                  INTERVENTION TECHNIQUES
                </div>
                <div className="bg-pink-200 p-2 text-center font-semibold border border-black" 
                     onClick={() => handleSectionClick('LABO')}>
                  LABO
                </div>
              </div>
              <div className="w-1/2">
                <div className="bg-orange-300 p-2 h-20 text-center font-semibold flex items-center justify-center border border-black" 
                     onClick={() => handleSectionClick('PROJETS')}>
                  PROJETS
                </div>
              </div>
            </div>
            
            <div className="bg-blue-400 p-2 h-24 text-center font-semibold flex items-center justify-center border border-black" 
                 onClick={() => handleSectionClick('DOSSIERS DSEI')}>
              DOSSIERS DSEI
            </div>
            
            <div className="bg-green-500 p-2 text-center font-semibold mt-auto border border-black">
              PLANNING - DSEI
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 bg-yellow-50 p-3 text-center font-semibold border border-gray-300" 
             onClick={() => handleSectionClick('MANUEL DES PROCEDURES')}>
          MANUEL DES PROCEDURES
        </div>
        <div className="flex-1 bg-blue-50 p-3 text-center font-semibold border border-gray-300" 
             onClick={() => handleSectionClick('LISTE-CONTACTS')}>
          LISTE-CONTACTS -PLANNING DU PERSONNEL ET DES PRESTATAIRES
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default DCATInterface;