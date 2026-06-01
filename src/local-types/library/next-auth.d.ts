declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    expires: string;
  }

  interface JWT {
    accessToken?: string;
  }
}
