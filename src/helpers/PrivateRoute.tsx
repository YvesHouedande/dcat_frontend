// import React, { useEffect } from 'react';
// import React from 'react';
// import { useKeycloak } from '@react-keycloak/web';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  // const { keycloak, initialized } = useKeycloak();

  // useEffect(() => {
  //   if (initialized && !keycloak.authenticated) {
  //     keycloak.login(); 
  //   }
  // }, [initialized, keycloak]);

  // if (!initialized) {
  //   return <div>Chargement...</div>; 
  // }

  // return keycloak.authenticated ? element : null; 
  return element
};

export default PrivateRoute;
