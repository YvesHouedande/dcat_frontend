import React from 'react';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="text-center">
        <AlertTriangle 
          className="mx-auto mb-6 animate-pulse text-yellow-500" 
          size={80} 
        />
        <h1 className="text-4xl font-bold mb-4">404 - Page Non Trouvée</h1>
        <p className="text-xl opacity-50">
          Désolé, la page que vous recherchez n'existe pas. @blockchain.com
        </p>
      </div>
    </div>
  );
};

export default NotFound;