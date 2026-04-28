// utils/googleOAuthClient.js
import { google } from "googleapis";
import "dotenv/config";

// Helper to check if error is related to invalid/expired credentials
export function isAuthError(error) {
  const authErrorCodes = [401, 403];
  const authErrorMessages = ['invalid_grant', 'invalid_token', 'Token has been expired'];
  
  return (
    authErrorCodes.includes(error?.code) ||
    authErrorCodes.includes(error?.response?.status) ||
    authErrorMessages.some(msg => error?.message?.includes(msg))
  );
}

export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth env vars are not set.");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthedGoogleClients() {
  const oauth2Client = getOAuth2Client();

  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error(
      "GOOGLE_OAUTH_REFRESH_TOKEN not set. Run the OAuth flow once to obtain it."
    );
  }

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  // Auto-refresh access tokens when they expire
  oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      // If a new refresh token is issued, log it (you may want to update your .env)
      console.log('⚠️ New refresh token received:', tokens.refresh_token);
      console.log('⚠️ Update GOOGLE_OAUTH_REFRESH_TOKEN in your environment variables');
    }
    if (tokens.access_token) {
      console.log('✅ Access token refreshed successfully');
    }
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  // Best-effort: log which Google account is authenticated (requires Drive scope)
  (async () => {
    try {
      const about = await drive.about.get({ fields: 'user' });
      const email = about?.data?.user?.emailAddress;
      if (email) {
        console.log('✅ Google API authenticated as:', email);
      }
    } catch (e) {
      // non-fatal; missing scope or network
    }
  })();

  return { drive, sheets, auth: oauth2Client };
}
