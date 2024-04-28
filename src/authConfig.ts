import { UserManagerSettings } from "oidc-client-ts";

const scopes = "legalConnect_developer_api_gateway legalConnect_lawyer_api legalConnect_appointment_api legalConnect_document_api legalConnect_identity_server_api legalConnect_payment_api legalConnect_client_api openid profile email"

const authConfig: UserManagerSettings = {
    authority: 'https://localhost:5001', //Replace with your issuer URL
    client_id: 'PK-f2452390-49d6-4c20-a438-26ac3a08ad9e', //Replace with your client id
    redirect_uri: 'http://localhost:3000/callback',
    response_type: 'code',
    scope: scopes,
    post_logout_redirect_uri: 'http://localhost:3000/',
    response_mode: 'query',
  };


 export default authConfig;