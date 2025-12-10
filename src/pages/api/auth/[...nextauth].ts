import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import DiscordProvider from 'next-auth/providers/discord';

const GOOGLE_AUTHORIZATION_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
  });

/**
 * Function to refresh access token for Google & LinkedIn
 */
async function refreshAccessToken(token) {
  try {
    if (!token.refreshToken || token.provider === 'discord') {
      return token;
    }

    let url;
    const searchParams = new URLSearchParams();

    if (token.provider === 'google') {
      url = 'https://oauth2.googleapis.com/token';
      searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID);
      searchParams.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
    } else if (token.provider === 'linkedin') {
      url = 'https://www.linkedin.com/oauth/v2/accessToken';
      searchParams.append('client_id', process.env.LINKEDIN_CLIENT_ID);
      searchParams.append('client_secret', process.env.LINKEDIN_CLIENT_SECRET);
    } else {
      return token;
    }

    searchParams.append('grant_type', 'refresh_token');
    searchParams.append('refresh_token', token.refreshToken);

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      body: searchParams.toString(),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: GOOGLE_AUTHORIZATION_URL,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      client: { token_endpoint_auth_method: 'client_secret_post' },
      issuer: 'https://www.linkedin.com',
      profile: profile => {
        return {
          id: profile?.sub,
          name:
            profile.name ||
            `${profile.localizedFirstName} ${profile.localizedLastName}`,
          email: profile.email,
          image: profile.picture,
        };
      },
      wellKnown:
        'https://www.linkedin.com/oauth/.well-known/openid-configuration',
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          provider: account.provider,
          image: user.image,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_in
            ? Date.now() + Number(account.expires_in) * 1000
            : null,
          refreshToken: account.refresh_token || null,
          user,
        };
      }

      if (
        typeof token.accessTokenExpires === 'number' &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token.user;
      //@ts-ignore
      session.image = token.user.image;
      //@ts-ignore
      session.accessToken = token.accessToken;
      //@ts-ignore
      session.error = token.error;
      return session;
    },
  },
});
