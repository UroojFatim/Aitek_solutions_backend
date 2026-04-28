import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import 'dotenv/config';

let cachedClient = null;

/**
 * Initialize Microsoft Graph client with Azure credentials
 * Uses service-to-service authentication (no user interaction needed)
 */
export function getMicrosoftGraphClient() {
  if (cachedClient) return cachedClient;

  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error(
      "Azure OAuth env vars not set. Add to .env:\n" +
      "AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET"
    );
  }

  try {
    const credential = new ClientSecretCredential(
      tenantId,
      clientId,
      clientSecret
    );

    const client = Client.init({
      authProvider: async (done) => {
        try {
          const response = await credential.getToken(
            'https://graph.microsoft.com/.default'
          );
          done(null, response.token);
        } catch (err) {
          done(err);
        }
      }
    });

    cachedClient = client;
    return client;
  } catch (err) {
    throw new Error(`Failed to initialize Microsoft Graph client: ${err.message}`);
  }
}

/**
 * Verify Microsoft authentication is working
 * Useful for debugging
 */
export async function verifyMicrosoftAuth() {
  try {
    const client = getMicrosoftGraphClient();
    const user = await client.api('/me').get();
    console.log('✅ Microsoft Graph authenticated as:', user.mail || user.userPrincipalName);
    return user;
  } catch (err) {
    console.error('❌ Microsoft auth failed:', err.message);
    throw err;
  }
}