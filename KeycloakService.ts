import Keycloak from 'keycloak-js';

// Configuration de Keycloak
const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENTID,
});


export default keycloak;